"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { InputStyle, LabelStyle } from "@/constant/Forms";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const NextInput = ({
  type = "text",
  name,
  id,
  label, // dynamic label
  className, // wrapper classes
  inputClassName, // input-specific classes
  placeholder,
  value,
  onChange,
  combo = false,
  combobox_items = [],
  onComboboxChange, // pass selected value handler
}) => {
  if (!combo) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className={LabelStyle}>
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className={cn(InputStyle, inputClassName)}
          placeholder={placeholder}
        />
      </div>
    );
  } else {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className={LabelStyle}>
            {label}
          </label>
        )}
        <Combobox
          items={combobox_items}
          itemToStringValue={(item) => item.label || ""}
          onValueChange={(item) => onComboboxChange?.(item)}
        >
          <ComboboxInput placeholder={placeholder} showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {combobox_items.map((item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  }
};

export default NextInput;
