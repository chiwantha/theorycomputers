"use client";

import RequiredSymbole from "@/components/common/form/required/RequiredSymbole";
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
  required,
  readonly,
  onChange,
  max,
  combo = false,
  combobox_items = [],
  onComboboxChange, // pass selected value handler
  textarea = false, // new prop
  textareaRows = 4, // default rows
  disabled,
}) => {
  if (combo) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className={LabelStyle}>
            {label} {required === true && <RequiredSymbole />}
          </label>
        )}
        <Combobox
          items={combobox_items}
          itemToStringValue={(item) => item.label || ""}
          value={
            (value &&
              combobox_items.find((item) => item.value === value)?.value) ||
            ""
          }
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
  } else if (textarea) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className={LabelStyle}>
            {label} {required === true && <RequiredSymbole />}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          rows={textareaRows}
          maxLength={max}
          readOnly={readonly}
          value={value}
          onChange={onChange}
          className={cn(InputStyle, inputClassName)}
          disabled={disabled}
        />
      </div>
    );
  } else {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={id} className={LabelStyle}>
            {label} {required === true && <RequiredSymbole />}
          </label>
        )}
        <input
          type={type}
          name={name}
          id={id}
          required={true}
          readOnly={readonly}
          maxLength={max}
          max={max}
          value={value}
          min={0}
          onChange={onChange}
          className={cn(InputStyle, inputClassName)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
};

export default NextInput;
