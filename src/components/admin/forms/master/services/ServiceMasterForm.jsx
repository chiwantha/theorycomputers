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
import { useRouter } from "next/navigation";
import { validateFields } from "@/lib/validation";

const ServiceMasterForm = ({ defaultData, form_props, close_drawer }) => {
  const { category_list, warranty_list } = form_props || {};
  const [pending, setIsPending] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: ``,
    code: ``,
    name: ``,
    category_id: ``,
    warranty_id: ``,
    description: ``,
    image: ``,
    cost: ``,
    selling: ``,
    online: ``,
  });

  useEffect(() => {
    setIsPending(false);
    if (defaultData)
      setFormData({
        id: defaultData.row.id,
        code: defaultData.row.code,
        name: defaultData.row.name,
        category_id: defaultData.row.category_id,
        warranty_id: defaultData.row.warranty_id,
        description: defaultData.row.description,
        image: defaultData.row.image,
        cost: defaultData.row.cost,
        selling: defaultData.row.selling,
        online: defaultData.row.online,
      });
    else
      setFormData({
        id: ``,
        code: ``,
        name: ``,
        category_id: ``,
        warranty_id: ``,
        description: ``,
        image: ``,
        cost: ``,
        selling: ``,
        online: ``,
      });
  }, [defaultData]);

  const handleCrud = async () => {
    setIsPending(true);

    try {
      const isEdit = defaultData?.type === "edit";
      const isDelete = defaultData?.type === "delete";

      const method = isDelete ? "DELETE" : isEdit ? "PUT" : "POST";

      let validation;

      if (method === "POST") {
        validation = validateFields(formData, [
          "name",
          "category_id",
          "cost",
          "selling",
          "online",
        ]);
      } else if (method === "PUT") {
        validation = validateFields(formData, [
          "id",
          "name",
          "category_id",
          "cost",
          "selling",
          "online",
        ]);
      } else {
        // delete → only id
        validation = validateFields(formData, ["id"]);
      }

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

      const data = new FormData();
      data.append("id", formData.id);
      data.append("code", formData.code);
      data.append("name", formData.name);
      data.append("category", formData.category_id);
      data.append("warranty", formData.warranty_id);
      data.append("description", formData.description);
      data.append("image", formData.image);
      data.append("cost", formData.cost);
      data.append("selling", formData.selling);
      data.append("serial", 0);
      data.append("type", `S`);
      data.append("online", formData.online);

      const res = await fetch(`/api/admin/master/items/`, {
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
        `Service ${
          isDelete ? "Deleted" : isEdit ? "Updated" : "Created"
        } successfully !`,
      );

      setFormData({
        id: ``,
        code: ``,
        name: ``,
        category_id: ``,
        warranty_id: ``,
        description: ``,
        image: ``,
        cost: ``,
        selling: ``,
        online: ``,
      });
      close_drawer(true);
      router.refresh();
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* header form */}
      <FormHeader defaultData={defaultData} title={`Master Service`} />
      <Separator />
      {!defaultData || defaultData?.type !== `delete` ? (
        //form
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          {defaultData && (
            <NextInput
              label={`Service Id`}
              id={`service_id`}
              name={`service_id`}
              placeholder={`SER-001`}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              value={formData.id}
            />
          )}
          <NextInput
            label={`Service Code`}
            id={`service_code`}
            max={10}
            name={`service_code`}
            placeholder={`NOPOWREP`}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            value={formData.code}
          />
          <NextInput
            label={`Service Name`}
            id={`service_name`}
            name={`service_name`}
            max={150}
            required={true}
            placeholder={`No Power Repair`}
            className={`sm:col-span-2`}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
          />
          <NextDropdown
            label={`Category`}
            id={`service_category`}
            placeholder={`Laptop`}
            required={true}
            items={category_list}
            defaultValue={formData.category_id}
            onChange={(value) =>
              setFormData({ ...formData, category_id: value })
            }
          />
          <NextDropdown
            placeholder={`Yes / No`}
            label={`Online`}
            id={`online`}
            required={true}
            items={[
              { value: 1, label: `Yes` },
              { value: 0, label: `No` },
            ]}
            defaultValue={formData.online}
            onChange={(value) => setFormData({ ...formData, online: value })}
          />
          <NextInput
            label={`Description`}
            id={`service_description`}
            textarea={true}
            textareaRows={3}
            placeholder={`We'll Update Windows And All Necessary Softwares ...`}
            className={`sm:col-span-2`}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description || ``}
          />
          <NextImageInput
            label={`Image`}
            onChange={(img) => setFormData({ ...formData, image: img })}
            folder={`/master/items`}
            value={formData.image}
          />
          <Separator />
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-full">
              <NextDropdown
                label={`Warranty`}
                id={`service_warranty`}
                placeholder={`Blank for No Warranty`}
                items={warranty_list}
                defaultValue={formData.warranty_id}
                onChange={(value) =>
                  setFormData({ ...formData, warranty_id: value })
                }
              />
            </div>
            <NextInput
              label={`Cost`}
              id={`service_cost`}
              name={`item_cost`}
              placeholder={`189000`}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              value={formData.cost}
            />
            <NextInput
              label={`Selling`}
              id={`service_selling`}
              required={true}
              name={`service_selling`}
              placeholder={`201000`}
              onChange={(e) =>
                setFormData({ ...formData, selling: e.target.value })
              }
              value={formData.selling}
            />
          </div>
          <Separator />
          <Button
            name={
              pending
                ? `Processing !`
                : `${defaultData ? `Update` : `Save`} Service`
            }
            bg={`bg-green-400 hover:bg-green-500 text-white`}
            click={() => {
              handleCrud();
            }}
            disabled={pending}
          />
        </div>
      ) : (
        //delete
        <DeleteData
          defaultData={defaultData}
          table={`mst_items`}
          explicit={false}
          click={() => {
            handleCrud();
          }}
        />
      )}
    </div>
  );
};

export default ServiceMasterForm;
