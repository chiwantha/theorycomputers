"use client";
import Button from "@/components/common/button/Button";
import DeleteData from "@/components/common/form/deletedata/DeleteData";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { validateFields } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WarrantyMasterForm = ({ defaultData, form_props, close_drawer }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [formData, setformdata] = useState({
    id: ``,
    name: ``,
    type: ``,
    duration: ``,
  });

  useEffect(() => {
    setPending(false);
    if (defaultData) {
      setformdata({
        id: defaultData?.row?.id,
        name: defaultData?.row?.name,
        type: defaultData?.row?.type,
        duration: defaultData?.row?.duration,
      });
    } else {
      setformdata({
        id: ``,
        name: ``,
        type: ``,
        duration: ``,
      });
    }
  }, [defaultData]);

  const handleCrud = async () => {
    setPending(true);

    try {
      const isEdit = defaultData?.type === "edit";
      const isDelete = defaultData?.type === "delete";

      const data = new FormData();
      data.append(`id`, formData.id);
      data.append(`name`, formData.name);
      data.append(`type`, formData.type);
      data.append(`duration`, formData.duration);

      const method = isDelete ? "DELETE" : isEdit ? "PUT" : "POST";

      let validation;

      if (method === "POST") {
        validation = validateFields(formData, ["name", "type", "duration"]);
      } else if (method === "PUT") {
        validation = validateFields(formData, [
          "id",
          "name",
          "type",
          "duration",
        ]);
      } else {
        validation = validateFields(formData, ["id"]);
      }

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

      const res = await fetch(`/api/admin/master/warranty`, {
        method,
        body: data,
      });

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
    <div className="flex flex-col gap-6">
      <FormHeader defaultData={defaultData} title={`Warranty`} />
      {!defaultData || defaultData?.type !== `delete` ? (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {defaultData && (
            <>
              <NextInput
                label={`Id`}
                placeholder={`BRD001`}
                name={`id`}
                value={formData.id}
                onChange={(e) =>
                  setformdata({ ...formData, id: e.target.value })
                }
              />
              <Separator />
            </>
          )}
          <NextInput
            label={`Name`}
            placeholder={`3 Month Shop Warranty`}
            name={`name`}
            value={formData.name}
            onChange={(e) => setformdata({ ...formData, name: e.target.value })}
            className={`sm:col-span-2`}
            required={true}
          />
          <NextDropdown
            name={`type`}
            defaultValue={formData.type}
            required={true}
            label={`Type`}
            items={[
              { value: `NONE`, label: `No Warranty` },
              { value: `SHOP`, label: `Shop Warranty` },
              { value: `SUPPLIER`, label: `Supplier Provide Warranty` },
            ]}
            placeholder="Select Warranty Type"
            onChange={(val) => setformdata({ ...formData, type: val })}
          />
          <NextInput
            label={`Duration ( In Months )`}
            placeholder={`3`}
            name={`duration`}
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setformdata({ ...formData, duration: e.target.value })
            }
            required={true}
          />
          <Button
            name={
              pending
                ? `Processing !`
                : `${defaultData ? `Update` : `Save`} Warranty`
            }
            bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
            click={() => {
              handleCrud();
            }}
            disabled={pending}
          />
        </div>
      ) : (
        <DeleteData defaultData={defaultData} click={() => handleCrud()} />
      )}
    </div>
  );
};

export default WarrantyMasterForm;
