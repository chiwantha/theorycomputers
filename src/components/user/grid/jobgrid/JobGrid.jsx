import React from "react";
import JobCard from "../../cards/jobcard/JobCard";
import { DummyJobList } from "@/constant/DummyJobs";

const JobGrid = () => {
  const data = DummyJobList;
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4 md:p-6">
      <JobCard add={true} />
      {data.map((card, index) => (
        <JobCard
          key={index}
          id={card.id}
          device={{ id: card.device_id, name: card.device_name }}
          customer_name={card.customer_name}
          phone={card.phone}
          state={card.state}
          created_at={card.created_at}
        />
      ))}
    </div>
  );
};

export default JobGrid;
