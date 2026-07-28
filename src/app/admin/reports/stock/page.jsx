import Table from "@/components/table/Table";
import { load_rpt_stock } from "@/data/common/reports";

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
      header: "Stock Level",
      data_name: "stock_level",
      className: "",
      data_className: "",
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
        searchkeys={[`stock`, `name`, `stock_level`]}
        tablename={`Stock View`}
        report={true}
      />
    </div>
  );
};

export default InventoryStock;
