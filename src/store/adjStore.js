import { create } from "zustand";

export const useADJStore = create((set, get) => ({
  // header
  adjNo: ``,
  type: null,
  reason: null,
  note: ``,

  // rows
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

      type: item.type,

      quantity: item.quantity || 0,

      note: item.note,

      serial: item.serial || false,

      showSerials: false,

      serials: [],
    };

    const rows = [...get().rows, newRow];

    set({
      rows,
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

    set({
      rows,
    });
  },

  removeRow: (tempId) => {
    const rows = get().rows.filter((row) => row.tempId !== tempId);

    set({
      rows,
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

  // reset
  resetGRN: () => {
    set({
      adjNo: ``,
      type: null,
      reason: null,
      note: ``,
      rows: [],
    });
  },
}));
