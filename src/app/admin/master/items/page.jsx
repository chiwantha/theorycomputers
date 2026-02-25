"use client";
import ItemMasterForm from "@/components/admin/forms/master/items/ItemMasterForm";
import Drawer from "@/components/common/drawer/Drawer";
import Table from "@/components/common/table/Table";

import { ItemsMasterList } from "@/constant/DummyItemsMaster";

import { BrandMasterList } from "@/constant/DummyBrandMaster";

const MasterItems = () => {
  const frameworks = BrandMasterList.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
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
      className: "",
      data_className: "text-blue-400 font-medium",
    },
  ];

  const search = ["name", "category"];

  const data = ItemsMasterList;
  return (
    <div className=" flex flex-col gap-4">
      <div className="">
        <Drawer form={<ItemMasterForm />} />
      </div>
      <Table
        colunms={colunms}
        rows={data}
        searchkeys={search}
        tablename={`Item Master`}
      />
    </div>
  );
};

export default MasterItems;
