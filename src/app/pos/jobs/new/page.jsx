import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import JobForm from "@/components/pos/forms/jobs/JobForm";
import { get_brands, get_categories, get_customers } from "@/lib/data";
import React from "react";

const page = async () => {
  const customersList = await get_customers();
  const categoriesList = await get_categories();
  const brandsList = await get_brands();
  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <JobForm form_props={{ customersList, categoriesList, brandsList }} />
    </div>
  );
};

export default page;
