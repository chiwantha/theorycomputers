import Table from "@/components/common/table/Table";
import { ItemsMasterList } from "@/constant/DummyItemsMaster";
import React from "react";

const MasterItems = () => {
  const colunms = [
    {
      header: "Id",
      data_name: "id",
      className: "",
    },
    {
      header: "Name",
      data_name: "name",
      className: "",
    },
    {
      header: "Category",
      data_name: "category",
      className: "",
    },
    {
      header: "Cost",
      data_name: "cost",
      className: "",
    },
    {
      header: "Selling",
      data_name: "selling",
      className: "",
    },
  ];

  const data = ItemsMasterList;
  return (
    <div className=" flex flex-col ">
      <div className="">Items Mater</div>
      <Table colunms={colunms} rows={data} />
    </div>
  );
};

export default MasterItems;
