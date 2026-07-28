import BrandMasterForm from "@/features/inventory/brands/components/BrandMasterForm";
import Table from "@/components/table/Table";
import { load_master_brands } from "@/data/admin/master";

export const dynamic = "force-dynamic";

const MasterBrands = async () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Name",
      data_name: "name",
      className: "",
      data_className: "",
    },
    {
      header: "Date",
      data_name: "date",
      className: "lg:table-cell hidden",
      data_className: "",
    },
  ];
  const data = await load_master_brands();
  return (
    <div>
      <Table
        tablename={`Brands`}
        rows={data}
        colunms={colunms}
        form_props={true}
        report={true}
        form={BrandMasterForm}
        searchkeys={["name"]}
        action={{ view: false, edit: true, delete: true }}
      />
    </div>
  );
};

export default MasterBrands;
