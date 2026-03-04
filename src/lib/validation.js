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
