import { AppError } from "@/lib/error-handling";

export function validateInvItems(inv_items, docType) {
  if (!Array.isArray(inv_items) || inv_items.length === 0) {
    throw new AppError(`No Invoice items found!`, 404);
  }

  for (const product of inv_items) {
    if (!product.itemId) {
      throw new AppError(`Invalid item id!`, 400);
    }

    if (!product.itemName) {
      throw new AppError(`Invalid item Name for item ${product.itemId}`, 400);
    }

    if (!product.itemType) {
      throw new AppError(`Invalid item Type for item ${product.itemId}`, 400);
    }

    if (!product.cost && product.itemType === `P`) {
      throw new AppError(`Invalid Unit Cost for item ${product.itemId}`, 400);
    }

    if (!product.selling) {
      throw new AppError(`Invalid Unit Price for item ${product.itemId}`, 400);
    }

    if (!product.quantity || product.quantity <= 0) {
      throw new AppError(`Invalid Quantity for item ${product.itemId}`, 400);
    }

    if (product.warrantyId && product.warrantyId !== 1) {
      if (!product.warrantyName) {
        throw new AppError(
          `Invalid Warranty Name for item ${product.itemId}`,
          400,
        );
      }

      if (!product.warrantyEndDate) {
        throw new AppError(
          `Invalid warranty end date for item ${product.itemId}`,
          400,
        );
      }
    }

    if (product.serial === 1 && docType === "INVOICE") {
      if (!Array.isArray(product.serials) || product.serials.length === 0) {
        throw new AppError(`Serials missing for item ${product.itemName}`, 404);
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
            `Empty Serial Found for item ${product.itemName}`,
            404,
          );
        }
      }
    }
  }

  return { success: true };
}
