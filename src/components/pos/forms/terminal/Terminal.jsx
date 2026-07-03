"use client";

import { useEffect, useState } from "react";

import SelectCustomer from "../customer/SelectCustomer";
import SelectTrnDoc from "../trndoc/SelectTrnDoc";
import InvoiceRow from "../../cards/inputCards/InvoiceRow";
import { useINVOICEStore } from "@/store/invoiceStore";
import { generateDocNo } from "@/lib/utils";
import PaymentSection from "../../sections/terminal/Payment";
import Separator from "@/components/common/separator/Separator";
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
  const advance = useINVOICEStore((state) => state.advance);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);
  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const cashAmount = useINVOICEStore((state) => state.cashAmount);
  const cardAmount = useINVOICEStore((state) => state.cardAmount);
  const bankAmount = useINVOICEStore((state) => state.bankAmount);
  const creditAmount = useINVOICEStore((state) => state.creditAmount);

  const cardType = useINVOICEStore((state) => state.cardType);
  const cardDigits = useINVOICEStore((state) => state.cardDigits);
  const dueDate = useINVOICEStore((state) => state.dueDate);

  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);

  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

  useEffect(() => {
    resetINVOICE();
    resetCustomer();
    // setHeaderField(`invNo`, generateDocNo(`INV`));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 2xl:grid-cols-4 gap-4">
        {/* Left Side */}
        <div className="2xl:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {/* Document Type */}
            <div className="xl:col-span-1 col-span-full">
              <div className="bg-white rounded-xl shadow-md h-full">
                <div
                  className={`grid grid-cols-2 rounded-lg h-full ${
                    invType === "DIRECT" ? "bg-gray-200" : "bg-red-100"
                  }`}
                >
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${
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
                      docType === "QUOTATION"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600"
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
            <div className="xl:col-span-2">
              <SelectTrnDoc jobList={jobList} />
            </div>

            {/* Customer */}
            <div className="xl:col-span-2">
              <SelectCustomer customersList={customersList} />
            </div>

            {/* Invoice Rows */}
            <div className="col-span-full">
              <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
                <InvoiceRow
                  item_list={itemsList}
                  warranty_list={warrantyList}
                />
              </div>
            </div>

            {/* Debug Values  */}
            <div className="hidden flex-col ">
              <span>Gross : {grossTotal}</span>
              <span>Advance : - {advance}</span>
              <span>Discount : - {discount}</span>
              <span>Net : {netTotal}</span>
              <Separator />
              <span>Method : {paymentMethod}</span>
              <Separator />
              <span>Cash : {cashAmount}</span>
              <span>Card : {cardAmount}</span>
              <span>Bank : {bankAmount}</span>
              <span>Credit : {creditAmount}</span>
              <Separator />
              <span>CardType : {cardType}</span>
              <span>cardDigit : {cardDigits}</span>
              <span>dueDate : {dueDate}</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="2xl:col-span-1">
          <PaymentSection />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
