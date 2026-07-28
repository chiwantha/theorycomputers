import Table from "@/components/table/Table";
import { load_rpt_job_list } from "@/data/common/reports";
import React from "react";

const RptAdminJobs = async () => {
  const colunms = [
    {
      header: "Job No",
      data_name: "job_no",
      className: "",
      data_className: "",
    },
    {
      header: "Customer",
      data_name: "customer_name",
      className: "xl:table-cell hidden",
      data_className: "",
    },
    {
      header: "Customer Phone",
      data_name: "customer_phone",
      className: "sm:table-cell hidden",
      data_className: "",
    },
    {
      header: "Warranty Job",
      data_name: "warranty",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Brand & Category",
      data_name: "brand_cat",
      className: "xl:table-cell hidden",
      data_className: "text-blue-400 font-medium",
    },
    {
      header: "Net Total",
      data_name: "net",
      className: "sm:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: `money`,
    },
    {
      header: "Serial No",
      data_name: "serial",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "State",
      data_name: "state",
      className: "",
      data_className: "font-bold text-gray-600",
    },
  ];
  const data = await load_rpt_job_list();
  return (
    <div>
      <Table
        colunms={colunms}
        rows={data}
        action={{ view: true, edit: false, delete: false }}
        searchkeys={[`job_no`, `brand_cat`, `customer_phone`, `state`]}
        tablename={`Today Issues`}
        report={true}
        push_link={`/pos/jobs`}
      />
    </div>
  );
};

export default RptAdminJobs;
