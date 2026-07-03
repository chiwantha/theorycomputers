import Table from "@/components/common/table/Table";
import { load_rpt_stock } from "@/data/admin/reports";

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
  const data = await load_rpt_stock();
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
