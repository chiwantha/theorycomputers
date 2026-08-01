import { AppError } from "@/lib/error-handling";

export const updateStock = async (connection, data) => {
  try {
    if (!["P", "M"].includes(data?.type)) {
      throw new AppError("Invalid stock update type.", 400);
    }

    const operator = data.type === "P" ? "+" : "-";

    const sql = `
      UPDATE stock
      SET quantity = quantity ${operator} ?
      WHERE item_id = ?
      ${data.type === "M" ? "AND quantity >= ?" : ""}
    `;

    const values = [data.quantity, data.itemId];

    if (data.type === "M") {
      values.push(data.quantity);
    }

    const [result] = await connection.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new AppError(
        "Stock update failed. Item not found or insufficient stock.",
        400,
      );
    }

    return result;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }

    console.error(err);

    throw new AppError(
      "Unable to update stock right now. Please try again later.",
      500,
    );
  }
};
