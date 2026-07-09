"use client";
import { useSidebar } from "@/context/SidebarContext";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  BarChart2,
  ChevronRight,
  Hammer,
  Menu,
  ReceiptText,
  ShelvingUnit,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import SidebarItem from "./sidebarItem/SidebarItem";
import Button from "@/components/common/button/Button";
import { useSIDEBARstore } from "@/store/sidebarStore";

const paths = [
  {
    name: `Dashboard`,
    path: `/pos`,
    icon: <Menu size={20} />,
  },
  {
    name: `Terminal`,
    path: `/pos/terminal`,
    icon: <ReceiptText size={20} />,
  },
  {
    name: `Jobs`,
    path: `/pos/jobs`,
    icon: <Hammer size={20} />,
  },
  {
    name: `Payments`,
    path: `/pos/payments`,
    icon: <BanknoteArrowUp size={20} />,
  },
  {
    name: `Expences`,
    path: `/pos/expences`,
    icon: <BanknoteArrowDown size={20} />,
  },
  {
    name: `Reports`,
    icon: <BarChart2 size={20} />,
    sub: [
      {
        name: `Invoices`,
        path: `/pos/reports/invoices`,
        icon: <ReceiptText size={20} />,
      },
      {
        name: `Jobs`,
        path: `/pos/reports/jobs`,
        icon: <Wrench size={20} />,
      },
      {
        name: `Stock`,
        path: `/pos/reports/stock`,
        icon: <ShelvingUnit size={20} />,
      },
    ],
  },
];

const Sidebar = () => {
  const { data } = useSession();
  const { isSidebarOpen } = useSidebar();
  const setSidebarField = useSIDEBARstore((state) => state.setSidebarField);
  const posFullSidebar = useSIDEBARstore((state) => state.posFullSidebar);
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div
      className={` p-4 overflow-y-auto border-r shadow-sm border-gray-100
      lg:translate-x-0 fixed lg:relative top-0 left-0 h-full z-51 thin-scrollbar
      transform transition-transform duration-300 bg-white flex flex-col gap-4
      ${isSidebarOpen ? "translate-x-0 xs:-translate-x-full" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex flex-col gap-4">
        <Button
          click={() => {
            setSidebarField(`posFullSidebar`, !posFullSidebar);
          }}
          name={
            <ChevronRight
              size={20}
              className={`transition-transform duration-300 ${posFullSidebar ? ` rotate-180` : ``}`}
            />
          }
          fg={`flex justify-center font-bold items-center `}
          bg={`bg-gray-200 text-gray-600 hover:bg-gray-300`}
          pd={`py-3 px-3`}
          wfull={true}
        />
        {data?.user?.role === 1 && (
          <SidebarItem icon={<User />} path={`/admin`} name={`Admin`} />
        )}
        {paths.map((path, index) => (
          <SidebarItem
            key={index}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
            {...path}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
