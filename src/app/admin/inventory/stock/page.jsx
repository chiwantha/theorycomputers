import Table from "@/components/common/table/Table";

export const dynamic = "force-dynamic";

async function get_stock_inventory_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/inventory/stock`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Stock Inventory List : `, err);
    return [];
  }
}
const InventoryStock = async () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Item Id",
      data_name: "item_id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Item Name",
      data_name: "name",
      className: "",
      data_className: "",
    },
    {
      header: "Unit Cost",
      data_name: "cost",
      className: "md:table-cell hidden",
      data_className: "",
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
    },
  ];
  const data = await get_stock_inventory_list();
  return (
    <div>
      <Table
        colunms={colunms}
        rows={data}
        searchkeys={[`stock`, `name`]}
        tablename={`Stock View`}
      />
    </div>
  );
};

export default InventoryStock;
