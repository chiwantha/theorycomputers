import OrderForm from "@/features/orders/components/OrderForm";
import {
  get_brands,
  get_categories,
  get_customers,
  get_items,
  get_warranties,
} from "@/lib/data";
import React from "react";

const page = async () => {
  const customersList = await get_customers();
  const categoriesList = await get_categories();
  const brandsList = await get_brands();
  const itemsList = await get_items();
  const warrantyList = await get_warranties();
  return (
    <div className="flex flex-col space-y-4">
      <OrderForm
        form_props={{
          customersList,
          categoriesList,
          brandsList,
          itemsList,
          warrantyList,
        }}
      />
    </div>
  );
};

export default page;
