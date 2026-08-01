import { validatePhoneNumber } from "./validation";
import { customerTemplates } from "./constant";
import { AppError } from "@/lib/error-handling";
import { sendSms } from "../sms/service";
import { insertCustomer } from "./repository";

export const createCustomer = async (data) => {
  try {
    validatePhoneNumber(data?.phone);

    const { customerId } = await insertCustomer(data);

    const smsResult = await sendSms(
      data?.phone,
      customerTemplates.CREATE({
        customerName: `${data?.firstName} ${data?.lastName || ""}`.trim(),
      }),
    );

    if (!smsResult.success) {
      console.error("SMS Error:", smsResult.message);
    }

    return customerId;
  } catch (err) {
    console.error(err);
    // Business/Application errors
    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError(
      "Unable to create customer. Please try again later.",
      500,
    );
  }
};
