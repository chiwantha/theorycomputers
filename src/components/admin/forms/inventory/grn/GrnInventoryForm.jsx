"use client";

import GrnRow from "@/components/admin/cards/inputRows/GrnRow";
import Button from "@/components/common/button/Button";

import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { validateFields } from "@/lib/validation";
import { useGRNStore } from "@/store/grnStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GrnInventoryForm = ({ form_props }) => {
  const router = useRouter();
  const { suppliers, items } = form_props || null;
  const [pending, setPending] = useState(false);

  const setHeaderField = useGRNStore((state) => state.setHeaderField);
  const grnNo = useGRNStore((state) => state.grnNo);
  const supplierId = useGRNStore((state) => state.supplierId);
  const poId = useGRNStore((state) => state.poId);
  const invoiceNo = useGRNStore((state) => state.invoiceNo);

  const resetGrn = useGRNStore((state) => state.resetGRN);

  const handleCrud = async () => {
    setPending(true);
    try {
      let validation;
      const stateData = useGRNStore.getState();
      // console.log(stateData);

      // fields verification
      validation = validateFields(stateData, [
        `grnNo`,
        `supplierId`,
        `poId`,
        `invoiceNo`,
      ]);

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

      // rows verification
      if (stateData?.rows.length <= 0) {
        toast.error(`Please add Items !`);
        return;
      } else if (stateData.rows.length >= 1) {
        for (const row of stateData.rows) {
          if (!row.itemId) {
            toast.error(`Select Valid Item!`);
            return;
          }

          if (!row.quantity) {
            toast.error(`Missing Quantity!`);
            return;
          }

          if (!row.cost) {
            toast.error(`Missing Item Cost!`);
            return;
          }

          if (row.serial) {
            const validSerials = row.serials.filter(
              (serial) => serial?.trim() !== "",
            );

            if (validSerials.length !== row.quantity) {
              toast.error(`Mismatch in serial and quantity!`);
              return;
            }
          }
        }
      }

      // data posting

      const data = new FormData();
      data.append(`grn_no`, stateData.grnNo);
      data.append(`supplier_id`, stateData.supplierId);
      data.append(`po_id`, stateData.poId);
      data.append(`invoice_no`, stateData.invoiceNo);
      data.append(`total`, stateData.netTotal);
      data.append(`grn_items`, JSON.stringify(stateData.rows));

      const res = await fetch(`/api/admin/inventory/grn`, {
        method: `POST`,
        body: data,
      });

      if (!res.ok) {
        toast.error(`Grn failed !`);
        return;
      }

      toast.success(`Saved !`);
      router.push(`/admin/inventory/grn`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    resetGrn();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden flex-col gap-6 md:flex">
        {/* Grn Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NextInput
            name={`id`}
            label={`Id`}
            placeholder={`000000`}
            disabled={true}
            inputClassName={`bg-red-50`}
          />
          <NextInput
            name={`grn_no`}
            label={`Grn No`}
            placeholder={`GRN0001`}
            max={15}
            value={grnNo}
            onChange={(e) => setHeaderField(`grnNo`, e.target.value)}
          />
          <NextDropdown
            name={`supplier`}
            label={`Supplier`}
            items={suppliers}
            placeholder={`K-Chord (Pvt) Ltd`}
            className={`col-span-full`}
            defaultValue={supplierId}
            onChange={(val) => setHeaderField(`supplierId`, val)}
          />
          <NextDropdown
            name={`po`}
            label={`Po Id`}
            items={[{ value: 0, label: `default` }]}
            placeholder={`PO0001`}
            defaultValue={poId}
            onChange={(val) => setHeaderField(`poId`, val)}
          />
          <NextInput
            name={`invoice_no`}
            label={`Invoice No`}
            placeholder={`INV0001`}
            value={invoiceNo}
            onChange={(e) => setHeaderField(`invoiceNo`, e.target.value)}
          />
        </div>
        <Separator title={`Grn Products`} />
        {/* grn products */}
        <GrnRow item_list={items} />

        <Button
          name={pending ? `Processing !` : `Save Grn`}
          bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
          click={() => {
            handleCrud();
          }}
          disabled={pending}
        />
      </div>

      <div className="flex items-center justify-center md:hidden flex-col text-center px-4">
        <p className="text-lg font-semibold">
          This module is not supported on small screens.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please use a device with a larger screen (tablet, laptop, or desktop)
          to access the GRN system.
        </p>
      </div>
    </div>
  );
};

export default GrnInventoryForm;
