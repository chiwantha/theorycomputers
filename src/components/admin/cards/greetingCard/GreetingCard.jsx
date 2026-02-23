"use client";

import { User } from "lucide-react";
import React from "react";

const GreetingCard = () => {
  // Get current hour
  const hour = new Date().getHours();

  // Determine greeting
  let greeting = "Hello";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="rounded-xl px-4 py-6 bg-white border-blue-200 border shadow-lg flex flex-col space-y-4 justify-center items-center">
      <div className="rounded-full w-[90%]  items-center justify-center flex  aspect-square bg-gray-200">
        <User size={100} />
      </div>
      <div className="text-center font-light uppercase text-gray-700 flex flex-col -space-y-1">
        <span className="text-sm">{greeting}</span>
        <h2 className="line-clamp-1 text-ellipsis text-xl uppercase text-gray-700 font-bold">
          Mr. Chiwantha
        </h2>
      </div>
      {/* <div className=""></div> */}
    </div>
  );
};

export default GreetingCard;
