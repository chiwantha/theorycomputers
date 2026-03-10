import React from "react";
import JobCard from "../../cards/jobcard/JobCard";

const JobGrid = () => {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 p-4 md:p-6">
      <JobCard add={true} />
      {Array.from({ length: 10 }).map((_, index) => (
        <JobCard key={index} />
      ))}
    </div>
  );
};

export default JobGrid;
