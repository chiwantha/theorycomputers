"use client";
import BreadCrumb from "@/components/breadcrump/BreadCrumb";
import Button from "@/components/button/Button";
import NotificationBar from "@/components/cards/notifications/NotificationBar";
import UserPop from "@/components/userpop/UserPop";
import { useSidebar } from "@/context/SidebarContext";
import { Menu } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white h-15 sticky top-0 border-b border-gray-100 flex justify-between items-center px-4 w-full">
      {/* <div className="relative aspect-square h-10 ">
        <Image
          src={`/app/logo.png`}
          alt="logo.png"
          fill
          sizes="50vw" 
          className="object-center object-cover"
        />
      </div> */}
      <div className="sm:block hidden">
        <BreadCrumb />
      </div>
      <div className="flex gap-2 items-center justify-between sm:justify-end w-full">
        <NotificationBar />
        <div className="flex gap-2 items-center">
          <UserPop />
          <Button
            click={toggleSidebar}
            name={<Menu />}
            bg={`bg-gray-100 hover:bg-gray-200 text-gray-700 lg:hidden`}
            pd={`py-2 px-2`}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
