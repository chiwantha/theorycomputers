import React from "react";
import JobCard from "../../cards/jobcard/JobCard";
import { DummyJobList } from "@/constant/DummyJobs";

const JobGrid = ({ gridName }) => {
  const data = DummyJobList;
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* 🔍 Search */}
      <div className="flex justify-between items-center sm:flex-row flex-col ">
        <h2 className="text-xl font-semibold text-gray-700 px-2 sm:block hidden">
          {gridName || "View Your Jobs"}
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Search Jobs ...`}
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-56 md:w-70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ">
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
    </div>
  );
};

export default JobGrid;
