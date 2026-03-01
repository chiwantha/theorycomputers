"use client";

import { BrandMasterList } from "@/constant/DummyBrandMaster";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { CategoryMasterList } from "@/constant/DummyCategoryMaster";
import NextImageInput from "@/components/common/form/nextinput/NextImageInput";
import Button from "@/components/common/button/Button";
import { useEffect, useState } from "react";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import Separator from "@/components/common/separator/Separator";

const ItemMasterForm = ({ defaultData }) => {
  const defaultFormData = defaultData?.row || {};
  const [formData, setFormData] = useState({
    id: ``,
    code: ``,
    name: ``,
    brand: ``,
    category: ``,
    category_id: ``,
    description: ``,
    image: ``,
    cost: ``,
    selling: ``,
    reorder: ``,
    serial: ``,
  });

  useEffect(() => {
    // alert(JSON.stringify(defaultData));
    if (defaultData)
      setFormData({
        id: defaultFormData.id,
        code: defaultFormData.code,
        name: defaultFormData.name,
        brand: defaultFormData.brand,
        category: defaultFormData.category,
        category_id: defaultFormData.category_id,

        description: defaultFormData.description,
        image: defaultFormData.image,
        cost: defaultFormData.cost,
        selling: defaultFormData.selling,
        reorder: defaultFormData.reorder_level,
        serial: defaultFormData.is_serial,
      });
    else
      setFormData({
        id: ``,
        code: ``,
        name: ``,
        brand: ``,
        category: ``,
        category_id: ``,

        description: ``,
        image: ``,
        cost: ``,
        selling: ``,
        reorder: ``,
        serial: ``,
      });
  }, [defaultData]);

  const brands = BrandMasterList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
  const categories = CategoryMasterList.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append(`id`, formData.id);
      data.append(`code`, formData.code);
      data.append(`name`, formData.name);
      data.append(`brand`, formData.brand);
      data.append(`category`, formData.category);
      data.append(`description`, formData.description);
      data.append(`image`, formData.image);
      data.append(`cost`, formData.cost);
      data.append(`selling`, formData.selling);
      data.append(`serial`, formData.serial);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/master/items/new`,
        {
          method: "POST",
          body: data,
        },
      );

      if (!res.ok) {
        alert(`Save Failed !`);
        return;
      }

      alert(`Saved !`);
      return;
    } catch (err) {
      alert(`Error On Save !`, err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* header form */}
      <div>
        <span className="font-black text-2xl uppercase text-gray-700">
          {!defaultData && "New Master Item"}

          {defaultData?.type === "edit" && `Edit ${defaultData?.row.id}`}

          {defaultData?.type === "delete" && (
            <span className="text-red-600">Delete {defaultData?.row.id}?</span>
          )}
        </span>
      </div>
      <Separator />
      {!defaultData || defaultData?.type !== `delete` ? (
        //form
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <NextInput
            label={`Item Id`}
            id={`item_id`}
            name={`item_id`}
            placeholder={`ITM-001`}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            value={formData.id}
          />
          <NextInput
            label={`Item Code`}
            id={`item_code`}
            name={`item_code`}
            placeholder={`LAP1504VA`}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            value={formData.code}
          />
          <NextInput
            label={`Item Name`}
            id={`item_name`}
            name={`item_name`}
            required={true}
            placeholder={`Asus Vivobook X1504VA`}
            className={`sm:col-span-2`}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />

          <NextDropdown
            // key={defaultFormData ? defaultFormData.id + "bra" : "new"}
            label={`Brand`}
            id={`item_brand`}
            placeholder={`Asus`}
            required={true}
            items={brands}
            defaultValue={defaultData ? formData.category_id : null}
            onChange={(value) => setFormData({ ...formData, brand: value })}
          />
          <NextDropdown
            // key={defaultFormData ? defaultFormData.id + "cat" : "new"}
            label={`Category`}
            id={`item_category`}
            placeholder={`Laptop`}
            required={true}
            items={categories}
            defaultValue={defaultData ? formData.category_id : null}
            onChange={(value) => setFormData({ ...formData, category: value })}
          />
          <NextInput
            label={`Description`}
            id={`item_description`}
            textarea={true}
            textareaRows={3}
            placeholder={`Asus Vivobook 15 X1504VA i5 13th Gen 8-Gb Ram ...`}
            className={`sm:col-span-2`}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description}
          />
          <NextImageInput
            label={`Image`}
            onChange={(img) => setFormData({ ...formData, image: img })}
            value={formData.image}
          />
          <Separator />
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NextInput
              label={`Cost`}
              id={`item_cost`}
              name={`item_cost`}
              placeholder={`189000`}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              value={formData.cost}
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
              value={formData.selling}
            />
            <NextInput
              label={`ReOrder`}
              id={`stock_reorder`}
              required={true}
              name={`stock_reorder`}
              placeholder={`201000`}
              onChange={(e) =>
                setFormData({ ...formData, selling: e.target.value })
              }
              value={formData.selling}
            />
            <NextDropdown
              placeholder={`Yes / No`}
              label={`Serial`}
              id={`item_serial`}
              required={true}
              items={[
                { value: 1, label: `Yes` },
                { value: 0, label: `No` },
              ]}
              defaultValue={defaultData ? (formData.serial ? 1 : 0) : null}
              onChange={(value) => setFormData({ ...formData, serial: value })}
            />
          </div>
          <Separator />
          <Button
            name={`Save Item`}
            bg={`bg-green-400 hover:bg-green-500 text-white`}
            click={() => {
              handleSave();
            }}
          />
        </div>
      ) : (
        //delete
        <div className="w-full flex flex-col gap-2">
          <span className="capitalize text-gray-600">
            Do You Really Want to Delete{" "}
            <span className="font-bold text-gray-700">
              {defaultData?.row?.name}
            </span>{" "}
            From Item Master
          </span>
          <Button
            name={`Delete`}
            bg={`bg-red-600 hover:bg-red-700 text-white`}
          />
        </div>
      )}
    </div>
  );
};

export default ItemMasterForm;
