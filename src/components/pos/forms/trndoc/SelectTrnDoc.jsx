import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { RefreshCcw } from "lucide-react";
import { Label } from "radix-ui";
import React, { useState } from "react";

const SelectTrnDoc = ({ island = true }) => {
  const [tab, setTab] = useState(false);
  return (
    <div
      className={`${island && `bg-white rounded-xl shadow-md  p-4`} flex flex-col space-y-4`}
    >
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-xl">
          <button
            className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${tab == 0 ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setTab(0);
            }}
          >
            Job
          </button>
          <button
            className={`px-4 py-1.5 rounded-xl  transition-colors duration-300 ${tab == 1 ? `bg-blue-500  text-white` : `text-gray-600`}`}
            onClick={() => {
              setTab(1);
            }}
          >
            Qoute
          </button>
        </div>
        <button className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300">
          <RefreshCcw
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
      </div>
      {/* exsisting customer */}
      {tab == 0 ? (
        <div className="">
          <NextDropdown
            placeholder={`Select Job ...`}
            items={[
              { value: 0, label: `Job 1` },
              { value: 1, label: `Job 2` },
              { value: 2, label: `Job 3` },
            ]}
            name={`job`}
          />
        </div>
      ) : (
        <div className="">
          <NextDropdown
            placeholder={`Select Qoute ...`}
            items={[
              { value: 0, label: `Qoute 1` },
              { value: 1, label: `Qoute 2` },
              { value: 2, label: `Qoute 3` },
            ]}
            name={`qoute`}
          />
        </div>
      )}
    </div>
  );
};

export default SelectTrnDoc;
