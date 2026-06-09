import { create } from "zustand";

const calculateGrossTotal = (rows) => {
  return rows.reduce((sum, row) => {
    return sum + row.lineTotal;
  }, 0);
};

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
  grossTotal: 0,
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
      downPayment: 0,
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
      grossTotal: 0,
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

  // row actions
  addRow: (item) => {
    const newRow = {
      tempId: crypto.randomUUID(),

      itemId: item.itemId,
      itemName: item.itemName,
      itemType: item.itemType,

      cost: item.cost || 0,
      selling: item.selling || 0,

      warrantyId: item.warrantyId,
      warrantyName: item.warrantyName,
      warrantyEndDate: item.warrantyEndDate,

      quantity: item.quantity || 0,
      lineTotal: item.selling * item.quantity || 0,

      serial: item.serial || false,
      showSerials: false,
      serials: [],
    };

    const rows = [...get().rows, newRow];

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount,
    });
  },

  updateRow: (tempId, field, value) => {
    const rows = get().rows.map((row) => {
      if (row.tempId !== tempId) {
        return row;
      }

      const updatedRow = {
        ...row,
        [field]: value,
      };

      // =========================
      // RECALCULATE LINE TOTAL
      // =========================
      updatedRow.lineTotal =
        (updatedRow.selling || 0) * (updatedRow.quantity || 0);

      // =========================
      // HANDLE SERIAL QTY
      // =========================
      if (field === "quantity" && updatedRow.serial) {
        const qty = Number(updatedRow.quantity);

        // grow serial array
        if (qty > updatedRow.serials.length) {
          updatedRow.serials = [
            ...updatedRow.serials,
            ...Array(qty - updatedRow.serials.length).fill(""),
          ];
        }

        // shrink serial array
        else if (qty < updatedRow.serials.length) {
          updatedRow.serials = updatedRow.serials.slice(0, qty);
        }
      }

      return updatedRow;
    });

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount,
    });
  },

  updateSerial: (tempId, serialIndex, value) => {
    const rows = get().rows.map((row) => {
      if (row.tempId !== tempId) {
        return row;
      }

      const serials = [...row.serials];

      serials[serialIndex] = value;

      return {
        ...row,
        serials,
      };
    });

    set({ rows });
  },

  removeRow: (tempId) => {
    const rows = get().rows.filter((row) => row.tempId !== tempId);

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount,
    });
  },

  setRows: (rowsData) => {
    const rows = rowsData.map((row) => ({
      tempId: crypto.randomUUID(),

      billing: row.billing,
      itemId: row.item_id,
      itemName: row.item_name,
      itemType: row.item_type,
      serial: row.serial == 1 ? true : false,
      serials: row.serials || [],
      showSerials: false,

      cost: Number(row.unit_price),
      selling: Number(row.selling_price),
      quantity: Number(row.quantity),
      lineTotal: Number(row.line_total),

      // defaults
    }));

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount,
    });
  },

  toggleSerials: (tempId) => {
    const rows = get().rows.map((row) => {
      if (row.tempId !== tempId) {
        return row;
      }

      return {
        ...row,
        showSerials: !row.showSerials,
      };
    });

    set({ rows });
  },

  removeSerial: (tempId, serialNo) => {
    const rows = get().rows.map((row) => {
      if (row.tempId !== tempId) {
        return row;
      }

      return {
        ...row,
        serials: row.serials.filter((s) => s !== serialNo),
      };
    });

    set({ rows });
  },
}));
