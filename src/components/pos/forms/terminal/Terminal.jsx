"use client";

import { useState } from "react";

import SelectCustomer from "../customer/SelectCustomer";
import SelectTrnDoc from "../trndoc/SelectTrnDoc";
import InvoiceRow from "../../cards/inputCards/InvoiceRow";

const Terminal = ({ customersList, itemsList, quotationList }) => {
  const [quote, setQuote] = useState(false);
  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 col-span-3">
          <SelectTrnDoc />
          <div className="bg-white rounded-xl shadow-md md:col-span-full md:-order-1 xl:order-0 xl:col-span-1 ">
            <div className="grid grid-cols-2 bg-gray-200 hover:bg-gray-300 rounded-lg h-full">
              <button
                className={`px-4 py-1.5 rounded-lg min-h-14 transition-colors duration-300 ${!quote ? `bg-green-500  text-white hover:bg-green-600` : `text-gray-600`}`}
                onClick={() => {
                  setQuote(false);
                }}
              >
                Invoice
              </button>
              <button
                className={`px-4 py-1.5 rounded-xl min-h-14 transition-colors duration-300 ${quote ? `bg-blue-500  text-white` : `text-gray-600`}`}
                onClick={() => {
                  setQuote(true);
                }}
              >
                Quote
              </button>
            </div>
          </div>
          <SelectCustomer customersList={customersList} />
          <div className="col-span-full bg-white p-4 rounded-xl shadow-md">
            <InvoiceRow item_list={itemsList} />
          </div>
        </div>
        {/* Payment Section */}
      </div>
    </div>
  );
};

export default Terminal;
