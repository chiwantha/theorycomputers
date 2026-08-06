import pool from "@/lib/db";

export const updateStock = async (data, db = pool) => {
  const { itemId, quantity, type } = data;

  let sql;
  let values;

  if (type === "IN") {
    sql = `
      INSERT INTO stock (item_id, quantity)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity)
    `;

    values = [itemId, quantity];
  } else {
    sql = `
      UPDATE stock
      SET quantity = quantity - ?
      WHERE item_id = ?
      AND quantity >= ?
    `;

    values = [quantity, itemId, quantity];
  }

  const [result] = await db.execute(sql, values);

  if (type === "IN") {
    // INSERT or UPDATE both succeed if affectedRows > 0
    if (result.affectedRows === 0) {
      throw new Error("Failed to increase stock !");
    }
  } else {
    // UPDATE must affect exactly one row
    if (result.affectedRows === 0) {
      throw new Error("Insufficient stock or stock record not found !");
    }
  }
};

export const insertMovement = async (data, db = pool) => {
  const { itemId, type, quantity, reference, referenceId, note = null } = data;

  const sql = `
    INSERT INTO stock_movements
    (item_id, type, quantity, reference, reference_id, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    itemId,
    type,
    quantity,
    reference,
    referenceId,
    note,
  ]);

  if (!result.insertId) {
    throw new Error("Failed to insert stock movement !");
  }

  return {
    movementId: result.insertId,
  };
};
