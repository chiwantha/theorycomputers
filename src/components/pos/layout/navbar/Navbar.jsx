"use client";
import Button from "@/components/common/button/Button";
import { useSidebar } from "@/context/SidebarContext";
import { Menu } from "lucide-react";
const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="h-15 sticky w-full border-b border-gray-200 z-50 bg-white px-4 flex items-center justify-between">
      Navbar
      <Button
        click={toggleSidebar}
        name={<Menu />}
        bg={`bg-gray-100 hover:bg-gray-200 text-gray-700 lg:hidden`}
        pd={`py-2 px-2`}
      />
    </div>
  );
};

export default Navbar;
