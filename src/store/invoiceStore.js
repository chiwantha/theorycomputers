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
  downPayment: 0,
  grossTotal: 5000,
  discount: 0,
  netTotal: 0,

  // payments
  paymentMethod: `CASH`,
  cashAmount: 0,
  cardAmount: 0,
  bankAmount: 0,
  creditAmount: 0,

  // payment meta
  dueDate: ``,
  cardType: ``,
  cardDigits: ``,

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
      netTotal: get().grossTotal - discount - get().advance,
    });
  },

  // resetPayment
  resetINVPayment: () => {
    set({
      cashAmount: 0,
      cardAmount: 0,
      bankAmount: 0,
      creditAmount: 0,
      receivedAmount: 0,
      dueDate: ``,
      cardDigits: ``,
      cardType: ``,
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
      downPayment: 0,
      grossTotal: 5000,
      discount: 0,
      netTotal: 0,

      // payments
      paymentMethod: `CASH`,
      cashAmount: 0,
      cardAmount: 0,
      bankAmount: 0,
      creditAmount: 0,

      // payment meta
      dueDate: ``,
      cardType: ``,
      cardDigits: ``,

      // meta
      note: ``,
      cashierId: ``,
      status: 0,

      // items
      rows: [],
    });
  },
}));
