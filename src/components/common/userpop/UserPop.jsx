"use client";
import { User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Button from "../button/Button";
import GreetingCard from "../cards/greetingcard/GreetingCard";

const UserPop = () => {
  const [isOpen, setisOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setisOpen((prev) => !prev)}
        className="rounded-xl p-2 bg-gray-200 text-blue-600 hover:bg-gray-300 transition-colors duration-300"
      >
        <User />
      </button>

      <div
        className={`absolute top-15 right-0 w-75 bg-white border border-gray-300 shadow-lg rounded-xl origin-top-right
        transition-all duration-300 ease-in-out overflow-hidden  flex flex-col justify-between items-center
        ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto p-4"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none p-0"
        }`}
      >
        <div className="w-full">
          <GreetingCard />
        </div>

        <Button
          name={`Logout`}
          wfull={true}
          click={() => signOut({ callbackUrl: `/auth/usr-login` })}
          bg={`bg-red-400 hover:bg-red-600 text-white`}
          rounded={`rounded-lg`}
        />
      </div>
    </div>
  );
};

export default UserPop;
