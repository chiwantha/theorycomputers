"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Layers,
  Boxes,
  Warehouse,
  ClipboardList,
  AlertTriangle,
  RotateCcw,
  Database,
  Barcode,
  ClipboardMinus,
  PenTool,
  ShieldCheck,
  Wrench,
  BadgeDollarSign,
  ReceiptText,
} from "lucide-react";

import SidebarItem from "./sidebarItem/SidebarItem";
import GreetingCard from "../../../common/cards/greetingcard/GreetingCard";
import { useSidebar } from "@/context/SidebarContext";
import CompanyDetailsCard from "@/components/common/cards/detailscard/CompanyDetailsCard";

const admin_links = [
  // {
  //   name: `Pos`,
  //   icon: <ShoppingCart size={20} />,
  //   path: `/pos`,
  //   styles: `bg-amber-500 text-white hover:bg-amber-600`,
  // },
  {
    name: `Dashboard`,
    icon: <LayoutDashboard size={20} />,
    path: `/admin`,
  },
  {
    name: "Master",
    icon: <Database size={20} />,
    sub: [
      {
        name: "Items",
        icon: <Package size={20} />,
        path: "/admin/master/items",
      },
      {
        name: "Services",
        icon: <Wrench size={20} />,
        path: "/admin/master/services",
      },
      {
        name: "Categories",
        icon: <Layers size={20} />,
        path: "/admin/master/categories",
      },
      {
        name: "Brands",
        icon: <Boxes size={20} />,
        path: "/admin/master/brands",
      },
      {
        name: "Suppliers",
        icon: <Users size={20} />,
        path: "/admin/master/suppliers",
      },
      {
        name: "Warranty",
        icon: <ShieldCheck size={20} />,
        path: "/admin/master/warranty",
      },
    ],
  },
  {
    name: "Inventory",
    icon: <Warehouse size={20} />,
    sub: [
      {
        name: "GRN",
        icon: <ClipboardList size={20} />,
        path: "/admin/inventory/grn",
      },
      {
        name: "Adjustment",
        icon: <PenTool size={20} />,
        path: "/admin/inventory/adjustments",
      },
      {
        name: "Serials",
        icon: <Barcode size={20} />,
        path: "/admin/inventory/serials",
      },
      {
        name: "Returns",
        icon: <RotateCcw size={20} />,
        path: "/admin/inventory/returns",
        block: true,
      },
      {
        name: "Damages",
        icon: <AlertTriangle size={20} />,
        path: "/admin/inventory/damages",
        block: true,
      },
    ],
  },
  {
    name: "Reports",
    icon: <ClipboardMinus size={20} />,
    sub: [
      {
        name: "Sales",
        icon: <BadgeDollarSign size={20} />,
        path: "/admin/reports/sales",
      },
      {
        name: `Invoices`,
        path: `/admin/reports/invoices`,
        icon: <ReceiptText size={20} />,
      },
      {
        name: "Jobs",
        icon: <Wrench size={20} />,
        path: "/admin/reports/jobs",
      },
      {
        name: "Stock",
        icon: <Warehouse size={20} />,
        path: "/admin/reports/stock",
      },
    ],
  },
];

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`w-64 p-4 overflow-y-auto border-r shadow-sm border-gray-100
      md:translate-x-0 fixed md:relative top-0 left-0 h-full z-51 thin-scrollbar
      transform transition-transform duration-300 bg-white flex flex-col gap-4
      ${isSidebarOpen ? "translate-x-0 xs:-translate-x-full" : "-translate-x-full"} md:translate-x-0`}
    >
      <CompanyDetailsCard />
      <div className="flex flex-col gap-4">
        {admin_links.map((link, index) => (
          <SidebarItem
            key={index}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
            {...link}
          />
        ))}
        {/* <Button
          wfull={true}
          name={`Logout`}
          click={() => signOut({ callbackUrl: `/auth/usr-login` })}
          bg={`bg-red-400 hover:bg-red-600 text-white`}
        /> */}
      </div>
    </div>
  );
};

export default Sidebar;
