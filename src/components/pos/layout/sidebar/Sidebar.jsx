"use client";
import GreetingCard from "@/components/common/cards/greetingcard/GreetingCard";
import SidebarItem from "@/components/admin/layout/sidebar/sidebarItem/SidebarItem";
import { useSidebar } from "@/context/SidebarContext";
import { BadgeDollarSign, Hammer, Menu, ReceiptEuro, User } from "lucide-react";
import { useState } from "react";
import Button from "@/components/common/button/Button";
import { signOut, useSession } from "next-auth/react";

const paths = [
  {
    name: `Dashboard`,
    path: `/pos/`,
    icon: <Menu size={20} />,
  },
  {
    name: `Business`,
    icon: <BadgeDollarSign size={20} />,
    sub: [
      {
        name: `Jobs`,
        path: `/pos/jobs`,
        icon: <Hammer size={20} />,
      },
      {
        name: `Invoice`,
        path: `/pos/jobs`,
        icon: <ReceiptEuro size={20} />,
      },
    ],
  },
];

const Sidebar = () => {
  const { data, status } = useSession();
  const { isSidebarOpen } = useSidebar();

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div
      className={`w-70 p-4 overflow-y-auto border-r shadow-sm border-gray-100
      md:translate-x-0 fixed md:relative top-0 left-0 h-full z-51
      transform transition-transform duration-300 bg-white flex flex-col gap-4
      ${isSidebarOpen ? "translate-x-0 xs:-translate-x-full" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="flex flex-col gap-2">
        <GreetingCard />
        {data?.user?.role === 1 && (
          <SidebarItem icon={<User />} path={`/admin`} name={`Admin`} />
        )}
        {paths.map((path, index) => (
          <SidebarItem
            key={index}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
            {...path}
          />
        ))}
        <Button
          name={`Logout`}
          wfull={true}
          click={() => signOut({ callbackUrl: `/auth/usr-login` })}
        />
      </div>
    </div>
  );
};

export default Sidebar;
