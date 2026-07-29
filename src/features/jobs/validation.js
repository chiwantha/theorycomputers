export function validateJobItems(job_items) {
  if (!Array.isArray(job_items) || job_items.length === 0) {
    return { error: "No Job items found!" };
  }

  for (const product of job_items) {
    if (!product.itemId) {
      return { error: "Invalid item id!" };
    }

    if (!product.unitPrice) {
      return { error: `Invalid unit price for item ${product.itemName}` };
    }

    if (!product.quantity || product.quantity <= 0) {
      return { error: `Invalid quantity for item ${product.itemName}` };
    }

    if (product.serial === 1) {
      if (!Array.isArray(product.serials) || product.serials.length === 0) {
        return { error: `Serials missing for item ${product.itemName}` };
      }

      if (product.serials.length !== product.quantity) {
        return { error: `Serial count mismatch for item ${product.itemName}` };
      }

      for (const serial of product.serials) {
        if (!serial || serial.trim() === "") {
          return { error: `Empty serial found for item ${product.itemName}` };
        }
      }
    }
  }

  return { success: true };
}
