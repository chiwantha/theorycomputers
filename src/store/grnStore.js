import { create } from "zustand";

const calculateGrossTotal = (rows) => {
  return rows.reduce((sum, row) => {
    return sum + row.lineTotal;
  }, 0);
};

export const useGRNStore = create((set, get) => ({
  // header
  grnNo: ``,
  supplierId: null,
  poId: null,
  invoiceNo: ``,

  // rows
  rows: [],

  // summary
  grossTotal: 0,
  discount: 0,
  netTotal: 0,

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

      quantity: item.quantity || 0,

      cost: item.cost || 0,

      lineTotal: item.cost * item.quantity,

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
      updatedRow.lineTotal = updatedRow.quantity * updatedRow.cost;

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

  removeRow: (tempId) => {
    const rows = get().rows.filter((row) => row.tempId !== tempId);

    const grossTotal = calculateGrossTotal(rows);

    set({
      rows,
      grossTotal,
      netTotal: grossTotal - get().discount,
    });
  },

  // serials actions
  addSerial: (tempId, serialNo) => {
    const rows = get().rows.map((row) => {
      if (row.tempId !== tempId) {
        return row;
      }

      return {
        ...row,
        serials: [...row.serials, serialNo],
      };
    });

    set({ rows });
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
  resetGRN: () => {
    set({
      grnNo: "",
      supplierId: null,
      poId: null,
      invoiceNo: "",

      rows: [],

      grossTotal: 0,
      discount: 0,
      netTotal: 0,
    });
  },
}));
