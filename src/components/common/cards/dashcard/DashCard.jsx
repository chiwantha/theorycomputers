"use client";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashCard = ({ title, value, period, className, icon, index, link }) => {
  return (
    <div
      className="relative rounded-xl bg-white hover:bg-gray-50 border border-gray-300 hover:border-blue-400 group min-h-36 p-4
    transition-colors duration-300 animate-fade-up opacity-0"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute p-2 top-4 right-4 rounded-lg bg-blue-500 border text-white">
        {icon || <Image color="yellow" />}
      </div>
      <div className="flex flex-col justify-between h-full">
        <span className="uppercase text-sm line-clamp-1 text-ellipsis text-gray-400">
          {title || `Card Title`}
        </span>
        <h2 className="text-gray-600 text-4xl font-bold">{value || 0}</h2>
        <div className="w-full flex items-center justify-between flex-nowrap">
          <span className="capitalize text-sm line-clamp-1 text-ellipsis tracking-wider hover:text-blue-600 text-blue-500">
            {period || `---`}
          </span>
          <Link
            href={link || `#`}
            className={`capitalize text-sm line-clamp-1 text-ellipsis tracking-wider hover:text-blue-700 text-gray-400 ${!link ? `cursor-default` : `cursor-pointer`}`}
          >
            {link ? `See More` : `---`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashCard;
