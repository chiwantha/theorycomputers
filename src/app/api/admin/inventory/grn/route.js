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
  const connection = await pool.getConnection(); // get a dedicated connection
  try {
    const data = await request.formData();

    // Parse GRN items
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

    const generatePlaceholders = (rows, columns) =>
      Array(rows)
        .fill(`(${Array(columns).fill("?").join(",")})`)
        .join(",");

    // Start transaction
    await connection.beginTransaction();

    // 1️⃣ Insert GRN header
    const [header_result] = await connection.execute(
      `INSERT INTO grn_header (grn_no, supplier_id, po_id, invoice_no, total, date)
       VALUES (?,?,?,?,?,NOW())`,
      [grn_no, supplier_id, po_id, invoice_no, total],
    );

    if (!header_result.insertId) throw new Error("Insert GRN header failed");
    const grn_header_id = header_result.insertId;

    // 2️⃣ Insert GRN details
    if (grn_items.length > 0) {
      const values_details = grn_items.flatMap((item) => [
        grn_header_id,
        item.item_id,
        item.quantity,
        item.cost,
        item.total,
      ]);
      const placeholders_details = generatePlaceholders(grn_items.length, 5);
      await connection.execute(
        `INSERT INTO grn_details (header_id, item_id, quantity, unit_cost, line_total)
         VALUES ${placeholders_details}`,
        values_details,
      );
    }

    // 3️⃣ Insert serials if any
    const serial_rows = grn_items.flatMap((item) =>
      item.is_serial === 1
        ? item.serials.map((serial) => [item.item_id, serial, 1])
        : [],
    );
    if (serial_rows.length > 0) {
      const placeholders_serials = generatePlaceholders(serial_rows.length, 3);
      await connection.execute(
        `INSERT INTO stock_items_serials (item_id, serial, stock)
         VALUES ${placeholders_serials}`,
        serial_rows.flat(),
      );
    }

    // 4️⃣ Insert/update stock (UPSERT)
    const stock_rows = grn_items.map((item) => [item.item_id, item.quantity]);
    if (stock_rows.length > 0) {
      const placeholders_stock = generatePlaceholders(stock_rows.length, 2);
      await connection.execute(
        `INSERT INTO stock (item_id, quantity)
         VALUES ${placeholders_stock}
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        stock_rows.flat(),
      );
    }

    // 2️⃣ Insert GRN details
    if (grn_items.length > 0) {
      const values_movements = grn_items.flatMap((item) => [
        item.item_id,
        "IN",
        item.quantity,
        `GRN`,
        grn_header_id,
      ]);
      const placeholders_movements = generatePlaceholders(grn_items.length, 5);
      await connection.execute(
        `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id)
         VALUES ${placeholders_movements}`,
        values_movements,
      );
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // Rollback if anything fails
    await connection.rollback();
    console.log("Transaction failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release(); // release connection back to pool
  }
};
