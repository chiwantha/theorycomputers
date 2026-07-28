"use client";
import BreadCrumb from "@/components/breadcrump/BreadCrumb";
import Button from "@/components/button/Button";
import NotificationBar from "@/components/cards/notifications/NotificationBar";
import UserPop from "@/components/userpop/UserPop";
import { useSidebar } from "@/context/SidebarContext";
import { useSIDEBARstore } from "@/store/sidebarStore";
import { Menu, PanelLeftClose, User } from "lucide-react";
const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const setSidebarField = useSIDEBARstore((state) => state.setSidebarField);
  const posFullSidebar = useSIDEBARstore((state) => state.posFullSidebar);
  return (
    <div className="h-15 sticky w-full border-b border-gray-200 z-50 bg-white px-4 flex items-center justify-between">
      <Button
        click={() => {
          setSidebarField(`posFullSidebar`, !posFullSidebar);
        }}
        name={
          <PanelLeftClose
            className={`transition-transform duration-300 ${!posFullSidebar ? ` rotate-180` : ``}`}
          />
        }
        fg={`flex justify-center font-bold items-center `}
        bg={`bg-gray-200 text-gray-600 hover:bg-gray-300`}
        pd={`p-2`}
        mg={`mr-2`}
      />

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
