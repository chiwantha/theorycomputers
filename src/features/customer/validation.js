export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return false;
  }

  // Must start with 07 and contain exactly 10 digits
  const phoneRegex = /^07\d{8}$/;

  return phoneRegex.test(phone);
};
