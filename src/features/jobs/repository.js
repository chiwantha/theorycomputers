import pool from "@/lib/db";

export const getJobList = async (data, db = pool) => {
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
  ORDER BY job_header.state ASC, job_header.created_at DESC;`;

  const [result] = await db.execute(sql);

  if (!result || result.length == 0) {
    throw new Error(`No Jobs Found !`);
  }

  return {
    jobList: result,
  };
};

export const getJobHeader = async (data, db = pool) => {
  const { jobId } = data;
  const sql = `SELECT * FROM job_header WHERE id = ?`;
  const [result] = await db.execute(sql, [jobId]);

  if (result.length == 0 || !result) {
    throw new Error(`No Jobs Found !`);
  }

  return {
    jobHeader: result[0],
  };
};

export const getJobDetails = async (data, db = pool) => {
  const { jobId } = data;
  const sql = `SELECT 
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
  const [result] = await db.execute(sql, [jobId]);

  if (!result || result.length == 0) {
    throw new Error(`No Job Details Found !`);
  }

  return {
    jobDetails: result[0],
  };
};

export const getJobItems = async (data, db = pool) => {
  const { jobId } = data;
  const sql = `SELECT job_items.*, mst_items.name AS item_name, mst_items.is_serial AS serial,  mst_items.type AS item_type , mst_items.cost AS unit_cost, 
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
  const [result] = await db.execute(sql, [jobId]);

  if (!result || result.length == 0) {
    return {
      jobItems: [],
    };
  }

  const SerialsSql = `SELECT * FROM stock_items_serials WHERE reference=? AND reference_id=?`;
  const [SerialsRes] = await db.execute(SerialsSql, [`JOB`, jobId]);

  const serialMap = new Map();

  for (const s of SerialsRes) {
    if (!serialMap.has(s.item_id)) {
      serialMap.set(s.item_id, []);
    }
    serialMap.get(s.item_id).push(s.serial);
  }

  const resultItems = result.map((item) => ({
    ...item,
    serials: item.serial === 1 ? serialMap.get(item.item_id) || [] : [],
  }));

  return {
    jobItems: resultItems,
  };
};

export const insertJobHeader = async (data, db = pool) => {
  const { jobNo, customerId, warranty, grossTotal, discount, netTotal } = data;

  const sql = `INSERT INTO job_header (job_no, customer_id, warranty, gross, discount, net) VALUES (?,?,?,?,?,?)`;

  const [result] = await db.execute(sql, [
    jobNo,
    customerId,
    warranty == "true" ? 1 : 0,
    grossTotal,
    discount,
    netTotal,
  ]);
  if (!result.insertId) {
    throw new Error("Failed to insert Job Header !");
  }

  return {
    headerId: result.insertId,
  };
};

export const insertJobDetails = async (data, db = pool) => {
  const {
    headerId,
    invHeaderId,
    invDetailsId,
    itemId,
    categoryId,
    brandId,
    model,
    serialNo,
    username,
    password,
    accessories,
    problem,
  } = data;

  const sql = `INSERT INTO job_details (header_id, inv_header_id, inv_details_id, item_id, category_id, brand_id, model, serial, username, password, accessories, problem )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
  const [result] = await db.execute(sql, [
    headerId,
    invHeaderId,
    invDetailsId,
    itemId || null,
    categoryId || null,
    brandId || null,
    model || null,
    serialNo || null,
    username || null,
    password || null,
    accessories || null,
    problem,
  ]);
  if (!result.insertId) {
    throw new Error("Failed to insert Job Details !");
  }

  return {
    detailsId: result.insertId,
  };
};

export const insertJobItem = async (data, db = pool) => {
  const {
    headerId,
    itemId,
    billing,
    unitCost,
    unitPrice,
    quantity,
    lineTotal,
  } = data;

  const sql = `INSERT INTO job_items (header_id, item_id, billing, unit_cost, unit_price, quantity, line_total) VALUES (?,?,?,?,?,?,?)`;
  const [result] = await db.execute(sql, [
    headerId,
    itemId,
    billing,
    unitCost,
    unitPrice,
    quantity,
    lineTotal,
  ]);
  if (!result.insertId) {
    throw new Error(`Failed to insert Job Items !`);
  }

  return {
    jobItemId: result.insertId,
  };
};

export const updateJobHeaderState = async (data, db = pool) => {
  const { jobId, state, start, restart, finish } = data;

  let extender = ``;
  if (start) {
    extender = `,start = NOW()`;
  } else if (restart) {
    extender = `, start = NOW(), finish = NULL`;
  } else if (finish) {
    extender = `, finish = NOW()`;
  }

  const sql = `UPDATE job_header SET state=?, updated_at = NOW() ${extender} WHERE id=?`;

  const [result] = await db.execute(sql, [state, jobId]);

  if (!result || result.affectedRows === 0) {
    throw new Error(`Update Job Status Faild !`);
  }
};

export const deleteJobItems = async (data, db = pool) => {
  const { jobId } = data;
  const sql = `DELETE FROM job_items WHERE header_id = ?`;

  const [result] = await db.execute(sql, [jobId]);

  if (!result || result.affectedRows === 0) {
    throw new Error(`Failed to Delete Job Items !`);
  }
};
