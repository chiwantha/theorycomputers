"use client";

import RequiredSymbole from "@/components/common/required/RequiredSymbole";
import { InputStyle, LabelStyle } from "@/constant/Forms";
import { BrandMasterList } from "@/constant/DummyBrandMaster";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import NextInput from "@/components/common/input/NextInput";

const ItemMasterForm = () => {
  const brands = BrandMasterList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* <div className=""></div> */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <NextInput
          label={`Item Id`}
          id={`item_id`}
          name={`item_id`}
          placeholder={`ITM-001`}
        />
        <NextInput
          label={`Item Code`}
          id={`item_code`}
          name={`item_code`}
          placeholder={`LAP1504VA`}
        />
        <NextInput
          label={`Item Name`}
          id={`item_name`}
          name={`item_name`}
          placeholder={`Asus Vivobook X1504VA`}
          className={`md:col-span-2`}
        />

        <NextInput
          id={`item_brand`}
          combo={true}
          combobox_items={brands}
          label={`Brand`}
          placeholder={`Asus`}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="item_id" className={LabelStyle}>
            Brand
          </label>
          <Combobox
            items={brands}
            itemToStringValue={(brand) => brand.value}
            // onValueChange={(brand) => alert(brand?.value || 0)}
          >
            <ComboboxInput placeholder="Select a framework" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(brands) => (
                  <ComboboxItem key={brands.value} value={brands}>
                    {brands.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="item_code" className={LabelStyle}>
            Category
          </label>
          <input
            type="text"
            name="item_code"
            id="item_code"
            className={InputStyle}
            placeholder="LAP1504VA"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemMasterForm;
