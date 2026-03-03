import React from "react";

const FormHeader = ({ defaultData, title }) => {
  return (
    <div>
      <span className="font-black text-2xl uppercase text-gray-700">
        {!defaultData && `New ${title || `+`}`}

        {defaultData?.type === "edit" && (
          <span className="line-clamp-1 text-ellipsis">
            <span className="text-blue-500">Edit </span>
            <span>{defaultData?.row.name}</span>
          </span>
        )}

        {defaultData?.type === "delete" && (
          <span className="text-red-600">Delete {defaultData?.row.id}?</span>
        )}
      </span>
    </div>
  );
};

export default FormHeader;
