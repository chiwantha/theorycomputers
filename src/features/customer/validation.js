import { AppError } from "@/lib/error-handling";

export const validatePhoneNumber = (phone) => {
  if (!phone) {
    throw new AppError("Phone number is required !", 400);
  }

  // Must start with 07 and contain exactly 10 digits
  const phoneRegex = /^07\d{8}$/;

  if (!phoneRegex.test(phone)) {
    throw new AppError(
      "Invalid phone number. It must start with '07' and contain exactly 10 digits.",
      400,
    );
  }
};
