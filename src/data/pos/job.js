import { query } from "@/lib/db";

export const load_job_list = async () => {
  try {
    const sql = `SELECT
    job_header.id AS jobId,
    job_header.job_no AS jobNo,
    customers.id AS CustomerId,
    CONCAT(customers.first_name, ' ', customers.last_name) AS customerName,
    customers.phone AS customerPhone,
    job_header.invoice_id,
    job_header.created_at,
    job_header.state AS jobState
FROM job_header
INNER JOIN customers
    ON job_header.customer_id = customers.id
WHERE
    DATE(job_header.created_at) = CURDATE()
    OR job_header.state IN (0,1, 2)
ORDER BY job_header.state ASC, job_header.created_at DESC`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Job List !`, err);
    return [];
  }
};

export const load_per_job = async (job_id) => {
  console.log(job_id);
  try {
    const headerSql = `SELECT jh.*, ih.inv_no AS inv_no FROM job_header jh 
    LEFT JOIN inv_header ih ON ih.id = jh.invoice_id WHERE jh.id = ?`;
    const headerRes = await query(headerSql, [job_id]);
    if (!headerRes || headerRes.length == 0) {
      return {
        success: false,
        error: "No Job Founds!",
      };
    }

    const customerSql = `SELECT id, CONCAT(first_name, " ", last_name) AS customerName,
     phone AS customerPhone FROM customers WHERE id = ?`;
    const customerRes = await query(customerSql, [headerRes[0]?.customer_id]);
    if (!customerRes || customerRes.length == 0) {
      return {
        success: false,
        error: "No Customer Found!",
      };
    }

    const detailsSql = ` SELECT 
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
      return {
        success: false,
        error: "No Details Found!",
      };
    }

    const paymentsSql = `SELECT * FROM trn_payments WHERE reference=? AND reference_id=?`;
    const paymentsRes = await query(paymentsSql, [`JOB`, job_id]);

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

    const itemSerialsSql = `SELECT * FROM stock_items_serials WHERE reference=? AND reference_id=?`;
    const itemSerialsRes = await query(itemSerialsSql, [`JOB`, job_id]);

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
      paymentsRes,
    };

    // console.log(jobData);

    return { success: true, jobData };
  } catch (err) {
    console.log(`Error Loading Job ${job_id} !`, err);
    return {
      success: false,
      error: `Error Loading Job !`,
    };
  }
};
