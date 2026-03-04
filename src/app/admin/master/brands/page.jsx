import BrandMasterForm from "@/components/admin/forms/master/brands/BrandMasterForm";
import Table from "@/components/common/table/Table";

export const dynamic = "force-dynamic";

async function get_master_brand_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/master/brands`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Brand List : `, err);
    return [];
  }
}

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
      header: "Created ",
      data_name: "created_at",
      className: "lg:table-cell hidden",
      data_className: "",
    },
  ];
  const data = await get_master_brand_list();
  return (
    <div>
      <Table
        tablename={`Brands`}
        rows={data}
        colunms={colunms}
        action
        form_props={true}
        form={BrandMasterForm}
        searchkeys={["name"]}
      />
    </div>
  );
};

export default MasterBrands;
