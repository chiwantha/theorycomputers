"use client";
import ItemMasterForm from "@/components/admin/forms/master/items/ItemMasterForm";
import Drawer from "@/components/common/drawer/Drawer";
import Table from "@/components/common/table/Table";
import ActionColumn from "@/components/common/actioncolumn/ActionColumn";
import { ItemsMasterList } from "@/constant/DummyItemsMaster";
import { useState } from "react";

const MasterItems = () => {
  const [open, setOpen] = useState(false);
  const [changeData, setChangeData] = useState(null);

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
    {
      header: "Actions",
      data_name: "actions",
      className: "text-center",
      render: (row) => (
        <ActionColumn
          row={row}
          setChangeData={setChangeData}
          setOpen={setOpen}
        />
      ),
    },
  ];

  const search = ["name", "category"];

  const data = ItemsMasterList;
  return (
    <div className=" flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Drawer
          form={<ItemMasterForm defaultData={changeData} />}
          callback={() => {
            setChangeData(null);
          }}
          open={open}
          setOpen={setOpen}
        />
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
