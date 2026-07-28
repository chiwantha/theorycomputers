"use client";

import Button from "@/components/button/Button";
import Separator from "@/components/separator/Separator";
import { getTimeSince } from "@/lib/utils";
import { Phone, Plus, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const JobCard = ({
  add,
  id,
  customer_name,
  phone,
  state,
  created_at,
  job_no,
  index = 0,
}) => {
  const getStatus = () => {
    switch (state) {
      case 0:
        return {
          text: "Pending",
          badge: "bg-red-400 animate-pulse",
          button: "View",
          buttonBg: false,
        };

      case 1:
        return {
          text: "Started",
          badge: "bg-amber-400",
          button: "View",
          buttonBg: "bg-amber-400 hover:bg-amber-500 text-white",
        };

      case 2:
        return {
          text: "Finished",
          badge: "bg-emerald-500",
          button: "View",
          buttonBg: "bg-emerald-500 hover:bg-emerald-600 text-white",
        };

      case 3:
        return {
          text: "Paid",
          badge: "bg-green-500",
          button: "View",
          buttonBg: `bg-green-500 hover:bg-green-600 text-white`,
        };

      case 4:
        return {
          text: "Cancelled",
          badge: "bg-red-500",
          button: "View",
          buttonBg: `bg-red-500 hover:bg-red-600 text-white`,
        };

      default:
        return {
          text: "Unknown",
          badge: "bg-gray-400",
          button: "View",
          buttonBg: false,
        };
    }
  };

  const status = getStatus();

  return (
    <div
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      className={`min-h-50 rounded-xl  transition-all duration-300 flex animate-fade-up opacity-0
        ${add ? "border-4 border-dashed text-blue-400" : "border p-4 md:p-6"}
        ${
          state == 1
            ? `bg-amber-50 border-amber-300 hover:border-amber-500`
            : state == 2
              ? `bg-emerald-50 border-emerald-300 hover:border-emerald-500`
              : state >= 4
                ? `bg-red-50 border-red-300 hover:border-red-500`
                : state == 3
                  ? `bg-green-50 border-green-300 hover:border-green-500`
                  : `bg-gray-50 border-gray-200 hover:border-blue-300`
        }`}
    >
      {add ? (
        <Link
          className="w-full h-full flex items-center justify-center"
          href="/pos/jobs/new"
        >
          <Plus size={60} />
        </Link>
      ) : (
        <div className="flex flex-col w-full gap-1">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500 font-bold tracking-tighter text-xl text-nowrap line-clamp-1 text-ellipsis">
              {job_no.split(`-`).at(-1) || `Job No`}
            </span>

            <span
              className={`px-4 pt-0.5 pb-1 text-white rounded-xl ${status.badge}`}
            >
              {status.text}
            </span>
          </div>

          <Separator />

          {/* CUSTOMER */}
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-1 text-ellipsis text-nowrap capitalize flex gap-2 items-center">
              <User size={20} strokeWidth={3} color="gray" />
              <span className="font-normal text-gray-500">{customer_name}</span>
            </span>

            <span className="line-clamp-1 text-ellipsis text-nowrap capitalize flex gap-2 items-center">
              <Phone size={18} strokeWidth={3} color="gray" />
              <span className="font-normal text-gray-500">{phone}</span>
            </span>
          </div>

          <Separator />

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold tracking-tighter text-gray-400">
              {getTimeSince(created_at)}
            </span>

            <Button
              name={status.button}
              pd="px-4 py-1"
              bg={status.buttonBg}
              link={`/pos/jobs/${id}`}
              disabled={status.disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
