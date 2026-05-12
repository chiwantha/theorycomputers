import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT 
    stock.*, 
    mst_items.name, 
    mst_items.cost, 
    (stock.quantity * mst_items.cost) AS stock_average_worth
FROM stock
INNER JOIN mst_items 
    ON mst_items.id = stock.item_id 
WHERE mst_items.state = 1;`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json({ error: `No Stock Found !` }, { status: 404 });
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
