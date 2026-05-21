import { create } from "zustand";

const calculateGrossTotal = (rows) => {
  return rows.reduce((sum, row) => {
    return sum + row.lineTotal;
  }, 0);
};

export const useJOBStore = create((set, get) => ({
  // header
  jobId: ``,
  jobNo: ``,
  deviceType: 0,
  brand: ``,
  model: ``,
  serialNo: ``,
  username: ``,
  password: ``,
  description: ``,
  accessories: ``,

  state: 0,

  grossTotal: 0,
  discount: 0,
  netTotal: 0,

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

      quantity: item.quantity || 0,

      serial: item.serial || false,

      showSerials: false,

      serials: [],

      unitPrice: item.unitPrice || 0,

      lineTotal: item.unitPrice * item.quantity,
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
      updatedRow.lineTotal = updatedRow.quantity * updatedRow.unitPrice;

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
      jobId: ``,
      jobNo: ``,
      deviceType: ``,
      brand: ``,
      model: ``,
      serialNo: ``,
      username: ``,
      password: ``,
      description: ``,
      accessories: ``,

      state: 0,

      grossTotal: 0,
      discount: 0,
      netTotal: 0,

      rows: [],
    });
  },
}));
