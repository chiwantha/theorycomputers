"use client";

import Button from "@/components/common/button/Button";
import DeleteData from "@/components/common/form/deletedata/DeleteData";
import FormHeader from "@/components/common/form/formheader/FormHeader";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { validateFields } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupplierMasterForm = ({ defaultData, form_props, close_drawer }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [formData, setformdata] = useState({
    id: ``,
    name: ``,
    agent: ``,
    phone: ``,
    whatsapp: ``,
    email: ``,
    address: ``,
  });

  useEffect(() => {
    setPending(false);
    if (defaultData) {
      setformdata({
        id: defaultData?.row?.id,
        name: defaultData?.row?.name,
        agent: defaultData?.row?.agent,
        phone: defaultData?.row?.phone,
        whatsapp: defaultData?.row?.whatsapp,
        email: defaultData?.row?.email,
        address: defaultData?.row?.address,
      });
    } else {
      setformdata({
        id: ``,
        name: ``,
        agent: ``,
        phone: ``,
        whatsapp: ``,
        email: ``,
        address: ``,
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
      data.append(`agent`, formData.agent);
      data.append(`phone`, formData.phone);
      data.append(`whatsapp`, formData.whatsapp);
      data.append(`email`, formData.email);
      data.append(`address`, formData.address);

      const method = isDelete ? "DELETE" : isEdit ? "PUT" : "POST";

      let validation;

      if (method === "POST") {
        validation = validateFields(formData, ["name", "agent", "phone"]);
      } else if (method === "PUT") {
        validation = validateFields(formData, ["id", "name", "agent", "phone"]);
      } else {
        validation = validateFields(formData, ["id"]);
      }

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

      const res = await fetch(`/api/admin/master/suppliers`, {
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
      <FormHeader defaultData={defaultData} title={`Supplier`} />
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
            placeholder={`K-Chord ( Pvt ) Ltd`}
            name={`name`}
            max={150}
            value={formData.name}
            onChange={(e) => setformdata({ ...formData, name: e.target.value })}
            className={`sm:col-span-2`}
            required={true}
          />
          <NextInput
            label={`Agent`}
            placeholder={`Kasun Chiwantha`}
            name={`agent`}
            max={150}
            value={formData.agent}
            onChange={(e) =>
              setformdata({ ...formData, agent: e.target.value })
            }
            className={`sm:col-span-2`}
            required={true}
          />
          <Separator />
          <NextInput
            label={`Phone`}
            placeholder={`0788806670`}
            name={`phone`}
            max={10}
            value={formData.phone}
            onChange={(e) =>
              setformdata({ ...formData, phone: e.target.value })
            }
            required={true}
          />
          <NextInput
            label={`WhatsApp`}
            placeholder={`0761294262`}
            name={`whatsapp`}
            max={10}
            value={formData.whatsapp}
            onChange={(e) =>
              setformdata({ ...formData, whatsapp: e.target.value })
            }
          />
          <NextInput
            label={`Email`}
            placeholder={`contact@kchord.com`}
            name={`email`}
            max={50}
            value={formData.email}
            onChange={(e) =>
              setformdata({ ...formData, email: e.target.value })
            }
          />
          <NextInput
            label={`Address`}
            placeholder={`No. 361/23 parangoda , Dekatana`}
            name={`address`}
            max={150}
            value={formData.address}
            onChange={(e) =>
              setformdata({ ...formData, address: e.target.value })
            }
          />

          <Separator />
          <Button
            name={
              pending
                ? `Processing !`
                : `${defaultData ? `Update` : `Save`} Supplier`
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

export default SupplierMasterForm;
