import React from "react";

const Separator = ({ title }) => {
  return (
    <div className="flex gap-4 items-center col-span-full">
      {title && (
        <span className="text-nowrap text-sm text-gray-600">{title}</span>
      )}
      <hr className="border-gray-200 w-full col-span-full my-2" />
    </div>
  );
};

export default Separator;
