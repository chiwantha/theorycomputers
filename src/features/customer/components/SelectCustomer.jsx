"use client";

import NextInput from "@/components/form/nextinput/NextInput";
import ComboboxAdapter from "@/components/ui/combobox-adapter";
import { useCUSTOMERStore } from "@/store/customerStore";
import { ChevronsDown, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

const SelectCustomer = ({ customersList, island = true }) => {
  const [isOpen, setisOpen] = useState(false);
  const setHeaderField = useCUSTOMERStore((state) => state.setCustomerField);
  const customerState = useCUSTOMERStore((state) => state.customerState);
  const customerId = useCUSTOMERStore((state) => state.customerId);
  const customerFirstName = useCUSTOMERStore(
    (state) => state.customerFirstName,
  );
  const customerLastName = useCUSTOMERStore((state) => state.customerLastName);
  const customerPhone = useCUSTOMERStore((state) => state.customerPhone);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetCustomer();
  }, []);

  return (
    <div className="relative">
      <div
        className={`${island && `bg-white rounded-xl shadow-md  p-4`} flex flex-col space-y-4`}
      >
        <div className="flex gap-2 justify-between items-center">
          <div className="flex items-center bg-gray-200 hover:bg-gray-300 rounded-xl">
            <button
              className={`px-4 py-1.5 rounded-xl transition-colors duration-300 ${customerState == 0 ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                resetCustomer();
                setHeaderField(`customerState`, 0);
              }}
            >
              Exsisting
            </button>
            <button
              className={`px-4 py-1.5 rounded-xl  transition-colors duration-300 ${customerState == 1 ? `bg-blue-500  text-white` : `text-gray-600`}`}
              onClick={() => {
                resetCustomer();
                setHeaderField(`customerState`, 1);
              }}
            >
              New
            </button>
          </div>
          <div className="flex items-center gap-2">
            {customerState == 1 && (
              <button
                onClick={() => setisOpen(!isOpen)}
                className="px-2 text-white py-2 rounded-xl group bg-amber-500 hover:bg-amber-600 transition-colors duration-300"
              >
                <ChevronsDown size={20} className="" />
              </button>
            )}
            <button
              onClick={() => {
                resetCustomer();
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
        {/* exsisting customer */}
        {customerState == 0 ? (
          <div className="">
            <ComboboxAdapter
              name={`customer`}
              items={customersList}
              defaultValue={customerId}
              placeholder="Select Customer ..."
              onChange={(value, customer) => {
                setHeaderField("customerId", value);
                setHeaderField(
                  "customerName",
                  customer?.label.split(" - ")[0] || "",
                );
                setHeaderField("customerPhone", customer?.phone || "");
              }}
            />
          </div>
        ) : (
          <div className=" grid grid-cols-3 gap-x-2">
            <NextInput
              name={`customerFirstName`}
              placeholder={`First Name`}
              value={customerFirstName}
              className={`w-full`}
              max={50}
              onChange={(e) =>
                setHeaderField(`customerFirstName`, e.target.value)
              }
            />
            <NextInput
              name={`customerLastName`}
              placeholder={`Last Name`}
              value={customerLastName}
              className={`w-full`}
              max={50}
              onChange={(e) =>
                setHeaderField(`customerLastName`, e.target.value)
              }
            />
            <NextInput
              name={`customerPhone`}
              placeholder={`Phone`}
              value={customerPhone}
              className={`w-full`}
              max={10}
              onChange={(e) => setHeaderField(`customerPhone`, e.target.value)}
            />
          </div>
        )}
      </div>

      <div
        className={`absolute mt-4 w-full bg-white border border-gray-300 hover:border-blue-500 rounded-xl shadow-md p-4 space-y-4
          origin-top transition-all duration-300 ease-in-out overflow-hidden
         ${
           isOpen
             ? "opacity-100 scale-100 translate-y-0 pointer-events-auto p-4"
             : "opacity-0 scale-95 -translate-y-2 pointer-events-none p-0"
         }
        `}
      >
        <button
          onClick={() => setisOpen(false)}
          className="px-2 text-white py-2 rounded-xl group bg-red-400 hover:bg-red-600 transition-colors duration-300 "
        >
          <X
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
        <div className=" grid grid-cols-2 gap-2">
          <NextInput
            name={`first_name`}
            required={true}
            label={`First Name`}
            placeholder={`Ravindu`}
            value={customerFirstName}
            className={`w-full`}
            max={50}
            onChange={(e) =>
              setHeaderField(`customerFirstName`, e.target.value)
            }
          />
          <NextInput
            name={`last_name`}
            required={true}
            label={`Last Name`}
            placeholder={`Ajan`}
            value={customerLastName}
            className={`w-full`}
            max={50}
            onChange={(e) => setHeaderField(`customerLastName`, e.target.value)}
          />
          <NextInput
            name={`customerPhone`}
            required={true}
            label={`Phone`}
            placeholder={`0788806670`}
            value={customerPhone}
            className={`w-full `}
            max={10}
            onChange={(e) => setHeaderField(`customerPhone`, e.target.value)}
          />
          <NextInput
            name={`customerLastName`}
            label={`City`}
            placeholder={`Dekatana`}
            value={customerLastName}
            className={`w-full`}
            max={50}
            onChange={(e) => setHeaderField(`customerLastName`, e.target.value)}
          />
          <NextInput
            name={`customerLastName`}
            label={`Address`}
            placeholder={`361/23 Parangoda, Dekatana`}
            value={customerLastName}
            className={`w-full col-span-2`}
            max={50}
            onChange={(e) => setHeaderField(`customerLastName`, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectCustomer;
