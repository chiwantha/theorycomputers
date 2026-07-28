"use client";

import NextInput from "@/components/form/nextinput/NextInput";
import ComboboxAdapter from "@/components/ui/combobox-adapter";
import { useCUSTOMERStore } from "@/store/customerStore";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

const SelectCustomer = ({ customersList, island = true }) => {
  const setHeaderField = useCUSTOMERStore((state) => state.setCustomerField);
  const customerState = useCUSTOMERStore((state) => state.customerState);
  const customerId = useCUSTOMERStore((state) => state.customerId);
  const customerName = useCUSTOMERStore((state) => state.customerName);
  const customerPhone = useCUSTOMERStore((state) => state.customerPhone);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetCustomer();
  }, []);

  return (
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
      {/* exsisting customer */}
      {customerState == 0 ? (
        <div className="">
          {/* <NextDropdown
            items={customersList}
            name={`customer`}
            defaultValue={customerId}
            onChange={(val) => {
              const selected = customersList.find(
                (customer) => customer.value === val,
              );
              setHeaderField(`customerId`, val);
              setHeaderField(`customerName`, selected.label.split(" - ")[0]);
              setHeaderField(`customerPhone`, selected.phone);
            }}
          /> */}

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
        <div className="gap-2 flex items-center ">
          <NextInput
            name={`customerName`}
            placeholder={`Customer Name`}
            value={customerName}
            className={`w-full`}
            max={50}
            onChange={(e) => setHeaderField(`customerName`, e.target.value)}
          />
          <NextInput
            name={`customerPhone`}
            placeholder={`Customer Phone`}
            value={customerPhone}
            className={`w-full`}
            max={10}
            onChange={(e) => setHeaderField(`customerPhone`, e.target.value)}
          />
        </div>
      )}
      {/* new customer */}
      {/* <div className=""></div> */}
    </div>
  );
};

export default SelectCustomer;
