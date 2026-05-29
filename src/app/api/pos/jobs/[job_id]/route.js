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

    const itemsSql = `SELECT job_items.*, mst_items.name AS item_name, mst_items.is_serial AS serial,  mst_items.type AS item_type FROM job_items
    INNER JOIN mst_items ON mst_items.id = job_items.item_id WHERE job_items.header_id = ?`;
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
