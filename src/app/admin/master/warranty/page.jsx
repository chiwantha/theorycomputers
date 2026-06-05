import WarrantyMasterForm from "@/components/admin/forms/master/warranty/WarrantyMasterForm";
import Table from "@/components/common/table/Table";

export const dynamic = "force-dynamic";

async function get_warranty_masater_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/master/warranty`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Warranty ! : `, err);
    return [];
  }
}

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
  const data = await get_warranty_masater_list();
  return (
    <div>
      <Table
        tablename={`Warranty`}
        colunms={colunms}
        rows={data}
        form={WarrantyMasterForm}
        form_props={true}
        action
        searchkeys={["name", "type", "duration"]}
      />
    </div>
  );
};

export default MasterWarranty;
