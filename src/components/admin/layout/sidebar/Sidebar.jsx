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
import GreetingCard from "../../cards/greetingCard/GreetingCard";

const admin_links = [
  {
    name: `Dashboard`,
    icon: <LayoutDashboard size={20} />,
    path: `/admin`,
  },
  {
    name: `Pos`,
    icon: <ShoppingCart size={20} />,
    path: `/`,
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
        name: "Stock",
        icon: <Warehouse size={20} />,
        path: "/admin/inventory/stock",
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
      },
      {
        name: "Damages",
        icon: <AlertTriangle size={20} />,
        path: "/admin/inventory/damages",
      },
    ],
  },
  {
    name: "Settings",
    icon: <Settings size={20} />,
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
      <GreetingCard />
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
