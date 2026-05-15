"use client";
import AdjRow from "@/components/admin/cards/inputRows/AdjRow";
import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { validateFields } from "@/lib/validation";
import { useADJStore } from "@/store/adjStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StockAdjustmentForm = ({ form_props }) => {
  const router = useRouter();
  const { items } = form_props || null;
  const [pending, setPending] = useState(false);

  const setHeaderField = useADJStore((state) => state.setHeaderField);
  const adjNo = useADJStore((state) => state.adjNo);
  const type = useADJStore((state) => state.type);
  const reason = useADJStore((state) => state.reason);
  const note = useADJStore((state) => state.note);

  const resetAdj = useADJStore((state) => state.resetADJ);

  useEffect(() => {
    resetAdj();
  }, []);

  const handleCrud = async () => {
    setPending(true);
    try {
      let validation;
      const stateData = useADJStore.getState();
      // console.log(stateData);

      validation = validateFields(stateData, [`adjNo`, `type`, `reason`]);

      if (!validation.isValid) {
        toast.error(`Missing: ${validation.emptyFields.join(", ")}`);
        return;
      }

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
            toast.error(`Missing Quantity on ${row?.itemName} !`);
            return;
          }

          if (!row.type) {
            toast.error(`Missing Adj Type! on ${row?.itemName} !`);
            return;
          }

          if (row.serial) {
            const validSerials = row.serials.filter(
              (serial) => serial?.trim() !== "",
            );

            if (validSerials.length !== row.quantity) {
              toast.error(
                `Mismatch in serial and quantity on ${row?.itemName} !`,
              );
              return;
            }
          }
        }
      }

      const data = new FormData();
      data.append(`adjNo`, stateData.adjNo);
      data.append(`type`, stateData.type);
      data.append(`reason`, stateData.reason);
      data.append(`note`, stateData.note);
      data.append(`adjustment_items`, JSON.stringify(stateData.rows));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/inventory/adjustments`,
        {
          method: `POST`,
          body: data,
        },
      );

      if (!res.ok) {
        toast.error(`Adjustment failed !`);
        toast.warning((await res.json()).message);
        return;
      }

      toast.success(`Saved !`);
      // router.push(`/admin/inventory/adjustments`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden flex-col gap-6 md:flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NextInput
            name={`id`}
            label={`Id`}
            placeholder={`000000`}
            disabled={true}
            inputClassName={`bg-red-50`}
          />
          <NextInput
            name={`adjNo`}
            label={`Adjustment No`}
            placeholder={`ADJ0001`}
            value={adjNo}
            onChange={(e) => setHeaderField(`adjNo`, e.target.value)}
          />
          <NextDropdown
            name={`adj_type`}
            label={`Type`}
            className={` sm:col-span-full lg:col-span-1`}
            defaultValue={type}
            onChange={(val) => setHeaderField(`type`, val)}
            items={[
              { value: `GRN`, label: `GRN` },
              { value: `DAMAGE`, label: `DAMAGE` },
              { value: `OPENING_STOCK`, label: `OPENING_STOCK` },
              { value: `MANUAL_FIX`, label: `MANUAL_FIX` },
            ]}
            placeholder={`GRN / OPENING STOCK`}
          />
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <NextInput
              name={`reason`}
              label={`Reason`}
              placeholder={`made a mistake on grn `}
              textarea
              value={reason}
              onChange={(e) => setHeaderField(`reason`, e.target.value)}
            />
            <NextInput
              name={`note`}
              label={`note`}
              placeholder={`type your note`}
              textarea
              value={note}
              onChange={(e) => setHeaderField(`note`, e.target.value)}
            />
          </div>
        </div>
        <Separator title={`Adjustment List`} />

        <AdjRow item_list={items} />

        <Button
          name={pending ? `Processing !` : `Save Adjustment`}
          bg={`bg-green-400 hover:bg-green-500 text-white col-span-full`}
          click={() => {
            handleCrud();
          }}
          disabled={pending}
        />
      </div>
    </div>
  );
};

export default StockAdjustmentForm;
