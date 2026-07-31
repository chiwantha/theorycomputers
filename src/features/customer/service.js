import { validatePhoneNumber } from "./validation";
import { customerTemplates } from "./constant";
import { AppError } from "@/lib/error-handling";
import { sendSms } from "../sms/service";

export const createCustomer = async (conn, data) => {
  try {
    validatePhoneNumber(data?.phone);

    const sql = `
      INSERT INTO customers 
      (first_name, last_name, phone, email, address, city) 
      VALUES (?,?,?)
    `;

    const [result] = await conn.execute(sql, [
      data?.firstName,
      data?.lastName || null,
      data?.phone,
      data?.email || null,
      data?.address || null,
      data?.city || null,
    ]);

    if (!result.insertId) {
      throw new AppError("Create Customer Failed!");
    }

    const smsResult = await sendSms(
      data?.phone,
      customerTemplates.CREATE({
        customerName: `${data?.firstName} ${data?.lastName}`,
      }),
    );

    if (!smsResult.success) {
      console.log(result.message);
    }

    return result.insertId;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    console.error(err);
    throw new AppError(
      "Unable to load jobs right now. Please try again later.",
      500,
    );
  }
};
