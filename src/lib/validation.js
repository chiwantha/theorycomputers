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
