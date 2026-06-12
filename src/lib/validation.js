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

    if (product.serial === 1) {
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

export function validateAdjItems(adj_items) {
  if (!Array.isArray(adj_items) || adj_items.length === 0) {
    return { error: "No ADJ items found!" };
  }

  for (const product of adj_items) {
    if (!product.itemId) {
      return { error: "Invalid item id!" };
    }

    if (!product.quantity || product.quantity <= 0) {
      return { error: `Invalid quantity for item ${product.itemName}` };
    }

    if (!product.type || product.type < 0) {
      return { error: `Invalid adj type for item ${product.itemName}` };
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

export function validateInvItems(inv_items) {
  if (!Array.isArray(inv_items) || inv_items.length === 0) {
    return { error: "No Invoice items found!" };
  }

  for (const product of inv_items) {
    if (!product.itemId) {
      return { error: "Invalid item id!" };
    }

    if (!product.itemName) {
      return { error: `Invalid item Name for item ${product.itemId}` };
    }

    if (!product.itemType) {
      return { error: `Invalid item type for item ${product.itemName}` };
    }

    if (!product.cost) {
      return { error: `Invalid unit cost for item ${product.itemName}` };
    }

    if (!product.selling) {
      return { error: `Invalid unit price for item ${product.itemName}` };
    }

    if (!product.quantity || product.quantity <= 0) {
      return { error: `Invalid quantity for item ${product.itemName}` };
    }

    if (product.warrantyId != null || !product.warrantyId) {
      if (!product.warrantyName) {
        return { error: `Invalid warranty name for item ${product.itemName}` };
      }

      if (!product.warrantyEndDate) {
        return {
          error: `Invalid warranty end date for item ${product.itemName}`,
        };
      }
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
