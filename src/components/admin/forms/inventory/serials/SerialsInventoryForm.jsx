"use client";

import Button from "@/components/common/button/Button";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { validateFields } from "@/lib/validation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SerialsInventoryForm = ({ defaultData, form_props, close_drawer }) => {
  const [pending, setPending] = useState(false);
  const [formData, setformData] = useState({
    id: ``,
    serial: ``,
    stock: ``,
  });

  useEffect(() => {
    setPending(false);
    if (defaultData) {
      setformData({
        id: defaultData?.row?.id,
        serial: defaultData?.row?.serial,
        stock: defaultData?.row?.stock,
      });
    } else {
      setformData({
        id: ``,
        serial: ``,
        stock: ``,
      });
    }
  }, [defaultData]);

  const handleCrud = async () => {
    setPending(true);
    try {
      const isEdit = defaultData?.type === "edit";
      const isDelete = defaultData?.type === "delete";
      const method = isDelete ? `DELETE` : isEdit ? `PUT` : `POST`;

      let validation;

      if (method === "POST") {
        validation = validateFields(formData, ["serial"]);
      } else if (method === "PUT") {
        validation = validateFields(formData, ["id", "serial"]);
      } else {
        validation = validateFields(formData, ["id"]);
      }

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

      const data = new FormData();
      data.append(`id`, formData.id);
      data.append(`serial`, formData.serial);
      data.append(`stock`, formData.stock);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/inventory/serials`,
        {
          method,
          body: data,
        },
      );

      if (!res.ok) {
        toast.error(
          `${isDelete ? "Delete" : isEdit ? "Update" : "Create"} failed !`,
        );
        return;
      }

      toast.success(
        `${
          isDelete ? "Deleted" : isEdit ? "Updated" : "Created"
        } successfully !`,
      );

      router.refresh();
      close_drawer(true);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex-col flex gap-6">
      <FormHeader defaultData={defaultData} title={`Item Serial`} />
      {defaultData && defaultData?.type !== `delete` ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {defaultData && (
            <NextInput
              name={`id`}
              label={`Serial Id`}
              value={formData.id}
              placeholder={`ITM001`}
              onChange={(e) => setformData({ ...formData, id: e.target.value })}
            />
          )}
          <NextInput
            name={`serial`}
            value={formData.serial}
            placeholder={`SER4598CP001`}
            onChange={(e) =>
              setformData({ ...formData, serial: e.target.value })
            }
            label={`Serial No`}
          />

          <Button
            name={
              pending
                ? `Processing !`
                : `${defaultData ? `Update` : `Save`} Serial`
            }
            bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
            click={() => {
              handleCrud();
            }}
            disabled={pending}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          You Cannot Create Items Serials Without Grn
        </div>
      )}
    </div>
  );
};

export default SerialsInventoryForm;
