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

FROM adjustment_header ah;`;
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
  try {
    const data = await request.formData();
    console.log(data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log("Transaction failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
