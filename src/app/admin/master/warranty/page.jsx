import WarrantyMasterForm from "@/components/admin/forms/master/warranty/WarrantyMasterForm";
import Table from "@/components/common/table/Table";
import { load_master_warranties } from "@/data/admin/master";

const MasterWarranty = async () => {
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
      header: "Type",
      data_name: "type",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Duration / Mo",
      data_name: "duration",
      className: "",
      data_className: "",
    },
  ];
  const data = await load_master_warranties();
  return (
    <div>
      <Table
        tablename={`Warranty`}
        colunms={colunms}
        rows={data}
        form={WarrantyMasterForm}
        form_props={true}
        action={{ view: false, edit: true, delete: true }}
        searchkeys={["name", "type", "duration"]}
      />
    </div>
  );
};

export default MasterWarranty;
