import { AppError } from "@/lib/error-handling";

export const validateJobItems = (job_items) => {
  if (!Array.isArray(job_items) || job_items.length === 0) {
    throw new AppError(`No Job items found!`, 404);
  }

  for (const product of job_items) {
    if (!product.itemId) {
      throw new AppError(`Invalid item id!`, 400);
    }

    if (!product.unitPrice) {
      throw new AppError(
        `Invalid unit price for item ${product.itemName}`,
        400,
      );
    }

    if (!product.quantity || product.quantity <= 0) {
      throw new AppError(`Invalid quantity for item ${product.itemName}`, 400);
    }

    if (product.serial === 1) {
      if (!Array.isArray(product.serials) || product.serials.length === 0) {
        throw new AppError(`Serials missing for item ${product.itemName}`, 400);
      }

      if (product.serials.length !== product.quantity) {
        throw new AppError(
          `Serial count mismatch for item ${product.itemName}`,
          400,
        );
      }

      for (const serial of product.serials) {
        if (!serial || serial.trim() === "") {
          throw new AppError(
            `Empty serial found for item ${product.itemName}`,
            400,
          );
        }
      }
    }
  }

  return;
};
