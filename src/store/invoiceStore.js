import { calculateWarrantyEndDate } from "@/lib/utils";
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
  orderId: ``,

  // ammounts
  paid: 0,
  downPayment: ``,
  grossTotal: 0,
  discount: 0,
  netTotal: 0,

  // payments
  settlement: `FULL`,
  paymentMethod: `CASH`,
  cashAmount: ``,
  cardAmount: ``,
  bankAmount: ``,
  creditAmount: ``,

  // payment meta
  dueDate: ``,
  cardType: ``,
  cardDigits: ``,
  cashReceived: ``,

  // meta
  note: ``,
  status: 0,
  delivery: false,
  quoteExpiryDate: ``,
  billEdit: true,

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
      netTotal: get().grossTotal - discount - get().paid,
    });
  },

  // discount
  setPaid: (paid) => {
    set({
      paid,
      netTotal: get().grossTotal - get().discount - paid,
    });
  },

  // resetPayment
  resetINVPayment: () => {
    set({
      cashAmount: ``,
      cardAmount: ``,
      bankAmount: ``,
      creditAmount: ``,
      dueDate: ``,
      cardDigits: ``,
      cardType: ``,
      cashReceived: ``,
      downPayment: ``,
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
      orderId: ``,

      // ammounts
      paid: 0,
      downPayment: ``,
      grossTotal: 0,
      discount: 0,
      netTotal: 0,

      // payments
      settlement: `FULL`,
      paymentMethod: `CASH`,
      cashAmount: ``,
      cardAmount: ``,
      bankAmount: ``,
      creditAmount: ``,

      // payment meta
      cashReceived: ``,
      dueDate: ``,
      cardType: ``,
      cardDigits: ``,

      // meta
      note: ``,
      status: 0,
      delivery: false,
      quoteExpiryDate: ``,
      billEdit: true,

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

      warrantyId: item.warrantyId || null,
      warrantyName: item.warrantyName || null,
      warrantyEndDate: item.warrantyEndDate || null,

      quantity: item.quantity || 0,
      reserved: get().jobId ? item.quantity : 0,
      lineTotal: (item.selling || 0) * (item.quantity || 0),

      serial: item.serial || false,
      showSerials: false,
      serials: [],

      note: item.note,
    };

    const rows = [...get().rows, newRow];

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount - Number(get().paid),
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
      netTotal: grossTotal - get().discount - Number(get().paid),
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
      netTotal: grossTotal - get().discount - Number(get().paid),
    });
  },

  setRows: (rowsData) => {
    console.log(`Rows :`, rowsData);
    const rows = rowsData.map((row) => ({
      tempId: crypto.randomUUID(),

      itemId: row.item_id,
      itemName: row.item_name,
      itemType: row.item_type,

      warrantyId: row.warranty_id,
      warrantyName: row.warranty_name || null,
      warrantyEndDate: row.warranty_id
        ? calculateWarrantyEndDate(row.warranty_duration)
        : null,

      cost: Number(row.unit_cost || 0),
      selling: Number(row.unit_price),
      quantity: Number(row.quantity),
      reserved: get().jobId ? Number(row.quantity) : 0,
      lineTotal: Number(row.line_total),

      serial: row.serial == 1 ? true : false,
      serials: row.serials || [],
      showSerials: false,

      note: row.note || ``,
      // defaults
    }));

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount - Number(get().downPayment || 0),
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
