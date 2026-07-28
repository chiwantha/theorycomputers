"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const ValueDisplay = ({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
  type,
}) => {
  const [isShow, setIsShow] = useState(false);

  const isPassword = type === "password";

  const displayValue =
    isPassword && !isShow ? "•".repeat(String(value || "").length || 8) : value;

  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-lg border-blue-200 px-4 py-2 group",
        className,
      )}
    >
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-wide text-gray-500",
          titleClassName,
        )}
      >
        {title || "Title"}
      </span>

      {value ? (
        <div className="mt-1.5 flex items-center justify-between gap-3 ">
          <span
            className={cn(
              "truncate font-semibold text-gray-800",
              valueClassName,
            )}
          >
            {displayValue}
          </span>

          {isPassword && (
            <button
              type="button"
              onClick={() => setIsShow(!isShow)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              {isShow ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      ) : (
        // <div className="mt-2 h-5 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
        <span
          className={cn("truncate font-semibold text-gray-800", valueClassName)}
        >
          -
        </span>
      )}
    </div>
  );
};

export default ValueDisplay;
