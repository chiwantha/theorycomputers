export const validateFields = (formData, requiredFields = []) => {
  const emptyFields = [];

  requiredFields.forEach((field) => {
    const value = formData[field];

    // Check for empty values
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      emptyFields.push(field);
    }
  });

  return {
    isValid: emptyFields.length === 0,
    emptyFields,
  };
};

export const format_date = (timestamp) => {
  if (!timestamp) return "No Date";

  const dateString =
    typeof timestamp === "string"
      ? timestamp
      : new Date(timestamp).toISOString();

  return dateString.split("T")[0];
};

export function validateGrnItems(grn_items) {
  if (!Array.isArray(grn_items) || grn_items.length === 0) {
    return { error: "No GRN items found!" };
  }

  for (const product of grn_items) {
    if (!product.itemId) {
      return { error: "Invalid item id!" };
    }

    if (!product.quantity || product.quantity <= 0) {
      return { error: `Invalid quantity for item ${product.item_id}` };
    }

    if (!product.cost || product.cost < 0) {
      return { error: `Invalid cost for item ${product.item_id}` };
    }

    if (product.is_serial === 1) {
      if (!Array.isArray(product.serials) || product.serials.length === 0) {
        return { error: `Serials missing for item ${product.item_id}` };
      }

      if (product.serials.length !== product.quantity) {
        return { error: `Serial count mismatch for item ${product.item_id}` };
      }

      for (const serial of product.serials) {
        if (!serial || serial.trim() === "") {
          return { error: `Empty serial found for item ${product.item_id}` };
        }
      }
    }
  }

  return { success: true };
}
