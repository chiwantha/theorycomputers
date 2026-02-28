"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputStyle } from "@/constant/Forms";

const NextDropdown = ({
  items = [], // array of { value, label }
  onChange, // callback returns selected value
  defaultValue = null, // auto-select by value
  placeholder = "Select...",
  className = "",
}) => {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); // search input
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
        setSearch(""); // clear search on close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item.label);
    setOpen(false);
    setSearch("");
    onChange?.(item.value);
  };

  const handleClear = () => {
    setSelected("");
    onChange?.(null);
  };

  // filter items based on search
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={cn("relative w-60", className)} ref={containerRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          InputStyle,
          "flex items-center justify-between cursor-pointer p-0 ",
        )}
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

      {/* Dropdown List */}
      {open && (
        <div className="absolute mt-1 w-full border border-gray-300 bg-white rounded-xl max-h-60 overflow-y-auto z-10 shadow-md">
          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={cn(InputStyle, "border-b border-gray-200 rounded-t-xl")}
          />

          {/* Items */}
          <ul>
            {filteredItems.length === 0 ? (
              <li className="px-4 py-2 text-gray-400">No items found</li>
            ) : (
              filteredItems.map((item) => (
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
        </div>
      )}
    </div>
  );
};

export default NextDropdown;
