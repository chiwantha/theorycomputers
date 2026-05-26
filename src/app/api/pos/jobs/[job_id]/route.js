import { query } from "@/lib/db";
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

    const detailsSql = `SELECT job_details.*, mst_category.name AS category_name, mst_brand.name AS brand_name FROM job_details
    INNER JOIN mst_category ON job_details.category_id = mst_category.id
    INNER JOIN mst_brand ON job_details.brand_id = mst_brand.id WHERE header_id = ?`;
    const detailsRes = await query(detailsSql, [job_id]);
    if (!detailsRes || detailsRes.length == 0) {
      return NextResponse.json(
        { error: `No Job Details Found !` },
        { status: 404 },
      );
    }
    // console.log(`Details : `, detailsRes);

    const itemsSql = `SELECT * FROM job_items WHERE header_id = ?`;
    const itemsRes = await query(itemsSql, [job_id]);
    if (!itemsRes || itemsRes.length == 0) {
      return NextResponse.json(
        { error: `No Job Items Found !` },
        { status: 404 },
      );
    }
    // console.log(`Items : `, itemsRes);

    const itemSerialsSql = `SELECT * FROM stock_items_serials WHERE reference=? AND reference_id=?`;
    const itemSerialsRes = await query(itemSerialsSql, [`JOB`, job_id]);
    // console.log(`Serials : `, itemSerialsRes);

    const jobData = { headerRes, customerRes, detailsRes, itemsRes };

    return NextResponse.json(jobData, { status: 200 });
  } catch (err) {
    console.log(`Invernal Server Error ! :`, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};
