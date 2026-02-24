"use client";
import { useSidebar } from "@/context/SidebarContext";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white h-15 sticky top-0 border-b border-gray-100 flex justify-between items-center px-4 w-full">
      Navbar
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 bg-gray-200 rounded"
      >
        ☰
      </button>
    </div>
  );
};

export default Navbar;
