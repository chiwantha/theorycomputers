import React from "react";
import DashCard from "../../cards/dashcard/DashCard";

const DashGrid = () => {
  return (
    <div className="h-50 grid-cols-5 grid gap-4 overflow-x-auto p-4 border-b border-gray-200">
      {Array.from({ length: 5 }).map((_, index) => (
        <DashCard key={index} />
      ))}
    </div>
  );
};

export default DashGrid;
