import SerialsInventoryForm from "@/components/admin/forms/inventory/serials/SerialsInventoryForm";
import Table from "@/components/common/table/Table";
import { load_inventory_serials } from "@/data/inventory";

const InventorySerials = async () => {
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
      header: "Serial",
      data_name: "serial",
      className: "",
      data_className: "text-blue-400 font-medium",
    },
    {
      header: "Availability",
      data_name: "stock_status",
      className: "lg:table-cell hidden",
      data_className: "",
    },
  ];

  const data = await load_inventory_serials();
  return (
    <div>
      <Table
        colunms={colunms}
        rows={data}
        form={SerialsInventoryForm}
        form_props={true}
        searchkeys={[`serial`, `name`, `stock_status`]}
        action={{ view: false, edit: true, delete: false }}
        tablename={`Stock Serials`}
      />
    </div>
  );
};

export default InventorySerials;
