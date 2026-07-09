import Table from "@/components/common/table/Table";
import React from "react";

const RptPosInvoice = () => {
  const colunms = [
    {
      header: "Inv No",
      data_name: "inv_no",
      className: "",
      data_className: "",
    },
    {
      header: "Customer",
      data_name: "customer_name",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Phone",
      data_name: "customer_phone",
      className: "",
      data_className: "",
    },
    {
      header: "Item Count",
      data_name: "cost",
      className: "md:table-cell hidden",
      data_className: "",
      type: `money`,
    },
    {
      header: "Stock",
      data_name: "quantity",
      className: "",
      data_className: "text-blue-400 font-medium",
    },
    {
      header: "Stock Avg Worth",
      data_name: "stock_average_worth",
      className: "md:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: `money`,
    },
  ];
  const data = [];
  return (
    <div>
      <Table
        colunms={colunms}
        rows={data}
        searchkeys={[`stock`, `name`]}
        tablename={`Stock View`}
        report={true}
      />
    </div>
  );
};

export default RptPosInvoice;
