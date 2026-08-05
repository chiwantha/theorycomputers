import pool from "@/lib/db";

export const getPayments = async (data, db = pool) => {
  const { reference, referenceId } = data;
  const sql = `SELECT * FROM trn_payments WHERE reference=? AND reference_id=?`;

  const [result] = await db.execute(sql, [reference, referenceId]);

  if (!result || result.length == 0) {
    // throw new Error(`Payments Not Found !`);
    return {
      payments: [],
    };
  }

  return {
    payments: result,
  };
};

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
