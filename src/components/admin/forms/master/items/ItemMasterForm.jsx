"use client";

import RequiredSymbole from "@/components/common/required/RequiredSymbole";
import { InputStyle, LabelStyle } from "@/constant/Forms";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { BrandMasterList } from "@/constant/DummyBrandMaster";

const ItemMasterForm = () => {
  const frameworks = BrandMasterList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
  return (
    <div className="flex flex-col gap-6">
      {/* <div className=""></div> */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="item_id" className={LabelStyle}>
            Item Id
          </label>
          <input
            type="text"
            name="item_id"
            id="item_id"
            className={InputStyle}
            placeholder="ITM-001"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="item_code" className={LabelStyle}>
            Item Code
          </label>
          <input
            type="text"
            name="item_code"
            id="item_code"
            className={InputStyle}
            placeholder="LAP1504VA"
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="item_name" className={LabelStyle}>
            Item Name <RequiredSymbole />
          </label>
          <input
            type="text"
            name="item_name"
            id="item_name"
            className={InputStyle}
            placeholder="Asus Vivobook X1504VA"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="item_id" className={LabelStyle}>
            Brand
          </label>
          <Combobox
            items={frameworks}
            itemToStringValue={(framework) => framework.label}
          >
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(framework) => (
                  <ComboboxItem key={framework.value} value={framework}>
                    {framework.label}
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
