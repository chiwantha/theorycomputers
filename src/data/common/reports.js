import { query } from "@/lib/db";

export const load_rpt_stock = async (item_id) => {
  try {
    let sql_query;
    const sql = `SELECT 
    stock.*, 
     CASE 
        WHEN stock.quantity < COALESCE(mst_items.reorder_level, 0) 
        THEN 'LOW' 
        ELSE 'NORMAL' 
    END AS stock_level,
    mst_items.name, 
    mst_items.cost, 
    (stock.quantity * mst_items.cost) AS stock_average_worth
FROM stock
INNER JOIN mst_items 
    ON mst_items.id = stock.item_id 
WHERE mst_items.state = 1`;
    const sql2 = `SELECT 
    stock.*, 
    mst_items.name, 
    mst_items.cost, 
    (stock.quantity * mst_items.cost) AS stock_average_worth
FROM stock
INNER JOIN mst_items 
    ON mst_items.id = stock.item_id 
WHERE mst_items.state = 1 AND mst_items.id=${item_id}`;

    if (item_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Stock !`, err);
    return [];
  }
};

export const load_rpt_job_list = async () => {
  try {
    const sql = `
      SELECT
        jh.id,
        jh.job_no,

        CASE
          WHEN jd.inv_header_id IS NOT NULL THEN jd.inv_header_id
          ELSE 'None'
        END AS warranty,

        jh.gross,
        jh.discount,
        jh.net,

        CASE
          WHEN jh.state = 0 THEN 'PENDING'
          WHEN jh.state = 1 THEN 'STARTED'
          WHEN jh.state = 2 THEN 'FINISHED'
          WHEN jh.state = 3 THEN CONCAT('PAID - ', ih.inv_no)
          WHEN jh.state = 4 THEN 'CANCELLED'
          ELSE 'ERR'
          END AS state,
          
          CASE
          WHEN jd.serial IS NOT NULL THEN jd.serial
          ELSE 'None'
          END AS serial,
          CONCAT( brandt.name, ' / ', catt.name) AS brand_cat,
          
        CONCAT(ct.first_name, ' ', ct.last_name) AS customer_name,
        ct.phone AS customer_phone

      FROM job_header jh

      INNER JOIN customers ct
        ON ct.id = jh.customer_id

      LEFT JOIN job_details jd
        ON jd.header_id = jh.id

      LEFT JOIN mst_brand brandt
        ON brandt.id = jd.brand_id

      LEFT JOIN mst_category catt
        ON catt.id = jd.category_id

      LEFT JOIN inv_header ih
        ON ih.id = jh.invoice_id

      WHERE
        DATE(jh.created_at) = CURDATE()
        OR jh.state = 0
        OR DATE(jh.updated_at) = CURDATE()

        ORDER BY
    jh.state ASC,
    jh.updated_at DESC;
    `;

    const data = await query(sql);

    return data || [];
  } catch (err) {
    console.log("Error Loading Job List!", err);
    return [];
  }
};
