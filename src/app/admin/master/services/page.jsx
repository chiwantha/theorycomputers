import ServiceMasterForm from "@/components/admin/forms/master/services/ServiceMasterForm";
import Table from "@/components/common/table/Table";
import { load_master_services } from "@/data/admin/master";
import { get_brands, get_categories, get_warranties } from "@/lib/data";

export const dynamic = "force-dynamic";

const MasterServices = async () => {
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

  const data = await load_master_services();
  const search = ["name", "category"];

  return (
    <div className=" flex flex-col gap-4 ">
      <Table
        colunms={colunms}
        rows={data}
        searchkeys={search}
        rowsPerPage={15}
        tablename={`Service Master`}
        form={ServiceMasterForm}
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

export default MasterServices;
