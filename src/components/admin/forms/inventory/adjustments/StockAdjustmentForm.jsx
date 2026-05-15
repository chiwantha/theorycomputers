"use client";
import AdjRow from "@/components/admin/cards/inputRows/AdjRow";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import Separator from "@/components/common/separator/Separator";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const StockAdjustmentForm = ({ form_props }) => {
  const router = useRouter();
  const { items } = form_props || null;
  const [pending, setPending] = useState(false);

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
            name={`adj_no`}
            label={`Adjustment No`}
            placeholder={`ADJ0001`}
          />
          <NextDropdown
            name={`adj_type`}
            label={`Type`}
            className={` sm:col-span-full lg:col-span-1`}
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
            />
            <NextInput
              name={`note`}
              label={`note`}
              placeholder={`type your note`}
              textarea
            />
          </div>
        </div>
        <Separator title={`Adjustment List`} />

        <AdjRow item_list={items} />
      </div>
    </div>
  );
};

export default StockAdjustmentForm;
