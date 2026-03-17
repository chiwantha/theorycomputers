"use client";

import { Crown, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const GreetingCard = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("STATUS:", status);
    console.log("SESSION:", session);
  }, [session, status]);

  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour >= 5 && hour < 12) greeting = "Good Morning";
  else if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className="border-b border-gray-200 px-4 py-6 flex flex-col space-y-4 justify-center items-center">
      <div className="rounded-full w-[60%] items-center justify-center flex aspect-square bg-gray-100 text-blue-600 relative">
        <User size={80} className="animate-pulse" />
        {session?.user?.role === 1 && (
          <div className="absolute z-50 bg-amber-500 top-0 right-0 p-1.5 rounded-xl">
            <Crown color="white" size={20} />
          </div>
        )}
      </div>
      <div className="text-center font-light capitalize text-gray-700 flex flex-col -space-y-1">
        <span className="text-sm">{greeting}</span>
        <h2 className="line-clamp-1 uppercase text-ellipsis text-xl text-gray-700 font-bold">
          {session?.user?.name ? session.user.name.split(" ")[1] : "Guest"}
        </h2>
      </div>
    </div>
  );
};

export default GreetingCard;
