import GrnInventoryForm from "@/features/inventory/grn/components/GrnInventoryForm";
import { get_items, get_suppliers } from "@/lib/data";
import React from "react";

const NewGrnPage = async () => {
  const suppliers = await get_suppliers();
  const items = await get_items();
  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <GrnInventoryForm form_props={{ suppliers, items }} />
      </div>
    </div>
  );
};

export default NewGrnPage;
