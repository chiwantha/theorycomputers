import { generateDocNo } from "@/lib/utils";
import { create } from "zustand";

const calculateGrossTotal = (rows) => {
  return rows.reduce((sum, row) => {
    return sum + row.lineTotal;
  }, 0);
};

export const useJOBStore = create((set, get) => ({
  // header
  jobId: ``,
  jobNo: generateDocNo(`JOB`),
  // customer_id ( we have that )
  warranty: false,
  deadline: ``,
  advancedPayment: 0,
  grossTotal: 0,
  discount: 0,
  netTotal: 0,

  invHeaderId: ``,
  invDetailsId: ``,
  itemId: ``,
  category: ``,
  brand: ``,
  model: ``,
  serial: false,
  serialNo: ``,
  username: ``,
  password: ``,
  advance: ``,
  accessories: ``,
  problem: ``,

  state: 0,

  rows: [],

  // header actions
  setHeaderField: (field, value) => {
    set({
      [field]: value,
    });
  },

  // row actions
  addRow: (item) => {
    const newRow = {
      tempId: crypto.randomUUID(),

      itemId: item.itemId,
      itemName: item.itemName,
      itemType: item.itemType,
      billing: item.billing || `NORMAL`,

      unitPrice: item.unitPrice || 0,
      quantity: item.quantity || 0,
      lineTotal:
        item.billing == "WARRANTY" ? 0 : item.unitPrice * item.quantity || 0,

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
        updatedRow.billing === "WARRANTY"
          ? 0
          : (updatedRow.unitPrice || 0) * (updatedRow.quantity || 0);

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

  // summary actions
  setDiscount: (discount) => {
    set({
      discount,
      netTotal: get().grossTotal - discount,
    });
  },

  // reset
  resetJOB: () => {
    set({
      // header
      jobId: ``,
      jobNo: generateDocNo(`JOB`),
      // customer_id ( we have that )
      warranty: false,
      deadline: ``,
      advancedPayment: 0,
      grossTotal: 0,
      discount: 0,
      netTotal: 0,

      invHeaderId: ``,
      invDetailsId: ``,
      itemId: ``,
      category: ``,
      brand: ``,
      model: ``,
      serial: false,
      serialNo: ``,
      username: ``,
      password: ``,
      advance: ``,
      accessories: ``,
      problem: ``,

      state: 0,

      rows: [],
    });
  },
}));
