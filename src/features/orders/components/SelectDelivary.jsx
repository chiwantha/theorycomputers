"use client";
import NextInput from "@/components/form/nextinput/NextInput";
import ComboboxAdapter from "@/components/ui/combobox-adapter";
import { ChevronsDown, RefreshCcw } from "lucide-react";
import React, { useState } from "react";

const SelectDelivary = ({ courierList, island = true }) => {
  const [courier, setCourier] = useState({
    delivary: false,
    courierId: null,
    delivaryCharges: 0,
  });
  return (
    <div
      className={`${island && `bg-white rounded-xl shadow-md  p-4`} flex flex-col space-y-4`}
    >
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-xl">
          <button
            className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${!courier.delivary ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setCourier((prev) => ({
                ...prev,
                delivary: false,
                courierId: null,
                delivaryCharges: 0,
              }));
            }}
          >
            Pickup
          </button>
          <button
            className={`px-4 py-1.5 rounded-xl  transition-colors duration-300 ${courier.delivary ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setCourier((prev) => ({
                ...prev,
                delivary: true,
                courierId: null,
                delivaryCharges: 0,
              }));
            }}
          >
            Delivary
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCourier({
                delivary: false,
                courierId: null,
                delivaryCharges: 0,
              });
            }}
            className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300"
          >
            <RefreshCcw
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {!courier.delivary ? (
        <div className="">
          <NextInput
            readonly={true}
            value={`Pickup Order`}
            inputClassName={`bg-red-100`}
            name={`pickupVal`}
          />
        </div>
      ) : (
        <div className="">
          <ComboboxAdapter
            name={`courier`}
            placeholder={`Select courier ...`}
            items={
              !courierList || [
                { value: 1, label: `Domex` },
                { value: 2, label: `Daraz Ex` },
                { value: 3, label: `FedX` },
              ]
            }
            defaultValue={courier.courierId}
            onChange={(val) => {
              setCourier((prev) => ({
                ...prev,
                courierId: val,
              }));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectDelivary;
