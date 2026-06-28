"use client";
import GreetingCard from "@/components/common/cards/greetingcard/GreetingCard";
import SidebarItem from "@/components/admin/layout/sidebar/sidebarItem/SidebarItem";
import { useSidebar } from "@/context/SidebarContext";
import {
  BanknoteArrowUp,
  BarChart2,
  Hammer,
  Menu,
  ReceiptText,
  ShelvingUnit,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

const paths = [
  {
    name: `Dashboard`,
    path: `/pos/`,
    icon: <Menu size={20} />,
  },
  {
    name: `Terminal`,
    path: `/pos/terminal`,
    icon: <BanknoteArrowUp size={20} />,
  },
  {
    name: `Jobs`,
    path: `/pos/jobs`,
    icon: <Hammer size={20} />,
  },
  {
    name: `Reports`,
    icon: <BarChart2 size={20} />,
    sub: [
      {
        name: `Sales`,
        path: `/pos/reports/sales`,
        icon: <ReceiptText size={20} />,
      },
      {
        name: `Jobs`,
        path: `/pos/reports/jobs`,
        icon: <Wrench size={20} />,
      },
      {
        name: `Inventory`,
        path: `/pos/reports/inventory`,
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
      className={`w-70 p-4 overflow-y-auto border-r shadow-sm border-gray-100
      lg:translate-x-0 fixed lg:relative top-0 left-0 h-full z-51 thin-scrollbar
      transform transition-transform duration-300 bg-white flex flex-col gap-4
      ${isSidebarOpen ? "translate-x-0 xs:-translate-x-full" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex flex-col gap-4">
        <GreetingCard />
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
