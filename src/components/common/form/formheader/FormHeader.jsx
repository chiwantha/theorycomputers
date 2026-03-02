import React from "react";

const FormHeader = ({ defaultData, title }) => {
  return (
    <div>
      <span className="font-black text-2xl uppercase text-gray-700">
        {!defaultData && `New ${title || `+`}`}

        {defaultData?.type === "edit" && `Edit ${defaultData?.row.id}`}

        {defaultData?.type === "delete" && (
          <span className="text-red-600">Delete {defaultData?.row.id}?</span>
        )}
      </span>
    </div>
  );
};

export default FormHeader;
