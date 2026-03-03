"use client";

import Button from "@/components/common/button/Button";
import DeleteData from "@/components/common/form/deletedata/DeleteData";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CategoryMasterForm = ({ defaultData, form_props, close_drawer }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [formData, setformdata] = useState({
    id: ``,
    name: ``,
  });

  useEffect(() => {
    setPending(false);
    if (defaultData) {
      setformdata({
        id: defaultData?.row?.id,
        name: defaultData?.row?.name,
      });
    } else {
      setformdata({
        id: ``,
        name: ``,
      });
    }
  }, [defaultData]);

  const handleSave = async () => {
    setPending(true);
    try {
      const data = new FormData();
      data.append(`id`, formData.id);
      data.append(`name`, formData.name);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/master/categories`,
        {
          method: defaultData ? `PUT` : `POST`,
          body: data,
        },
      );

      if (!res.ok) {
        toast.error(`Save Failed !`);
        return;
      }

      toast.success(`Saved Succesfully !`);
      router.refresh();
      close_drawer(true);
      return;
    } catch (err) {
      console.log(`Saved Failed : `, err);
      toast.error(`Save Failed !`);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {};

  return (
    <div className="flex flex-col gap-6">
      <FormHeader defaultData={defaultData} title={`Category`} />
      {!defaultData || defaultData?.type !== `delete` ? (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {defaultData && (
            <NextInput
              label={`Id`}
              placeholder={`CAT001`}
              name={`id`}
              value={formData.id}
              onChange={(e) => setformdata({ ...formData, id: e.target.value })}
            />
          )}
          <NextInput
            label={`Name`}
            placeholder={`Laptops`}
            name={`name`}
            value={formData.name}
            onChange={(e) => setformdata({ ...formData, name: e.target.value })}
          />

          <Button
            name={
              pending
                ? `Processing !`
                : `${defaultData ? `Update` : `Save`} Item`
            }
            bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
            click={() => {
              handleSave();
            }}
            disabled={pending}
          />
        </div>
      ) : (
        <DeleteData defaultData={defaultData} click={() => handleDelete()} />
      )}
    </div>
  );
};

export default CategoryMasterForm;
