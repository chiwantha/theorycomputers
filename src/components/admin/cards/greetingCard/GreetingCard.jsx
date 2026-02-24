"use client";

import Button from "@/components/common/button/Button";
import { Power, User } from "lucide-react";
import Link from "next/link";
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
      <div
        className="rounded-full w-[90%]  items-center justify-center flex  
      aspect-square bg-gray-100 text-blue-600"
      >
        <User size={100} className="animate-pulse" />
      </div>
      <div className="text-center font-light capitalize text-gray-700 flex flex-col -space-y-1">
        <span className="text-sm">{greeting}</span>
        <h2 className="line-clamp-1 text-ellipsis text-xl text-gray-700 font-bold">
          Mr. Chiwantha
        </h2>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Link
          href={`/users/admin`}
          className="aspect-square  rounded-xl bg-gray-100 hover:bg-gray-200
           transition-colors duration-300 p-2 text-gray-600"
        >
          <User />
        </Link>
        <Button
          name={<Power />}
          pd={`p-2`}
          bg={`bg-red-400 hover:bg-red-600 text-white`}
        />
      </div>
    </div>
  );
};

export default GreetingCard;
