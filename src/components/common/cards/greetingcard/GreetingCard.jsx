"use client";

import Button from "@/components/common/button/Button";
import { Crown, Power, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const GreetingCard = ({ user }) => {
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
    <div className="border-b border-gray-200 px-4 pb-2 pt-6 flex flex-col space-y-4 justify-center items-center">
      <div
        className="rounded-full w-[60%]  items-center justify-center flex  
      aspect-square bg-gray-100 text-blue-600 relative"
      >
        <User size={80} className="animate-pulse" />
        {user?.role == 1 && (
          <div className="absolute z-50 bg-amber-500 top-0 right-0 p-1.5 rounded-xl">
            <Crown color="white" size={20} />
          </div>
        )}
      </div>
      <div className="text-center font-light capitalize text-gray-700 flex flex-col -space-y-1">
        <span className="text-sm">{greeting}</span>
        <h2 className="line-clamp-1 uppercase text-ellipsis text-xl text-gray-700 font-bold">
          Mr. {user?.name.split(" ")[1]}
        </h2>
      </div>
      <div className="items-center justify-center gap-2 hidden">
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
