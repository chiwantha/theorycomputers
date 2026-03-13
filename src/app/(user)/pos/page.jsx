import DashGrid from "@/components/user/grid/dashgrid/DashGrid";
import JobGrid from "@/components/user/grid/jobgrid/JobGrid";
import React from "react";

const PosPage = () => {
  return (
    <div className="bg-red-400 min-h-[calc(100vh-60px)] p-4 space-y-4">
      <DashGrid />
      <JobGrid />
    </div>
  );
};

export default PosPage;
