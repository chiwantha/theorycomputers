import { customerTemplates } from "@/constant/SmsTemplate";
import { sendSms } from "@/lib/func";
import { validatePhoneNumber } from "./validation";

export const createCustomer = async (conn, data) => {
  try {
    if (!validatePhoneNumber(data.phone)) {
      throw new Error(`Invalid Phone Number !`);
    }

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
      throw new Error("Create Customer Failed!");
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
    console.log("Customer Create Error:", err.message);

    const error = new Error(`Customer creation failed: ${err.message}`);

    error.status = 400;

    throw error;
  }
};
