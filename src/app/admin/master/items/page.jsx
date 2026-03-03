import ItemMasterForm from "@/components/admin/forms/master/items/ItemMasterForm";
import Table from "@/components/common/table/Table";
import { get_brands, get_categories } from "@/lib/data";

export const dynamic = "force-dynamic";

async function get_master_items_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/master/items`,
    );
    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log("Error Fetching The Item Master : ", err);
    return [];
  }
}

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
      header: "Cost",
      data_name: "cost",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Selling",
      data_name: "selling",
      className: "md:table-cell hidden",
      data_className: "text-blue-400 font-medium",
    },
  ];

  const dropdowns = {
    categories: await get_categories(),
    brands: await get_brands(),
  };
  const data = await get_master_items_list();
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
        }}
        action
      />
    </div>
  );
};

export default MasterItems;
