import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import Button from "@/components/common/button/Button";
import Table from "@/components/common/table/Table";
import { load_inventory_grns } from "@/data/admin/inventory";

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
  const data = await load_inventory_grns();
  return (
    <div className="flex flex-col">
      <div className="justify-between flex items-center">
        {/* <BreadCrumb /> */}
        {/* <Button
          link={`/admin/inventory/grn/new`}
          bg={`bg-green-500 hover:bg-green-600 text-white`}
          name={`New Grn`}
        /> */}
      </div>
      <Table
        colunms={colunms}
        tablename={`Grn List`}
        rows={data}
        newButtonLink={{
          link: `/admin/inventory/grn/new`,
          name: `New Grn`,
        }}
        action={{ view: true, edit: false, delete: false }}
        searchkeys={[`grn_no`, `supplier_name`, `date`]}
      />
    </div>
  );
};

export default InventoryGoodReceiveNote;
