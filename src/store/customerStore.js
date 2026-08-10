import { create } from "zustand";

export const useCUSTOMERStore = create((set, get) => ({
  // details
  customerState: 0,
  customerId: null,
  firstName: ``,
  lastName: ``,
  phone: ``,
  email: ``,
  province: null,
  city: null,
  address: ``,

  // header actions
  setCustomerField: (field, value) => {
    set({
      [field]: value,
    });
  },

  resetCustomer: () => {
    set({
      customerState: 0,
      customerId: null,
      firstName: ``,
      lastName: ``,
      phone: ``,
      email: ``,
      province: null,
      city: null,
      address: ``,
    });
  },
}));
