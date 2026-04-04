"use client";
import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { getTimeSince } from "@/lib/utils";
import { Phone, Plus, User } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

const JobCard = ({ add, id, customer_name, phone, state, created_at }) => {
  return (
    <div
      className={`min-h-50 p-4 md:p-6 bg-gray-50 rounded-xl  border-gray-200 hover:border-blue-300 transition-all duration-300 flex
        ${add ? `justify-center items-center border-6 border-dashed text-blue-400` : ` border`}`}
    >
      {add ? (
        <div
          className=""
          onClick={() => {
            toast.warning(`Transation Bloked !`);
          }}
        >
          <Plus size={60} />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between">
            <span className="text-blue-500 font-bold tracking-tighter text-xl">
              JOB #{id}
            </span>
            {state == 0 ? (
              <span className="px-4 pt-0.5 pb-1 text-white bg-red-400 rounded-xl animate-pulse">
                Pending
              </span>
            ) : (
              <span className="px-4 pt-0.5 pb-1 text-white bg-green-400 rounded-xl ">
                Completed
              </span>
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-1 text-ellipsis text-nowrap capitalize flex gap-2 flex-row text-gray-700 font-semibold items-center">
              <User size={20} strokeWidth={3} color="gray" />
              <span className=" font-normal text-gray-500">
                {customer_name}
              </span>
            </span>
            <span className="line-clamp-1 text-ellipsis text-nowrap capitalize flex gap-2 flex-row text-gray-700 font-semibold items-center">
              <Phone size={18} strokeWidth={3} color="gray" />
              <span className=" font-normal text-gray-500">{phone}</span>
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold tracking-tighter text-gray-400">
              {getTimeSince(created_at)}
            </span>
            <Button
              name={state == 1 ? `Checkout` : `View`}
              pd={`px-4 py-1`}
              bg={
                state == 1
                  ? `bg-green-500 hover:bg-green-600 text-white`
                  : false
              }
              link={`/pos/business/jobs/${id}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
