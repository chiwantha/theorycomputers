"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useSIDEBARstore } from "@/store/sidebarStore";

const SidebarItem = ({
  name,
  icon,
  path,
  sub,
  index,
  isOpen,
  onToggle,
  block,
}) => {
  const pathname = usePathname();
  const posFullSidebar = useSIDEBARstore((state) => state.posFullSidebar);
  const isActive = path && pathname === path;
  const isParentActive =
    sub && sub.some((item) => pathname.startsWith(item.path));

  return (
    <div
      className={`${posFullSidebar ? `min-w-52` : ``} w-full transition-transform duration-300`}
    >
      {/* Main Item */}
      {path ? (
        <Link
          href={block ? `#` : path}
          className={`flex items-center gap-4 ${posFullSidebar ? `px-4` : `px-3 justify-center`} py-3 rounded-xl transition-all duration-200
          ${
            block
              ? `bg-red-300 text-white cursor-not-allowed`
              : isActive
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span className="">{icon}</span>
          {posFullSidebar && <span className="text-sm ">{name}</span>}
        </Link>
      ) : (
        <button
          onClick={() => onToggle(index)}
          className={`w-full flex items-center ${posFullSidebar ? `px-4 ` : `px-3 justify-center`} py-3 rounded-xl transition-all duration-200
          ${
            block
              ? `bg-red-300 text-white cursor-not-allowed`
              : isParentActive
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="">{icon}</span>
            <span className="text-sm ">{name}</span>
          </div>

          <ChevronDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            size={16}
          />
        </button>
      )}

      {/* Sub Items */}
      {sub && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out transform origin-top
          ${
            isOpen
              ? "max-h-125 opacity-100 scale-y-100 mt-2"
              : "max-h-0 opacity-0 scale-y-95"
          }`}
        >
          <div className=" flex flex-col gap-2 bg-blue-50 rounded-xl p-2 ">
            {sub.map((item, i) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={i}
                  href={item.block ? `#` : item.path}
                  className={`flex items-center gap-4 ${posFullSidebar ? `px-4` : `px-2 justify-center`} py-2 rounded-lg text-sm transition-all duration-300
                  ${
                    item.block
                      ? `bg-red-300 text-white cursor-not-allowed`
                      : active
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
