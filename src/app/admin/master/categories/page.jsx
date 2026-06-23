import CategoryMasterForm from "@/components/admin/forms/master/categories/CategoryMasterForm";
import Table from "@/components/common/table/Table";
import { load_master_categories } from "@/data/admin/master";

const MasterCategories = async () => {
  const data = await load_master_categories();

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
      header: "Date ",
      data_name: "date",
      className: "lg:table-cell hidden",
      data_className: "",
    },
  ];

  return (
    <div>
      <Table
        tablename={`Categories`}
        rows={data}
        colunms={colunms}
        action={{ view: false, edit: true, delete: true }}
        form={CategoryMasterForm}
        form_props={true}
        searchkeys={["name"]}
      />
    </div>
  );
};

export default MasterCategories;
