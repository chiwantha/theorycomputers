import { query } from "@/lib/db";
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
  ON gd.grn_header_id = gh.id
WHERE gh.state = 1
GROUP BY gh.id;`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json({ error: `No Grn Found !` }, { status: 200 });
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
