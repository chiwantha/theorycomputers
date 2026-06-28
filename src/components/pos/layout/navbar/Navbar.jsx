"use client";
import Button from "@/components/common/button/Button";
import NotificationBar from "@/components/common/cards/notifications/NotificationBar";
import UserPop from "@/components/common/userpop/UserPop";
import { useSidebar } from "@/context/SidebarContext";
import { Menu } from "lucide-react";
import Image from "next/image";
const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="h-15 sticky w-full border-b border-gray-200 z-50 bg-white px-4 flex items-center justify-between">
      <div className="relative aspect-square h-10 ">
        <Image
          src={`/app/logo.png`}
          alt="logo.png"
          fill
          sizes="50vw"
          className="object-center object-cover"
        />
      </div>
      <div className="flex gap-4 items-center">
        <NotificationBar />
        <UserPop />
        <Button
          click={toggleSidebar}
          name={<Menu />}
          bg={`bg-gray-100 hover:bg-gray-200 text-gray-700 lg:hidden`}
          pd={`py-2 px-2`}
        />
      </div>
    </div>
  );
};

export default Navbar;
