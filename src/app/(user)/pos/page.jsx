import DashGrid from "@/components/user/grid/dashgrid/DashGrid";
import JobGrid from "@/components/user/grid/jobgrid/JobGrid";
import React from "react";

const Pos = () => {
  return (
    <div className="flex-col flex h-screen">
      {/* Top Cards */}
      <DashGrid />

      {/* Content */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto">
          <JobGrid />
        </div>

        {/* Right Cart Panel */}
        <div className="w-80 bg-blue-400"></div>
      </div>
    </div>
  );
};

export default Pos;
