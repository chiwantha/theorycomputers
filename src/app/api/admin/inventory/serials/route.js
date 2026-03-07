import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT 
    stock_items_serials.*, 
    mst_items.name,
    CASE 
        WHEN stock_items_serials.stock = 1 THEN 'IN_STOCK'
        ELSE 'NOT_AVL'
    END AS stock_status
FROM stock_items_serials
INNER JOIN mst_items 
    ON mst_items.id = stock_items_serials.item_id
WHERE mst_items.state = 1 AND stock_items_serials.stock = 1
ORDER BY stock_items_serials.stock DESC, stock_items_serials.id ASC;`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json(
        { error: `No Stock Serial Found !` },
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

export const PUT = async (request) => {
  try {
    const data = await request.formData();

    const id = data.get(`id`);
    const serial = data.get(`serial`);

    if (!id || id == ``) {
      return NextResponse.json({ error: `Id Not Found !` }, { status: 404 });
    }

    const sql = `UPDATE stock_items_serials SET serial=? WHERE id=?`;
    const values = [serial, id];
    const res = await query(sql, values);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Update Failed` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Invernal Server Error ! :`, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};
