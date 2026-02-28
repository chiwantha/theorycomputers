import React from "react";
import Button from "../button/Button";
import { Eye, Pencil, Trash } from "lucide-react";

const ActionColumn = ({ setChangeData, setOpen, row }) => {
  return (
    <div className="flex gap-1 justify-center">
      <Button
        name={<Eye size={15} />}
        pd={`px-2 py-2`}
        bg={`bg-green-400 hover:bg-green-600 text-white`}
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
