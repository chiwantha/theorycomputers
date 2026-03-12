import DashGrid from "@/components/user/grid/dashgrid/DashGrid";
import JobGrid from "@/components/user/grid/jobgrid/JobGrid";
import React from "react";

const Pos = () => {
  return (
    <div className="flex-col flex gap-4">
      {/* Top Cards */}
      <DashGrid />

      {/* Content */}
      <div className=" flex-1 ">
        {/* Grid Area */}
        <div className="">
          <JobGrid />
        </div>
      </div>
    </div>
  );
};

export default Pos;
