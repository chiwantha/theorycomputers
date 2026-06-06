"use client";

import { useEffect, useState } from "react";

import SelectCustomer from "../customer/SelectCustomer";
import SelectTrnDoc from "../trndoc/SelectTrnDoc";
import InvoiceRow from "../../cards/inputCards/InvoiceRow";
import { useINVOICEStore } from "@/store/invoiceStore";
import { generateDocNo } from "@/lib/utils";
import PaymentSection from "../../sections/terminal/Payment";

const Terminal = ({ customersList, itemsList, quotationList, jobList }) => {
  const docType = useINVOICEStore((state) => state.docType);
  const invType = useINVOICEStore((state) => state.invType);
  const jobId = useINVOICEStore((state) => state.jobId);
  const quoteId = useINVOICEStore((state) => state.quoteId);

  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);

  useEffect(() => {
    resetINVOICE();
    setHeaderField(`invNo`, generateDocNo(`INV`));
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 2xl:grid-cols-4 space-y-4 2xl:space-y-0 2xl:space-x-4">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 col-span-3">
          <div className="col-span-2">
            <SelectTrnDoc jobList={jobList} />
          </div>

          <div className="col-span-2">
            <SelectCustomer customersList={customersList} />
          </div>

          {/* Document Selector */}
          <div className="bg-white rounded-xl shadow-md md:col-span-full md:-order-1 xl:order-0 xl:col-span-1">
            <div
              className={`grid grid-cols-2 bg-gray-200 ${invType == "DIRECT" ? `hover:bg-gray-300` : `bg-red-100`} rounded-lg h-full`}
            >
              <button
                className={`px-4 py-1.5 rounded-lg min-h-14 transition-colors duration-300 ${docType == "INVOICE" ? `bg-green-500  text-white hover:bg-green-600` : `text-gray-600`}`}
                onClick={() => {
                  setHeaderField(`docType`, `INVOICE`);
                }}
              >
                Invoice
              </button>
              <button
                className={`px-4 py-1.5 rounded-xl min-h-14 transition-colors duration-300 ${docType == "QUOTATION" ? `bg-blue-500  text-white` : `text-gray-600`}`}
                onClick={() => {
                  setHeaderField(`docType`, `QUOTATION`);
                }}
                disabled={invType !== `DIRECT`}
              >
                Quote
              </button>
            </div>
          </div>

          <div className="col-span-full bg-white p-4 rounded-xl shadow-md">
            <InvoiceRow item_list={itemsList} />
          </div>

          <div className="flex flex-col col-span-full ">
            <span>Document Type : {docType}</span>
            <span>Invoice Type : {invType}</span>
            <span>Job Id : {jobId}</span>
            <span>Quote Id : {quoteId}</span>
          </div>
        </div>
        {/* Payment Section */}
        <PaymentSection />
      </div>
    </div>
  );
};

export default Terminal;
