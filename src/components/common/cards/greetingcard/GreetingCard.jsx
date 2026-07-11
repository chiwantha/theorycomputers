"use client";

import { Crown, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const GreetingCard = () => {
  const path = usePathname();
  const router = useRouter();
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

        {session?.user?.role === 1 && (
          <div className="grid rounded-xl bg-gray-100 grid-cols-2 mt-4 font-medium">
            <button
              disabled={path.split("/")[1] === `Pos`}
              className={`${path.split("/")[1] === `pos` ? ` bg-blue-500 text-white` : `bg-transparent text-gray-600 hover:bg-gray-200 cursor-pointer`} py-1 px-4 rounded-lg`}
              onClick={() => router.push(`/pos`)}
            >
              Pos
            </button>
            <button
              disabled={path.split("/")[1] === `Admin`}
              className={`${path.split("/")[1] === `admin` ? `bg-blue-500 text-white` : `bg-transparent text-gray-600 hover:bg-gray-200  cursor-pointer`} py-1 px-4 rounded-lg `}
              onClick={() => router.push(`/admin`)}
            >
              Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingCard;
