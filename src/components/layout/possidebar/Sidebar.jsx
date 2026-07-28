"use client";
import { useSidebar } from "@/context/SidebarContext";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  BarChart2,
  Hammer,
  Menu,
  ReceiptText,
  ShelvingUnit,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import SidebarItem from "./sidebarItem/SidebarItem";
import CompanyDetailsCard from "@/components/cards/detailscard/CompanyDetailsCard";

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
        <CompanyDetailsCard />

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
