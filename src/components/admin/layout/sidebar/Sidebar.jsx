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
  Settings,
  Database,
  Barcode,
} from "lucide-react";

import SidebarItem from "./sidebarItem/SidebarItem";

const admin_links = [
  {
    name: `Dashboard`,
    icon: <LayoutDashboard />,
    path: `/admin`,
  },
  {
    name: `Pos`,
    icon: <ShoppingCart />,
    path: `/`,
  },
  {
    name: "Master",
    icon: <Database />,
    sub: [
      { name: "Items", icon: <Package />, path: "/admin/master/items" },
      {
        name: "Categories",
        icon: <Layers />,
        path: "/admin/master/categories",
      },
      { name: "Brands", icon: <Boxes />, path: "/admin/master/brands" },
      { name: "Suppliers", icon: <Users />, path: "/admin/master/suppliers" },
    ],
  },
  {
    name: "Inventory",
    icon: <Warehouse />,
    sub: [
      { name: "GRN", icon: <ClipboardList />, path: "/admin/inventory/grn" },
      { name: "Stock", icon: <Warehouse />, path: "/admin/inventory/stock" },
      {
        name: "Serials",
        icon: <Barcode />,
        path: "/admin/inventory/serials",
      },
      {
        name: "Returns",
        icon: <RotateCcw />,
        path: "/admin/inventory/returns",
      },
      {
        name: "Damages",
        icon: <AlertTriangle />,
        path: "/admin/inventory/damages",
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings />,
    path: "/admin/settings",
  },
];

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-8 bg-blue-500 flex flex-col space-y-4 justify-center items-center">
        <div className="rounded-full w-[90%] aspect-square bg-white"></div>
      </div>
      <div className="flex flex-col gap-2">
        {admin_links.map((link, index) => (
          <SidebarItem
            key={index}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
            {...link}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
