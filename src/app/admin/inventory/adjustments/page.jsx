import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import Button from "@/components/common/button/Button";
import Table from "@/components/common/table/Table";
import React from "react";

export const dynamic = "force-dynamic";

async function get_inventory_adj_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/inventory/adjustments`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Inventory Adjustments List : `, err);
    return [];
  }
}

const StockAdjustmentsPage = async () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "No",
      data_name: "adj_no",
      className: "",
      data_className: "",
    },
    {
      header: "Type",
      data_name: "type",
      className: "",
      data_className: "",
    },
    {
      header: "Item Count",
      data_name: "item_count",
      className: "sm:table-cell hidden",
      data_className: "",
    },
    {
      header: "Total +",
      data_name: "totalP",
      className: "sm:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: "money",
    },
    {
      header: "Total -",
      data_name: "totalM",
      className: "sm:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: "money",
    },
    {
      header: "Date",
      data_name: "date",
      className: "md:table-cell hidden",
      data_className: "",
    },
  ];

  const data = await get_inventory_adj_list();
  return (
    <div className="flex flex-col space-y-4">
      <div className="justify-between flex items-center">
        <BreadCrumb />
        <Button
          link={`/admin/inventory/adjustments/new`}
          bg={`bg-green-500 hover:bg-green-600 text-white`}
          name={`New Adjustment`}
        />
      </div>
      <Table
        colunms={colunms}
        tablename={`Adjustment Logs`}
        rows={data}
        action={{ view: true, edit: false, delete: false }}
        searchkeys={[`adj_no`, `type`, `date`]}
      />
    </div>
  );
};

export default StockAdjustmentsPage;
