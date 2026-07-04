import { create } from "zustand";

export const useSIDEBARstore = create((set, get) => ({
  // status
  adminSidebar: 1,
  posFullSidebar: true,

  // header actions
  setSidebarField: (field, value) => {
    set({
      [field]: value,
    });
  },

  resetSidebar: () => {
    set({
      adminSidebar: 1,
      posFullSidebar: true,
    });
  },
}));
