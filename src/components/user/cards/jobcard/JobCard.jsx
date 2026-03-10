import { Plus } from "lucide-react";
import React from "react";

const JobCard = ({ add, details }) => {
  return (
    <div
      className={`min-h-45 p-4 md:p-6 bg-gray-50 rounded-xl  border-gray-200 hover:border-blue-300 transition-all duration-300 flex
        ${add ? `justify-center items-center border-6 border-dashed text-blue-400` : `justify-between items-center border`}`}
    >
      {add ? (
        <div className="">
          <Plus size={60} />
        </div>
      ) : (
        <div className="">Details</div>
      )}
    </div>
  );
};

export default JobCard;
