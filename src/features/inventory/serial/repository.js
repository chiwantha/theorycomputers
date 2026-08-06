import pool from "@/lib/db";

export const updateSerial = async (data, db = pool) => {
  const { type, reference, referenceId, serialNo } = data;

  const sql = `
    UPDATE stock_items_serials
    SET stock = ?, reference = ?, reference_id = ?
    WHERE serial = ?
  `;

  const [result] = await db.execute(sql, [
    type,
    reference,
    referenceId,
    serialNo,
  ]);

  if (result.affectedRows === 0) {
    throw new Error("Failed to update serial stock.");
  }
};

export const releaseSerials = async (data, db = pool) => {
  const { referenceId } = data;
  const sql = `UPDATE stock_items_serials SET stock=?, reference=?, reference_id=? WHERE reference_id=?`;
  const [result] = await db.execute(sql, [1, null, null, referenceId]);
};
