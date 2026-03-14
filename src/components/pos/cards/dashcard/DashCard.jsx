import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const DashCard = ({ title, icon, value, link, className }) => {
  return (
    <div
      className={cn(
        `justify-center relative rounded-xl flex flex-col overflow-hidden
         shadow-xs border-gray-200 hover:border-blue-300 bg-gray-100
           border transition-all duration-300 min-h-37.5 p-4 lg:p-6 w-full`,
        className,
      )}
    >
      <div className="absolute aspect-square h-full -right-12.5 mask-l-from-2">
        <Image src={icon} alt={icon} fill className="object-cover " />
      </div>
      <span className="text-nowrap text-ellipsis line-clamp-1 text-gray-400 capitalize">
        {title || `Card Title`}
      </span>
      <h2 className="text-5xl font-bold text-blue-600">{value || 0}</h2>
    </div>
  );
};

export default DashCard;
