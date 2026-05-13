import pool, { query } from "@/lib/db";
import { calculateGrnTotal } from "@/lib/utils";
import { validateGrnItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT 
  gh.*, 
  ms.name AS supplier_name,
  COUNT(gd.id) AS item_count
FROM grn_header gh
INNER JOIN mst_suppliers ms 
  ON ms.id = gh.supplier_id
LEFT JOIN grn_details gd 
  ON gd.header_id = gh.id
WHERE gh.state = 1
GROUP BY gh.id;`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json({ error: `No Grn Found !` }, { status: 404 });
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
    // extract the data
    const data = await request.formData();
    const grn_items = JSON.parse(data.get("grn_items"));
    const validation = validateGrnItems(grn_items);
    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const grn_no = data.get("grn_no");
    const supplier_id = data.get("supplier_id");
    const po_id = data.get("po_id");
    const invoice_no = data.get("invoice_no");
    const total = calculateGrnTotal(grn_items);

    // now lets start
    await connection.beginTransaction();

    // 1 insert header

    const insert_header_sql = `INSERT INTO grn_header (grn_no, supplier_id, po_id, invoice_no, total, date)
       VALUES (?,?,?,?,?,NOW())`;
    const [ResultSetHeader] = await connection.execute(insert_header_sql, [
      grn_no,
      supplier_id,
      po_id,
      invoice_no,
      total,
    ]);
    if (!ResultSetHeader.insertId) throw new Error("Insert GRN Header failed");
    const grn_header_id = ResultSetHeader.insertId;

    // insert details

    if (grn_items.length > 0) {
      for (const item of grn_items) {
        // insert grn details
        const insert_details_sql = `INSERT INTO grn_details (header_id, item_id, quantity, unit_cost, line_total) VALUES (?,?,?,?,?)`;
        const values = [
          grn_header_id,
          item.itemId,
          item.quantity,
          item.cost,
          item.lineTotal,
        ];
        const [ResultSetDetails] = await connection.execute(
          insert_details_sql,
          values,
        );
        if (!ResultSetDetails.insertId)
          throw new Error("Insert GRN Details failed");

        // update item cost
        const get_current_stock = `
        SELECT 
          stock.quantity,
          (mst_items.cost * stock.quantity) AS value
        FROM stock
        INNER JOIN mst_items 
          ON mst_items.id = stock.item_id
        WHERE stock.item_id=?
      `;
        const [resultCurrentStock] = await connection.execute(
          get_current_stock,
          [item.itemId],
        );

        const currentQty = resultCurrentStock[0]?.quantity || 0;
        const currentValue = resultCurrentStock[0]?.value || 0;

        // weighted average cost
        const averageCost =
          (Number(currentValue) + Number(item.lineTotal)) /
          (Number(currentQty) + Number(item.quantity));
        const update_item_cost_sql = `
          UPDATE mst_items 
          SET cost=? 
          WHERE id=?
        `;
        const update_cost_values = [averageCost, item.itemId];
        const [ResultUpdateCost] = await connection.execute(
          update_item_cost_sql,
          update_cost_values,
        );
        if (!ResultUpdateCost.affectedRows)
          throw new Error("Update Cost failed");

        // update stocks
        const update_stock_sql = `INSERT INTO stock (item_id, quantity)  VALUES (?,?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`;
        const stock_values = [item.itemId, item.quantity];
        const [ResultUpdateStock] = await connection.execute(
          update_stock_sql,
          stock_values,
        );
        if (!ResultUpdateStock.affectedRows)
          throw new Error("Update Stock failed");

        // update serials
        if (item.is_serial) {
          const insert_serial_sql = `INSERT INTO stock_items_serials (item_id, serial, stock) VALUES (?,?,?)`;
          for (const serial of item.serials) {
            const values = [item.itemId, serial, 1];
            const [ResultSetSerials] = await connection.execute(
              insert_serial_sql,
              values,
            );
            if (!ResultSetSerials.insertId)
              throw new Error("Insert Serials failed");
          }
        }

        // insert movements
        const insert_stock_movements_sql = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id) VALUES (?,?,?,?,?)`;
        const movement_values = [
          item.itemId,
          "IN",
          item.quantity,
          `GRN`,
          ResultSetDetails.insertId,
        ];
        const [ResultSetStockMovement] = await connection.execute(
          insert_stock_movements_sql,
          movement_values,
        );
        if (!ResultSetStockMovement.insertId)
          throw new Error("Insert Stock Movements failed");
      }
    } else {
      throw new Error("No GRN Details Found !");
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};
