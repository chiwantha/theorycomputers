"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputStyle, LabelStyle } from "@/constant/Forms";
import RequiredSymbole from "../required/RequiredSymbole";

const NextDropdown = ({
  items = [],
  onChange,
  defaultValue = null,
  placeholder = "Select...",
  name,
  id,
  className,
  required,
  label,
}) => {
  const [selected, setSelected] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const appliedDefaultRef = useRef(undefined); // tracks last applied defaultValue

  useEffect(() => {
    // Runs when defaultValue changes OR when items arrive (async load case)
    if (defaultValue !== appliedDefaultRef.current) {
      appliedDefaultRef.current = defaultValue;

      if (defaultValue !== null && defaultValue !== undefined) {
        const defaultItem = items.find((i) => i.value === defaultValue);
        if (defaultItem) {
          setSelected(defaultItem.label);
          setSelectedValue(defaultItem.value);
          return;
        }
      }
      // defaultValue is null/undefined or item not found → reset
      setSelected("");
      setSelectedValue(null);
    }
  }, [defaultValue, items]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item.label);
    setSelectedValue(item.value);
    setOpen(false);
    setSearch("");
    onChange?.(item.value);
  };

  const handleClear = () => {
    setSelected("");
    setSelectedValue(null);
    setSearch("");
    onChange?.(null);
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label htmlFor={id} className={LabelStyle}>
          {label} {required === true && <RequiredSymbole />}
        </label>
      )}

      <div
        className={cn(
          "outline-none w-full rounded-xl bg-gray-100 py-2 flex justify-between relative",
          className,
        )}
        ref={containerRef}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between cursor-pointer px-4 w-full"
        >
          <span>
            {selected ? (
              selected
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>

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
            <ChevronDownIcon
              className={`${open && `rotate-180`} w-4 h-4 text-gray-500 transition-all duration-300`}
            />
          </div>
        </button>

        {open && (
          <div className="absolute mt-10 w-full border border-gray-300 bg-white rounded-xl max-h-60 overflow-y-auto z-10 shadow-md">
            <input
              type="text"
              id={id}
              name={name}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={cn(
                InputStyle,
                "border-b border-gray-200 rounded-t-xl",
              )}
            />

            <ul>
              {filteredItems.length === 0 ? (
                <li className="px-4 py-2 text-gray-400">No items found</li>
              ) : (
                filteredItems.map((item) => (
                  <li
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer px-4 py-2 hover:bg-blue-100 rounded-xl"
                  >
                    {item.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextDropdown;
