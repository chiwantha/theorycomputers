import Table from "@/components/common/table/Table";
import { load_rpt_invoice_list } from "@/data/pos/reports";
import React from "react";

const RptPosInvoice = async () => {
  const colunms = [
    {
      header: "Inv No",
      data_name: "inv_no",
      className: "",
      data_className: "",
    },
    {
      header: "Type",
      data_name: "doc_type",
      className: "lg:table-cell hidden",
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
      className: "",
      data_className: "",
    },
    {
      header: "Item Count",
      data_name: "items_count",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Discount",
      data_name: "discount",
      className: "xl:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: "money",
    },
    {
      header: "Net Total",
      data_name: "net_total",
      className: "",
      data_className: "text-blue-400 font-medium",
      type: `money`,
    },
    {
      header: "Settlement",
      data_name: "settlement",
      className: "sm:table-cell hidden",
      data_className: "text-amber-500 font-medium",
    },
    {
      header: "Issued By",
      data_name: "cashier",
      className: "md:table-cell hidden",
      data_className: "",
    },
  ];
  const data = await load_rpt_invoice_list();
  return (
    <div>
      <Table
        colunms={colunms}
        rows={data}
        action={{ view: true, edit: false, delete: false }}
        searchkeys={[`inv_no`, `settlement`, `customer_phone`, `doc_type`]}
        tablename={`Today Issues`}
        report={true}
      />
    </div>
  );
};

export default RptPosInvoice;
