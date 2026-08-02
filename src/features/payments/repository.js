import pool from "@/lib/db";

export const insertPayment = async (data, db = pool) => {
  const { reference, referenceId, paymentType, paymentMethod, amount, note } =
    data;

  const sql = `INSERT INTO trn_payments (reference, reference_id, payment_type, payment_method, amount, note)
          VALUES (?,?,?,?,?,?)`;

  const [result] = await db.execute(sql, [
    reference,
    referenceId,
    paymentType,
    paymentMethod,
    amount,
    note,
  ]);
  if (!result.insertId) {
    throw new Error("Failed to insert payment !");
  }

  return {
    paymentId: result.insertId,
  };
};
