"use client";
import React from "react";
import Button from "../button/Button";
import { Eye, Pencil, Trash } from "lucide-react";
import { usePathname } from "next/navigation";

const ActionColumn = ({ setChangeData, setOpen, row, action }) => {
  const pathname = usePathname();
  const actions =
    typeof action === "object"
      ? action
      : { view: true, edit: true, delete: true };

  return (
    <div className="flex gap-1 justify-start">
      <Button
        name={<Eye size={15} />}
        pd={`px-2 py-2`}
        bg={`bg-green-500 hover:bg-green-600 text-white`}
        link={`${pathname}/${row.id}`}
        prefetch={true}
        disabled={!actions.view}
      />
      <Button
        name={<Pencil size={15} />}
        pd={`px-2 py-2`}
        click={() => {
          setChangeData({ type: `edit`, row_id: row.id, row: row });
          setOpen(true);
        }}
        disabled={!actions.edit}
      />
      <Button
        name={<Trash size={15} />}
        pd={`px-2 py-2`}
        bg={`bg-red-400 hover:bg-red-600 text-white`}
        click={() => {
          setChangeData({ type: `delete`, row_id: row.id, row: row });
          setOpen(true);
        }}
        disabled={!actions.delete}
      />
    </div>
  );
};

export default ActionColumn;
