"use client";
import Separator from "@/components/common/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import React from "react";

const PaymentSection = () => {
  const advance = useINVOICEStore((state) => state.advance);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const netTotal = useINVOICEStore((state) => state.netTotal);
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {/* job totals */}
      <div className="flex flex-col ">
        <div className="grid grid-cols-2 gap-2 r">
          <span className="pl-4 ">Gross Total</span>
          <span className=" py-1 font-semibold px-4 ">{grossTotal}</span>
        </div>
        <Separator />
        {advance ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <span className="pl-4 ">Advance</span>
              <span className=" py-1 font-semibold px-4 ">{advance}</span>
            </div>
            <Separator />
          </>
        ) : (
          false
        )}
        <div className="grid grid-cols-2 gap-2">
          <span className="pl-4 ">Discount</span>
          <input
            name="dsicount"
            type="number"
            className=" py-1 font-semibold px-4  outline-none bg-red-200 rounded-md"
            value={discount}
            placeholder="Enter Discount"
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <span className="pl-4 ">Net Total</span>
          <span className=" py-1  font-semibold px-4 ">{netTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
