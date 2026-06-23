import ItemMasterForm from "@/components/admin/forms/master/items/ItemMasterForm";
import Table from "@/components/common/table/Table";
import { load_master_items } from "@/data/admin/master";
import { get_brands, get_categories, get_warranties } from "@/lib/data";

const MasterItems = async () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Code",
      data_name: "code",
      className: "sm:table-cell hidden",
      data_className: "",
    },
    {
      header: "Name",
      data_name: "name",
      className: "",
      data_className: "",
    },
    {
      header: "Category",
      data_name: "category",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Warranty",
      data_name: "warranty_name",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Cost",
      data_name: "cost",
      className: "md:table-cell hidden",
      data_className: "",
      type: `money`,
    },
    {
      header: "Selling",
      data_name: "selling",
      className: "md:table-cell hidden",
      data_className: "text-blue-400 font-medium",
      type: `money`,
    },
  ];

  const dropdowns = {
    categories: await get_categories(),
    brands: await get_brands(),
    warrantyList: await get_warranties(),
  };

  const data = await load_master_items();
  const search = ["name", "category"];

  return (
    <div className=" flex flex-col gap-4 ">
      <Table
        colunms={colunms}
        rows={data}
        searchkeys={search}
        tablename={`Item Master`}
        form={ItemMasterForm}
        form_props={{
          category_list: dropdowns?.categories || [],
          brand_list: dropdowns?.brands || [],
          warranty_list: dropdowns?.warrantyList || [],
        }}
        action={{ view: false, edit: true, delete: true }}
      />
    </div>
  );
};

export default MasterItems;
