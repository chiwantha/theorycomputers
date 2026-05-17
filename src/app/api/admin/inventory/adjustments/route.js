import pool, { query } from "@/lib/db";
import { validateAdjItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT
        ah.id,
        ah.adj_no,
        ah.type,
        ah.date ,
        (
            SELECT COUNT(ad.id)
            FROM adj_details ad
            WHERE ad.header_id = ah.id
        ) AS item_count,

        (
            SELECT SUM(ad.quantity * mi.cost)
            FROM adj_details ad
            INNER JOIN mst_items mi
                ON mi.id = ad.item_id
            WHERE ad.header_id = ah.id
            AND ad.type = 'P'
        ) AS totalP,

        (
            SELECT SUM(ad.quantity * mi.cost)
            FROM adj_details ad
            INNER JOIN mst_items mi
                ON mi.id = ad.item_id
            WHERE ad.header_id = ah.id
            AND ad.type = 'M'
        ) AS totalM

    FROM adj_header ah;`;

    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json(
        { error: `No Adjustments Found !` },
        { status: 404 },
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.log(`Invernal Server Error ! :`, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const POST = async (request) => {
  // get a dedicated connection
  const connection = await pool.getConnection();
  try {
    const data = await request.formData();
    const adj_items = JSON.parse(data.get("adjustment_items"));
    const validation = validateAdjItems(adj_items);
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const adjNo = data.get("adjNo");
    const type = data.get("type");
    const reason = data.get("reason");
    const note = data.get("note");

    await connection.beginTransaction();

    // set header
    const insert_header_sql = `INSERT INTO adj_header (adj_no, type, reason, note, date) VALUES (?,?,?,?,now())`;
    const [resSetHeader] = await connection.execute(insert_header_sql, [
      adjNo,
      type,
      reason,
      note,
    ]);
    if (!resSetHeader.insertId) {
      throw new Error("ADJ Header Failed !");
    }
    const adj_header_id = resSetHeader.insertId;

    // set details
    if (adj_items.length > 0) {
      for (const item of adj_items) {
        // insert adj details
        const insert_details_sql = `INSERT INTO adj_details (header_id, type, item_id, quantity, note) VALUES (?,?,?,?,?)`;
        const [resSetDetails] = await connection.execute(insert_details_sql, [
          adj_header_id,
          item.type,
          item.itemId,
          item.quantity,
          item.note,
        ]);
        if (!resSetDetails.insertId) {
          throw new Error("ADJ Details Failed !");
        }

        // update stocks
        const check_stock_sql = `SELECT quantity FROM stock WHERE item_id = ?`;
        const [resCheckStock] = await connection.execute(check_stock_sql, [
          item.itemId,
        ]);
        const values = [item.quantity, item.itemId];
        if (resCheckStock.length > 0) {
          if (item.type == "M") {
            values.push(item.quantity);
          }
          const update_stock_sql = `UPDATE stock SET quantity = quantity ${item.type == "P" ? `+` : `-`} ? WHERE item_id = ? ${item.type == "M" ? `AND quantity >= ?` : ``}`;
          const [resUpdateStock] = await connection.execute(
            update_stock_sql,
            values,
          );
          if (resUpdateStock.affectedRows === 0) {
            if (item.type == "M") {
              throw new Error("Insufficient Stock");
            }

            throw new Error("Update Stock Failed !");
          }
        } else {
          if (item.type == "M") {
            throw new Error("No Current Stock Found !");
          }

          const create_stock_sql = `INSERT INTO stock (quantity, item_id) VALUES (?,?)`;
          const [resCreateStock] = await connection.execute(
            create_stock_sql,
            values,
          );

          if (!resCreateStock.insertId) {
            throw new Error(`Create Stock Failed !`);
          }
        }

        // update serials
        if (item.serial) {
          const serials = item.serials;
          const placeholders = serials.map(() => "?").join(",");
          const check_serial_sql = `
            SELECT serial, stock, reference FROM stock_items_serials WHERE serial IN (${placeholders})`;
          const [resCheckSerial] = await connection.execute(
            check_serial_sql,
            item.serials,
          );

          if (resCheckSerial.length > 0) {
            const returnSerials = resCheckSerial;

            console.log(`sql serials : `, returnSerials);
            console.log(`entered serials : `, serials);

            // not in stock because adjustment ( can be reactivated )
            const matchingValidSerials = returnSerials
              .filter(
                (r) =>
                  serials.includes(r.serial) &&
                  r.stock == 0 &&
                  r.reference == "ADJ",
              )
              .map((r) => r.serial);
            console.log(
              "matching valid reactivatable : ",
              matchingValidSerials,
            );
            // not in stock because invoice ( can't be reactivated )
            const matchingSoldSerials = returnSerials
              .filter(
                (r) =>
                  serials.includes(r.serial) &&
                  r.stock == 0 &&
                  r.reference == "INV",
              )
              .map((r) => r.serial);
            console.log("matching sold invalid : ", matchingSoldSerials);
            // already in stock finely serials ( no need to reactivated )
            const matchingInStockSerials = returnSerials
              .filter(
                (r) =>
                  serials.includes(r.serial) &&
                  r.stock == 1 &&
                  r.reference == null,
              )
              .map((r) => r.serial);
            console.log(
              "matching no need to reactivate : ",
              matchingInStockSerials,
            );
            // not in system but newly entered serials
            const notMatchingSerials = serials.filter(
              (s) => !returnSerials.some((r) => r.serial === s),
            );
            console.log("not maching newly entered : ", notMatchingSerials);

            if (item.type == "P") {
              if (matchingValidSerials.length > 0) {
                for (const no of matchingValidSerials) {
                  const reactivate_serial_sql = `UPDATE stock_items_serials SET stock = 1 , reference = ?, reference_id = ? WHERE serial = ?`;
                  const resReactivateSerial = await connection.execute(
                    reactivate_serial_sql,
                    [`ADJ`, adj_header_id, no],
                  );
                  if (resReactivateSerial.affectedRows <= 0) {
                    throw new Error(`Reactivate Serials Failed !`);
                  }
                }
              }

              if (notMatchingSerials.length > 0) {
                for (const no of notMatchingSerials) {
                  const insert_new_serials = `INSERT INTO stock_items_serials (item_id, serial, stock) VALUES (?,?,?)`;
                  const [resNewSerial] = await connection.execute(
                    insert_new_serials,
                    [item.itemId, no, 1],
                  );
                  if (!resNewSerial.insertId) {
                    throw new Error(`Inser New Serials Failed !`);
                  }
                }
              }
            } else if (item.type == "M") {
              if (notMatchingSerials.length > 0) {
                throw new Error(`Invalid Serials : ${notMatchingSerials}`);
              }

              if (matchingSoldSerials.length > 0) {
                throw new Error(
                  `Serials Already Invoiced : ${matchingSoldSerials}`,
                );
              }

              if (matchingValidSerials.length > 0) {
                throw new Error(
                  `Serials Already Deactivated ${matchingValidSerials}`,
                );
              }

              if (matchingInStockSerials.length > 0) {
                for (const no of matchingInStockSerials) {
                  const deactivate_serials_sql = `UPDATE stock_items_serials SET stock=0, reference = ? ,reference_id = ? WHERE serial = ?`;
                  const resDeactivateSerial = await connection.execute(
                    deactivate_serials_sql,
                    [`ADJ`, adj_header_id, no],
                  );
                  if (resDeactivateSerial.affectedRows <= 0) {
                    throw new Error(`Serial Deactivate Failed !`);
                  }
                }
              }
            }
          } else {
            if (item.type == "M") {
              throw new Error(`Serials Not Available !`);
            }

            for (const perNewSerial of serials) {
              const insert_serials_sql = `INSERT INTO stock_items_serials (item_id, serial, stock) VALUES (?,?,?)`;
              const [resNewAdjSerial] = await connection.execute(
                insert_serials_sql,
                [item.itemId, perNewSerial, 1],
              );
              if (!resNewAdjSerial.insertId) {
                throw new Error(`Adj Plus Serials Failed !`);
              }
            }
          }
        }

        // stock movements update
        const stock_movements_sql = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id, note) VALUES (?,?,?,?,?,?)`;
        const [resStockMovements] = await connection.execute(
          stock_movements_sql,
          [
            item.itemId,
            item.type == "P" ? `IN` : `OUT`,
            item.quantity,
            `ADJ`,
            adj_header_id,
            item.note,
          ],
        );
        if (!resStockMovements.insertId) {
          throw new Error(`Stock Movements Failed !`);
        }
      }
    } else {
      throw new Error(`No Adjustment Items Found !`);
    }

    await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction failed:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};
