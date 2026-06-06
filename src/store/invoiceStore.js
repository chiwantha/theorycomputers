import { create } from "zustand";

export const useINVOICEStore = create((set, get) => ({
  // header
  invId: ``,
  invNo: ``,
  docType: `INVOICE`, // Invoice or Quotation
  date: ``,

  // document data
  invType: `DIRECT`,
  quoteId: ``,
  jobId: ``,

  // ammounts
  advance: 0,
  grossTotal: 0,
  discount: 0,
  netTotal: 0,

  // payments
  paidAmount: 0,
  cashAmount: 0,
  cardAmount: 0,
  bankAmount: 0,
  balanceAmount: 0,
  creditAmount: 0,
  dueDate: ``,
  paymentMethod: `CASH`,
  paymentStatus: `UNPAID`,

  // meta
  note: ``,
  cashierId: ``,
  status: 0,

  // items
  rows: [],

  // header actions
  setHeaderField: (field, value) => {
    set({
      [field]: value,
    });
  },

  // discount
  setDiscount: (discount) => {
    set({
      discount,
      netTotal: get().grossTotal - discount - advance,
    });
  },

  // reset
  resetINVOICE: () => {
    set({
      // header
      invId: ``,
      invNo: ``,
      docType: `INVOICE`, // Invoice or Quotation
      date: ``,

      // document data
      invType: `DIRECT`,
      quoteId: ``,
      jobId: ``,

      // ammounts
      advance: 0,
      grossTotal: 0,
      discount: 0,
      netTotal: 0,

      // payments
      paidAmount: 0,
      cashAmount: 0,
      cardAmount: 0,
      bankAmount: 0,
      balanceAmount: 0,
      creditAmount: 0,
      dueDate: ``,
      paymentMethod: `CASH`,
      paymentStatus: `UNPAID`,

      // meta
      note: ``,
      cashierId: ``,
      status: 0,

      // items
      rows: [],
    });
  },
}));
