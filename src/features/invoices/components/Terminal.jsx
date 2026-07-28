"use client";

import { useEffect } from "react";

import SelectCustomer from "../../customer/components/SelectCustomer";
import SelectTrnDoc from "./SelectTrnDoc";
import InvoiceRow from "./InvoiceRow";
import { useINVOICEStore } from "@/store/invoiceStore";
import PaymentSection from "./Payment";
import { useCUSTOMERStore } from "@/store/customerStore";

const Terminal = ({
  customersList,
  itemsList,
  quotationList,
  jobList,
  warrantyList,
}) => {
  const docType = useINVOICEStore((state) => state.docType);
  const invType = useINVOICEStore((state) => state.invType);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetINVOICE();
    resetCustomer();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4">
        {/* Left Side */}
        <div className="2xl:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 ">
            {/* Document Type */}
            <div
              style={{
                animationDelay: `${1 * 100}ms`,
              }}
              className="xl:col-span-1 col-span-full animate-fade-up opacity-0"
            >
              <div className="bg-white rounded-xl shadow-md h-full">
                <div
                  className={`grid grid-cols-2 rounded-lg h-full ${
                    invType === "DIRECT" ? "bg-gray-200" : "bg-red-100"
                  }`}
                >
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors col-span-2 ${
                      docType === "INVOICE"
                        ? "bg-green-500 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => {
                      resetINVOICE();
                      resetCustomer();
                      setHeaderField("docType", "INVOICE");
                    }}
                  >
                    Invoice
                  </button>

                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      docType === "ORDER"
                        ? "bg-amber-500 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => {
                      resetINVOICE();
                      resetCustomer();
                      setHeaderField("docType", "ORDER");
                    }}
                    disabled={invType !== "DIRECT"}
                  >
                    Order
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      docType === "QUOTATION"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 bg-gray-300"
                    }`}
                    onClick={() => {
                      resetINVOICE();
                      resetCustomer();
                      setHeaderField("docType", "QUOTATION");
                    }}
                    disabled={invType !== "DIRECT"}
                  >
                    Quote
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Document */}
            <div
              style={{
                animationDelay: `${2 * 100}ms`,
              }}
              className="xl:col-span-2 animate-fade-up opacity-0"
            >
              <SelectTrnDoc jobList={jobList} quoteList={quotationList} />
            </div>

            {/* Customer */}
            <div
              style={{
                animationDelay: `${3 * 100}ms`,
              }}
              className="xl:col-span-2 animate-fade-up opacity-0"
            >
              <SelectCustomer customersList={customersList} />
            </div>

            {/* Invoice Rows */}
            <div
              style={{
                animationDelay: `${5 * 100}ms`,
              }}
              className="col-span-full animate-fade-up opacity-0"
            >
              <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
                <InvoiceRow
                  item_list={itemsList}
                  warranty_list={warrantyList}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div
          style={{
            animationDelay: `${3 * 100}ms`,
          }}
          className="2xl:col-span-1 animate-fade-up opacity-0"
        >
          <PaymentSection />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
