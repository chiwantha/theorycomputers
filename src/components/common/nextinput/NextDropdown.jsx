"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // optional for custom classNames

const NextDropdown = ({
  items = [], // array of { value, label }
  onChange, // callback returns selected value
  defaultValue = null, // auto-select by value
  placeholder = "Select...",
  className = "",
}) => {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle default value
  useEffect(() => {
    if (defaultValue !== null && defaultValue !== undefined) {
      const defaultItem = items.find((i) => i.value === defaultValue);
      setSelected(defaultItem ? defaultItem.label : "");
    }
  }, [defaultValue, items]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item.label);
    setOpen(false);
    onChange?.(item.value);
  };

  const handleClear = () => {
    setSelected("");
    onChange?.(null);
  };

  return (
    <div className={cn("relative w-60", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-left flex justify-between items-center bg-white"
      >
        <span>{selected || placeholder}</span>
        <div className="flex items-center gap-2">
          {selected && (
            <XIcon
              className="w-4 h-4 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </div>
      </button>

      {open && (
        <ul className="absolute mt-1 w-full border border-gray-300 bg-white rounded-md max-h-60 overflow-y-auto z-10 shadow-md">
          {items.length === 0 ? (
            <li className="px-4 py-2 text-gray-400">No items found</li>
          ) : (
            items.map((item) => (
              <li
                key={item.value}
                onClick={() => handleSelect(item)}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
              >
                {item.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default NextDropdown;
