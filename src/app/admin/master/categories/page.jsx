import CategoryMasterForm from "@/components/admin/forms/master/categories/CategoryMasterForm";
import Table from "@/components/common/table/Table";
import React from "react";

async function get_master_category_list() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/admin/master/categories`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log("Error Fetching Brands : ", err);
    return [];
  }
}

const MasterCategories = async () => {
  const data = await get_master_category_list();

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

  return (
    <div>
      <Table
        tablename={`Categories`}
        rows={data}
        colunms={colunms}
        action
        form={CategoryMasterForm}
        form_props={true}
        searchkeys={["name"]}
      />
    </div>
  );
};

export default MasterCategories;
