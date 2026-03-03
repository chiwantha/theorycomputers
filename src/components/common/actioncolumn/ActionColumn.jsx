"use client";
import React from "react";
import Button from "../button/Button";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";

async function set_deactive(route, id) {}

const ActionColumn = ({ setChangeData, setOpen, row, route }) => {
  return (
    <div className="flex gap-1 justify-start">
      <Button
        name={<Eye size={15} />}
        pd={`px-2 py-2`}
        bg={`bg-green-500 hover:bg-green-600 text-white`}
        link={`/admin/master/items/${row.id}`}
      />
      <Button
        name={<Pencil size={15} />}
        pd={`px-2 py-2`}
        click={() => {
          setChangeData({ type: `edit`, row_id: row.id, row: row });
          setOpen(true);
        }}
      />
      <Button
        name={<Trash size={15} />}
        pd={`px-2 py-2`}
        bg={`bg-red-400 hover:bg-red-600 text-white`}
        click={() => {
          setChangeData({ type: `delete`, row_id: row.id, row: row });
          setOpen(true);
        }}
      />
    </div>
  );
};

export default ActionColumn;
