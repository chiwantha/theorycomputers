import pool from "@/lib/db";

export const getCustomer = async (data, db = pool) => {
  const { customerId } = data;
  const sql = `SELECT * FROM customers WHERE id = ?`;
  const [result] = await db.execute(sql, [customerId]);

  if (!result || result.length == 0) {
    throw new Error(`Customer Not Found !`);
  }

  return {
    customer: result[0],
  };
};

export const insertCustomer = async (data, db = pool) => {
  const { firstName, lastName, phone, email, address, city, province } = data;

  const sql = `
    INSERT INTO customers
    (first_name, last_name, phone, email, address, city, province)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    firstName,
    lastName || null,
    phone,
    email || null,
    address || null,
    city || null,
    province || null,
  ]);

  if (!result.insertId) {
    throw new Error("Failed to insert customer !");
  }

  return {
    customerId: result.insertId,
  };
};
