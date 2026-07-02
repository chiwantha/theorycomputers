import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputStyle, InputStyleSdc } from "@/constant/Forms";

export default function ComboboxAdapter({
  items = [],
  name,
  placeholder = "Select...",
  defaultValue = "",
  onChange,
  className,
}) {
  const selectedItem =
    items.find((item) => item.value === defaultValue) || null;

  return (
    <Combobox
      name={name}
      items={items}
      value={selectedItem}
      itemToStringValue={(item) => item?.label || ""}
      onValueChange={(item) => {
        onChange?.(item?.value || "", item);
      }}
    >
      <ComboboxInput
        placeholder={placeholder}
        className={`${InputStyleSdc} ${className}`}
      />

      <ComboboxContent
        className={`my-1 bg-white rounded-xl border-none ring-0 `}
      >
        <ComboboxEmpty
          className={`border-gray-300 border text-gray-600 outline-none rounded-xl py-4 text-base`}
        >
          No items found !
        </ComboboxEmpty>

        <ComboboxList
          className={`border-gray-300 border outline-none rounded-xl `}
        >
          {(item) => (
            <ComboboxItem
              key={item.value}
              value={item}
              className={`hover:bg-blue-100 rounded-lg py-2 px-2`}
            >
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
