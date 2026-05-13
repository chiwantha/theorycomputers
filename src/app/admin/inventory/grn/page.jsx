import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import Button from "@/components/common/button/Button";
import Table from "@/components/common/table/Table";

export const dynamic = "force-dynamic";

async function get_grn_inventory_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/inventory/grn`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Grn Inventory List : `, err);
    return [];
  }
}

const InventoryGoodReceiveNote = async () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "No",
      data_name: "grn_no",
      className: "",
      data_className: "",
    },
    {
      header: "Supplier",
      data_name: "supplier_name",
      className: "",
      data_className: "",
    },
    {
      header: "Invoice No",
      data_name: "invoice_no",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Item Count",
      data_name: "item_count",
      className: "sm:table-cell hidden",
      data_className: "",
    },
    {
      header: "Total",
      data_name: "total",
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
  const data = await get_grn_inventory_list();
  return (
    <div className="flex flex-col space-y-4">
      <div className="justify-between flex items-center">
        <BreadCrumb />
        <Button
          link={`/admin/inventory/grn/new`}
          bg={`bg-green-500 hover:bg-green-600 text-white`}
          name={`New Grn`}
        />
      </div>
      <Table
        colunms={colunms}
        tablename={`Grn List`}
        rows={data}
        action={{ view: true, edit: false, delete: false }}
        searchkeys={[`grn_no`, `supplier_name`, `date`]}
      />
    </div>
  );
};

export default InventoryGoodReceiveNote;
