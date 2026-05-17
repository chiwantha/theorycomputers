import { create } from "zustand";

export const useCUSTOMERStore = create((set, get) => ({
  // details
  customerState: 0,
  customerId: null,
  customerName: ``,
  customerPhone: ``,

  // header actions
  setHeaderField: (field, value) => {
    set({
      [field]: value,
    });
  },

  resetCustomer: () => {
    set({
      customerState: 0,
      customerId: null,
      customerName: ``,
      customerPhone: ``,
    });
  },
}));
