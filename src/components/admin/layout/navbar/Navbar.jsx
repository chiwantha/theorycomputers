"use client";
import Button from "@/components/common/button/Button";
import { useSidebar } from "@/context/SidebarContext";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white h-15 sticky top-0 border-b border-gray-100 flex justify-between items-center px-4 w-full">
      <div className="">
        <h2 className="text-2xl font-black uppercase text-gray-700">
          Theory Computers
        </h2>
      </div>
      <Button
        click={toggleSidebar}
        name={<Menu />}
        bg={`bg-gray-100 hover:bg-gray-200 text-gray-700 md:hidden`}
        pd={`py-2 px-2`}
      />
    </div>
  );
};

export default Navbar;
