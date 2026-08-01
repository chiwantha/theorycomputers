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
