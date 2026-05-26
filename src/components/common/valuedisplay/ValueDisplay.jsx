import { cn } from "@/lib/utils";
import React from "react";

const ValueDisplay = ({ title, value, className }) => {
  return (
    <div className={cn(className, "flex flex-col gap-1")}>
      <span className=" text-gray-600 text-sm">{title || `Title`}</span>
      {value ? (
        <span className="text-gray-800 font-semibold">
          {value || `Display Value`}
        </span>
      ) : (
        <div className="h-5 w-3/4 rounded-lg bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
};

export default ValueDisplay;
