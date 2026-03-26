import Table from "@/components/common/table/Table";
import InvoiceForm from "@/components/pos/forms/business/invoice/InvoiceForm";
import React from "react";

const PosInvoicePage = () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Inv_No",
      data_name: "inv_no",
      className: "",
      data_className: "",
    },
    {
      header: "Customer",
      data_name: "customer_name",
      className: "sm:table-cell hidden",
      data_className: "",
    },
    {
      header: "Contact",
      data_name: "customer_phone",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Date",
      data_name: "date",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Amount",
      data_name: "amount",
      className: "sm:table-cell hidden",
      data_className: "",
    },
  ];

  const data = [];
  return (
    <div>
      <Table
        tablename={`Invoices`}
        colunms={colunms}
        rows={data}
        action={{
          delete: false,
          edit: false,
          view: true,
        }}
        searchkeys={["customer_phone", `customer_name`, `date`]}
        form_props={true}
        form={InvoiceForm}
      />
    </div>
  );
};

export default PosInvoicePage;
