"use client";

import Button from "../../button/Button";

const DeleteData = ({ defaultData, table, explicit }) => {
  const handleDelete = async () => {};

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="capitalize text-gray-600">
        Do You Really Want to Delete{" "}
        <span className="font-bold text-gray-700">
          {defaultData?.row?.name}
        </span>{" "}
        From Item Master
      </span>
      <Button
        click={() => handleDelete()}
        name={`Delete`}
        bg={`bg-red-600 hover:bg-red-700 text-white`}
      />
    </div>
  );
};

export default DeleteData;
