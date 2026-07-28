import StockAdjustmentForm from "@/features/inventory/adjustment/components/StockAdjustmentForm";
import { get_items } from "@/lib/data";
import React from "react";

const NewAdjustmentPage = async () => {
  const items = await get_items();
  return (
    <div className="flex flex-col space-y-4">
      {/* <BreadCrumb /> */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <StockAdjustmentForm form_props={{ items }} />
      </div>
    </div>
  );
};

export default NewAdjustmentPage;
