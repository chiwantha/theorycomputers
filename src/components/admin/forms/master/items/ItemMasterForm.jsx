"use client";

import NextInput from "@/components/common/form/nextinput/NextInput";
import NextImageInput from "@/components/common/form/nextinput/NextImageInput";
import Button from "@/components/common/button/Button";
import { useEffect, useState } from "react";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import Separator from "@/components/common/separator/Separator";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import DeleteData from "@/components/common/form/deletedata/DeleteData";
import { toast } from "react-toastify";

const ItemMasterForm = ({ defaultData }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
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
    const load_cat_brand = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/admin/support/load_cat_brand`,
          { next: { revalidate: 60 } },
        );

        if (!res.ok) {
          return [];
        }

        const data = await res.json();
        setCategories(data.categories);
        setBrands(data.brands);
        return;
      } catch (err) {
        return [];
      }
    };
    load_cat_brand();
    if (defaultData)
      setFormData({
        id: defaultData.row.id,
        code: defaultData.row.code,
        name: defaultData.row.name,
        brand: defaultData.row.brand,
        category: defaultData.row.category,
        category_id: defaultData.row.category_id,
        description: defaultData.row.description,
        image: defaultData.row.image,
        cost: defaultData.row.cost,
        selling: defaultData.row.selling,
        reorder: defaultData.row.reorder_level,
        serial: defaultData.row.is_serial,
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
      data.append(`reorder`, formData.reorder);
      data.append(`serial`, formData.serial);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/master/items/action`,
        {
          method: defaultData ? "PUT" : "POST",
          body: data,
        },
      );

      if (!res.ok) {
        toast.error(`Save Failed !`);
        return;
      }

      toast.success(`Item Saved`);
      return;
    } catch (err) {
      alert(`Error On Save !`, err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* header form */}
      <FormHeader defaultData={defaultData} title={`Master Item`} />
      <Separator />
      {!defaultData || defaultData?.type !== `delete` ? (
        //form
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {defaultData && (
            <NextInput
              label={`Item Id`}
              id={`item_id`}
              name={`item_id`}
              placeholder={`ITM-001`}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              value={formData.id}
            />
          )}
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
            label={`Brand`}
            id={`item_brand`}
            placeholder={`Asus`}
            required={true}
            items={brands}
            defaultValue={defaultData ? formData.category_id : null}
            onChange={(value) => setFormData({ ...formData, brand: value })}
          />
          <NextDropdown
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
                setFormData({ ...formData, reorder: e.target.value })
              }
              value={formData.reorder}
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
        <DeleteData
          defaultData={defaultData}
          table={`mst_items`}
          explicit={false}
        />
      )}
    </div>
  );
};

export default ItemMasterForm;
