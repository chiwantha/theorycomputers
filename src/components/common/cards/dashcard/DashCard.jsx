"use client";
import { cn } from "@/lib/utils";
import React from "react";

const DashCard = ({ title, value, className, icon }) => {
  return (
    <div
      className={cn(
        "group relative min-h-[130px] flex items-center overflow-hidden rounded-2xl border border-gray-300 bg-white p-4 shadow-md transition-all duration-300 hover:border-blue-300",
        className,
      )}
    >
      <div className="relative flex flex-col gap-2">
        {/* Content */}
        <div className="">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            {title || "Card Title"}
          </p>

          <h2 className=" text-4xl font-bold tracking-tight text-blue-600">
            {value ?? 0}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashCard;
