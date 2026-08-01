import pool from "@/lib/db";

export const insertCustomer = async (data, db = pool) => {
  const { firstName, lastName, phone, email, address, city } = data;

  const sql = `
    INSERT INTO customers
    (first_name, last_name, phone, email, address, city)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    firstName,
    lastName || null,
    phone,
    email || null,
    address || null,
    city || null,
  ]);

  if (!result.insertId) {
    throw new Error("Failed to insert customer !");
  }

  return {
    customerId: result.insertId,
  };
};
