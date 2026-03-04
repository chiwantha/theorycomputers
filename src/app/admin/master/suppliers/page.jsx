import SupplierMasterForm from "@/components/admin/forms/master/suppliers/SupplierMasterForm";
import Table from "@/components/common/table/Table";

export const dynamic = "force-dynamic";

async function get_supplier_masater_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/master/suppliers`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Suppliers ! : `, err);
    return [];
  }
}

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
  const data = await get_supplier_masater_list();
  return (
    <div>
      <Table
        tablename={`Suppliers`}
        colunms={colunms}
        rows={data}
        form={SupplierMasterForm}
        form_props={true}
        action
        searchkeys={["phone", "agent", "name", "email", `whatsapp`]}
      />
    </div>
  );
};

export default MasterSuppliers;
