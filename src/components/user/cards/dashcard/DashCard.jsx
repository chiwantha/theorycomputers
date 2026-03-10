import { cn } from "@/lib/utils";
import React from "react";

const DashCard = ({ title, icon, value, link, className }) => {
  return (
    <div
      className={cn(
        `rounded-xl shadow-md border-gray-200 hover:border-blue-300 bg-gray-100  border transition-all duration-300 min-h-37.5 p-4 md:p-6`,
        className,
      )}
    >
      DashCard
    </div>
  );
};

export default DashCard;
