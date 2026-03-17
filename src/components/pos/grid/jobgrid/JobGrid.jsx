"use client";
import React, { useState } from "react";
import JobCard from "../../cards/jobcard/JobCard";
import { DummyJobList } from "@/constant/DummyJobs";

const JobGrid = ({ gridName, grid }) => {
  const [search, setSearch] = useState("");
  const data = DummyJobList;

  const filteredJobs = data.filter((job) =>
    `${job.customer_name} ${job.device_name} ${job.phone} `
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4 ">
      {/* Search */}
      <div className="flex justify-between items-center sm:flex-row flex-col">
        <h2 className="text-xl font-semibold text-gray-700 px-2 sm:block hidden">
          {gridName || "Your Jobs"}
        </h2>

        <input
          type="text"
          placeholder="Search Jobs ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-56 md:w-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 ${grid ? grid : ` grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 `}`}
      >
        <JobCard add={true} />

        {filteredJobs.length > 0 ? (
          filteredJobs.map((card, index) => (
            <JobCard
              key={index}
              id={card.id}
              device={{ id: card.device_id, name: card.device_name }}
              customer_name={card.customer_name}
              phone={card.phone}
              state={card.state}
              created_at={card.created_at}
            />
          ))
        ) : (
          <span className="col-span-full text-center text-gray-500 py-10">
            No jobs yet
          </span>
        )}
      </div>
    </div>
  );
};

export default JobGrid;
