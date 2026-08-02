import pool from "@/lib/db";

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
    throw new Error(`Failed to insert Job Item !`);
  }

  return {
    jobItemId: result.insertId,
  };
};
