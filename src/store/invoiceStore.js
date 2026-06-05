import { create } from "zustand";

export const useJOBStore = create((set, get) => ({
  // header
  invId: ``,
  invNo: ``,
  document: `INVOICE`, // Invoice or Quotation
  date: ``,

  // document data
  invType: `DIRECT`,
  qouteId: ``,
  jobId: ``,

  // ammounts
  advanced: 0,
  grossTotal: 0,
  discount: 0,
  netTotal: 0,

  // payments
  paidAmount: 0,
  balanceAmount: 0,
  paymentStatus: `UNPAID`,
  paymentMethod: `CASH`,

  // meta
  note: ``,
  cashierId: ``,

  // header actions
  setHeaderField: (field, value) => {
    set({
      [field]: value,
    });
  },
}));
