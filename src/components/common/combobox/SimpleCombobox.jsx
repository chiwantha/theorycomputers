"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function extractItem(item) {
  const values = Object.values(item || {});

  const id = values?.[0];
  const label = values?.[1];

  return {
    value: id !== undefined && id !== null ? String(id) : undefined,
    label: label ?? String(id ?? ""),
  };
}

export default function SimpleCombobox({
  items = [],
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = React.useState(false);

  const mapped = (items || [])
    .map(extractItem)
    .filter((i) => i.value !== undefined); // prevent crash

  return (
    <ComboboxPrimitive.Root
      items={mapped}
      value={value}
      onValueChange={(val) => {
        onChange?.(val); // always returns ID
        setOpen(false);
      }}
      open={open}
      onOpenChange={setOpen}
      itemToStringValue={(item) => item?.label ?? ""}
    >
      {/* INPUT */}
      <div className="relative w-full">
        <ComboboxPrimitive.Input
          placeholder={placeholder}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <ComboboxPrimitive.Trigger className="absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDownIcon className="size-4 text-gray-500" />
        </ComboboxPrimitive.Trigger>
      </div>

      {/* DROPDOWN */}
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner className="z-50">
          <ComboboxPrimitive.Popup className="w-[var(--anchor-width)] mt-1 bg-white border rounded-md shadow-md max-h-60 overflow-auto">
            {mapped.length === 0 && (
              <div className="p-2 text-sm text-gray-500 text-center">
                No items found
              </div>
            )}

            <ComboboxPrimitive.List>
              {(item) => (
                <ComboboxPrimitive.Item
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm cursor-pointer",
                    "hover:bg-gray-100 data-[highlighted]:bg-gray-100",
                  )}
                >
                  {item.label}

                  <ComboboxPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}
