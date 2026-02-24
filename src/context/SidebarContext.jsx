"use client"; // context with state must be client

import { createContext, useContext, useState } from "react";

// 1. Create context
const SidebarContext = createContext();

// 2. Create provider
export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// 3. Custom hook to use sidebar
export function useSidebar() {
  return useContext(SidebarContext);
}
