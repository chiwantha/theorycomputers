"use client";

import { BrandMasterList } from "@/constant/DummyBrandMaster";
import NextInput from "@/components/common/nextinput/NextInput";
import { CategoryMasterList } from "@/constant/DummyCategoryMaster";
import NextImageInput from "@/components/common/nextinput/NextImageInput";
import Button from "@/components/common/button/Button";
import { useState } from "react";

const ItemMasterForm = () => {
  const [formData, setFormData] = useState({
    id: ``,
    code: ``,
    brand: ``,
    category: ``,
    description: ``,
    image: ``,
    cost: ``,
    selling: ``,
    serial: ``,
  });

  const brands = BrandMasterList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
  const categories = CategoryMasterList.map((category) => ({
    value: category.id,
    label: category.name,
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
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        />
        <NextInput
          label={`Item Code`}
          id={`item_code`}
          name={`item_code`}
          placeholder={`LAP1504VA`}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        />
        <NextInput
          label={`Item Name`}
          id={`item_name`}
          name={`item_name`}
          required={true}
          placeholder={`Asus Vivobook X1504VA`}
          className={`sm:col-span-2`}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <NextInput
          label={`Brand`}
          id={`item_brand`}
          required={true}
          combo={true}
          combobox_items={brands}
          placeholder={`Asus`}
          onComboboxChange={(e) =>
            setFormData({ ...formData, brand: e?.value })
          }
        />
        <NextInput
          label={`Category`}
          id={`item_category`}
          required={true}
          combo={true}
          combobox_items={categories}
          placeholder={`Laptop`}
          onComboboxChange={(e) =>
            setFormData({ ...formData, category: e?.value })
          }
        />
        <NextInput
          label={`Description`}
          id={`item_category`}
          textarea={true}
          textareaRows={3}
          placeholder={`Asus Vivobook 15 X1504VA i5 13th Gen 8-Gb Ram ...`}
          className={`sm:col-span-2`}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <NextImageInput
          label={`Image`}
          onChange={(img) => setFormData({ ...formData, image: img })}
        />
        <hr className="border-gray-200 w-full col-span-full my-2" />
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NextInput
            label={`Cost`}
            id={`item_cost`}
            name={`item_cost`}
            placeholder={`189000`}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          />
          <NextInput
            label={`Selling`}
            id={`item_selling`}
            required={true}
            name={`item_selling`}
            placeholder={`201000`}
            onChange={(e) =>
              setFormData({ ...formData, selling: e.target.value })
            }
          />
          <NextInput
            label={`Serial`}
            id={`item_serial`}
            required={true}
            combo={true}
            combobox_items={[
              { value: 1, label: `Yes` },
              { value: 0, label: `No` },
            ]}
            placeholder={`Yes / No`}
            onComboboxChange={(e) =>
              setFormData({ ...formData, serial: e?.value })
            }
          />
        </div>
        <hr className="border-gray-200 w-full col-span-full my-2" />
        <Button
          name={`Save Item`}
          bg={`bg-green-400 hover:bg-green-500 text-white`}
          click={() => {
            alert(JSON.stringify(formData, null, 2));
          }}
        />
      </div>
    </div>
  );
};

export default ItemMasterForm;
