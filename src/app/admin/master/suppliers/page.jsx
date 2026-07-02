import SupplierMasterForm from "@/components/admin/forms/master/suppliers/SupplierMasterForm";
import Table from "@/components/common/table/Table";
import { load_master_suppliers } from "@/data/admin/master";

export const dynamic = "force-dynamic";

const MasterSuppliers = async () => {
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
      header: "Agent",
      data_name: "agent",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Phone",
      data_name: "phone",
      className: "",
      data_className: "",
    },
    {
      header: "WhatsApp",
      data_name: "whatsapp",
      className: "md:table-cell hidden",
      data_className: "",
    },
    {
      header: "Email",
      data_name: "email",
      className: "lg:table-cell hidden",
      data_className: "",
    },
    {
      header: "Address ",
      data_name: "address",
      className: "xl:table-cell hidden",
      data_className: "",
    },
  ];
  const data = await load_master_suppliers();
  return (
    <div>
      <Table
        tablename={`Suppliers`}
        colunms={colunms}
        rowsPerPage={15}
        rows={data}
        form={SupplierMasterForm}
        form_props={true}
        action={{ view: false, edit: true, delete: true }}
        searchkeys={["phone", "agent", "name", "email", `whatsapp`]}
      />
    </div>
  );
};

export default MasterSuppliers;
