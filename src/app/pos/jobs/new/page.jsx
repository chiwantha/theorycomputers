import JobForm from "@/features/jobs/components/JobForm";
import {
  get_brands,
  get_categories,
  get_customers,
  get_items,
} from "@/lib/data";
import React from "react";

const page = async () => {
  const customersList = await get_customers();
  const categoriesList = await get_categories();
  const brandsList = await get_brands();
  const itemsList = await get_items();
  return (
    <div className="flex flex-col space-y-4">
      <JobForm
        form_props={{ customersList, categoriesList, brandsList, itemsList }}
      />
    </div>
  );
};

export default page;
