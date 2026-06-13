import pool, { query } from "@/lib/db";
import { validateFields, validateJobItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    const { job_id } = await params;
    // console.log(job_id);

    const headerSql = `SELECT * FROM job_header WHERE id = ?`;
    const headerRes = await query(headerSql, [job_id]);
    if (!headerRes || headerRes.length == 0) {
      return NextResponse.json({ error: `No Job Found !` }, { status: 404 });
    }
    // console.log(`Header : `, headerRes[0]);

    const customerSql = `SELECT id, CONCAT(first_name, " ", last_name) AS customerName,
     phone AS customerPhone FROM customers WHERE id = ?`;
    const customerRes = await query(customerSql, [headerRes[0]?.customer_id]);
    if (!customerRes || customerRes.length == 0) {
      return NextResponse.json(
        { error: `No Customer Found !` },
        { status: 404 },
      );
    }
    // console.log(`Customer : `, customerRes[0]);

    const detailsSql = `
      SELECT 
          job_details.*,
          mst_items.name AS item_name,
          mst_category.name AS category_name,
          mst_brand.name AS brand_name
      FROM job_details
      LEFT JOIN mst_items 
          ON job_details.item_id = mst_items.id
      LEFT JOIN mst_category 
          ON mst_category.id = COALESCE(
          job_details.category_id,
          mst_items.category_id
      )
      LEFT JOIN mst_brand 
          ON mst_brand.id = COALESCE(
          job_details.brand_id,
          mst_items.brand_id
      )
      WHERE header_id = ?`;
    const detailsRes = await query(detailsSql, [job_id]);
    if (!detailsRes || detailsRes.length == 0) {
      return NextResponse.json(
        { error: `No Job Details Found !` },
        { status: 404 },
      );
    }
    // console.log(`Details : `, detailsRes);

    const itemsSql = `SELECT job_items.*, mst_items.name AS item_name, mst_items.is_serial AS serial,  mst_items.type AS item_type , mst_items.cost AS unit_cost, 
    mst_items.warranty_id AS warranty_id , mst_warranty.name AS warranty_name ,  mst_warranty.duration AS warranty_duration
    FROM job_items
    INNER JOIN mst_items ON mst_items.id = job_items.item_id
    LEFT JOIN mst_warranty ON mst_items.warranty_id = mst_warranty.id
    JOIN job_header ON job_items.header_Id = job_header.id
    WHERE job_items.header_id = ? AND (
    CASE 
        WHEN job_header.state BETWEEN 0 AND 3 THEN job_items.state = 1
        WHEN job_header.state >= 4 THEN job_items.state = 0
    END
)`;
    const itemsRes = await query(itemsSql, [job_id]);
    // if (!itemsRes || itemsRes.length == 0) {
    //   return NextResponse.json(
    //     { error: `No Job Items Found !` },
    //     { status: 404 },
    //   );
    // }
    // console.log(`Items : `, itemsRes);

    const itemSerialsSql = `SELECT * FROM stock_items_serials WHERE reference=? AND reference_id=?`;
    const itemSerialsRes = await query(itemSerialsSql, [`JOB`, job_id]);
    // console.log(`Serials : `, itemSerialsRes);

    const serialMap = new Map();

    for (const s of itemSerialsRes) {
      if (!serialMap.has(s.item_id)) {
        serialMap.set(s.item_id, []);
      }
      serialMap.get(s.item_id).push(s.serial);
    }

    const jobItems = itemsRes.map((item) => ({
      ...item,
      serials: item.serial === 1 ? serialMap.get(item.item_id) || [] : [],
    }));

    const jobData = {
      headerRes,
      customerRes,
      detailsRes,
      jobItems,
    };

    return NextResponse.json(jobData, { status: 200 });
  } catch (err) {
    console.log(`Invernal Server Error ! :`, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const PUT = async (request, { params }) => {
  const connection = await pool.getConnection();
  try {
    const { job_id } = await params;
    const header_id = job_id;
    const data = await request.formData();

    // console.log(`Job Id : ${job_id} , Job Data : ${data}`);
    // console.log(data);

    const jobItems = JSON.parse(data.get("jobItems"));
    const grossTotal = data.get(`grossTotal`);
    const discount = data.get(`discount`);
    const netTotal = data.get(`netTotal`);
    const section = data.get(`section`);
    const username = data.get(`username`);
    const password = data.get(`password`);
    const accessories = data.get(`accessories`);
    const problem = data.get(`problem`);

    if (section === "HEADER") {
      let validate = validateFields(
        {
          problem,
        },
        [`problem`],
      );
      if (!validate.isValid) {
        throw new Error(validate.emptyFields);
      }
    } else if (section === "ITEMS") {
      if (jobItems.length > 0) {
        const validation = validateJobItems(jobItems);
        if (validation.error) {
          throw new Error(validation.error);
        }

        // console.log(jobItems);
      }
    } else {
      throw new Error(`Unidentifined Function !`);
    }

    await connection.beginTransaction();

    if (section === "HEADER") {
      const sql = `UPDATE job_details SET username=?, password=?, accessories=?, problem=? WHERE header_id=? `;
      const [resHeaderUpdate] = await connection.execute(sql, [
        username || null,
        password || null,
        accessories || null,
        problem,
        job_id,
      ]);
      if (resHeaderUpdate.affectedRows === 0) {
        throw new Error(`Update Job Details Failed !`);
      }
    } else if (section === "ITEMS") {
      // LOAD CURRENT FOR REVERSE STOCK
      await reverseStock(connection, job_id);

      // INSERT NEW JOB ITEMS
      if (jobItems.length > 0) {
        for (const item of jobItems) {
          // INSERT JOB ITEMS
          const jobItemSql = `INSERT INTO job_items (header_id, item_id, billing, unit_price, quantity, line_total) VALUES (?,?,?,?,?,?)`;
          const [resJobItem] = await connection.execute(jobItemSql, [
            header_id,
            item.itemId,
            item.billing,
            item.unitPrice,
            item.quantity,
            item.lineTotal,
          ]);
          if (!resJobItem.insertId) {
            throw new Error(`Job Item Failed !`);
          }

          // UPDATE STOCK
          if (item.itemType == "P") {
            const updateStockSql = `UPDATE stock SET quantity = quantity - ? WHERE item_id = ?`;
            const [resUpdateStock] = await connection.execute(updateStockSql, [
              item.quantity,
              item.itemId,
            ]);
            if (resUpdateStock.affectedRows === 0) {
              throw new Error(`Update Stock Failed !`);
            }
          }

          // HANDLE SERIAL
          if (item.serial) {
            const serials = item.serials;
            for (const serial of serials) {
              // UPDATE SERIAL STOCK
              const updateSerialStock = `UPDATE stock_items_serials SET stock = ? , reference = ? , reference_id = ? WHERE serial = ?`;
              const [resUpdateSerialStock] = await connection.execute(
                updateSerialStock,
                [0, `JOB`, header_id, serial],
              );
              if (resUpdateSerialStock.affectedRows === 0) {
                throw new Error(`Update Serial Stock Failed !`);
              }
            }
          }

          if (item.itemType == "P") {
            // LOG STOCK MOVEMENTS
            const logStockMovements = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id) VALUES (?,?,?,?,?)`;
            const [resStockMovements] = await connection.execute(
              logStockMovements,
              [item.itemId, `OUT`, item.quantity, `JOB`, header_id],
            );
            if (!resStockMovements.insertId) {
              throw new Error(`Stock Movements Logging Failed !`);
            }
          }
        }

        // UPDATE TOTALS FOR JOB HEADER
        const updateHeaderTotals = `UPDATE job_header SET gross=?, discount=?, net=? WHERE id=?`;
        const [resUpdateHeaderTotals] = await connection.execute(
          updateHeaderTotals,
          [grossTotal, discount, netTotal, job_id],
        );
        if (resUpdateHeaderTotals.affectedRows === 0) {
          throw new Error(`Update Header Totals Failed !`);
        }
      }
    }

    // throw new Error(`Stop for Testing !`);
    await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};

export const reverseStock = async (connection, job_id) => {
  const existItemsSql = `SELECT job_items.*, mst_items.type AS item_type FROM job_items
      INNER JOIN mst_items ON mst_items.id = job_items.item_id WHERE job_items.header_id = ?`;
  const [resCurrentRecords] = await connection.execute(existItemsSql, [job_id]);

  if (resCurrentRecords.length !== 0) {
    // reverse stock items
    for (const row of resCurrentRecords) {
      // console.log(`Row No : ${row?.id} ,`, row);
      if (row?.item_type === `P`) {
        const updateStockSql = `UPDATE stock SET quantity=quantity+? WHERE item_Id=?`;
        const [resUpdateStockSql] = await connection.execute(updateStockSql, [
          row?.quantity,
          row?.item_id,
        ]);
        if (resUpdateStockSql.affectedRows === 0) {
          throw new Error(`Stock Reverse Failed !`);
        }

        const insertStockMovementsSql = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id, note) VALUES (?,?,?,?,?,?)`;
        const [resInsertStockMovements] = await connection.execute(
          insertStockMovementsSql,
          [row?.item_id, `IN`, row?.quantity, `JOB`, job_id, `Reverse Stock`],
        );
        if (!resInsertStockMovements.insertId) {
          throw new Error(`Stock Movement Logging Failed !`);
        }
      }
    }

    // clear job_items
    const removeJobItemsSql = `DELETE FROM job_items WHERE header_id=?`;
    const [resRemoveJobItems] = await connection.execute(removeJobItemsSql, [
      job_id,
    ]);
    if (resRemoveJobItems.affectedRows === 0) {
      throw new Error(`Clear Job Items Failed !`);
    }

    // clear stock serials
    const clearStockSerials = `UPDATE stock_items_serials SET stock=?,reference=?, reference_id=? WHERE reference_id=?`;
    const [resClearStockSerials] = await connection.execute(clearStockSerials, [
      1,
      null,
      null,
      job_id,
    ]);
  }
};
