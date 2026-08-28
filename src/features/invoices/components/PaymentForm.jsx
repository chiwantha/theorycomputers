import Button from "@/components/button/Button";
import NextInput from "@/components/form/nextinput/NextInput";
import Separator from "@/components/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import React, { useState } from "react";
import { AiFillBank } from "react-icons/ai";
import { FaCreditCard, FaRupeeSign } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";

const PaymentForm = () => {
  const [isPercentage, setisPercentage] = useState(true);
  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVPayment = useINVOICEStore((state) => state.resetINVPayment);

  const paid = useINVOICEStore((state) => state.paid);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);

  const paymentMethods = [
    {
      name: `CASH`,
      icon: <FaRupeeSign />,
      func: () => {
        setHeaderField(`paymentMethod`, `CASH`);
        resetINVPayment();
      },
    },
    {
      name: `CARD`,
      icon: <FaCreditCard />,
      func: () => {
        setHeaderField(`paymentMethod`, `CARD`);
        resetINVPayment();
      },
    },
    {
      name: `MIX`,
      icon: <AiFillBank />,
      func: () => {
        setHeaderField(`paymentMethod`, `MIX`);
        resetINVPayment();
      },
    },
    {
      name: `CREDIT`,
      icon: <GiReceiveMoney />,
      func: () => {
        setHeaderField(`paymentMethod`, `CREDIT`);
        resetINVPayment();
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-gray-600">Payment Options</h1>
      </div>
      <Separator />
      <div className="rounded-xl bg-gray-50 shadow-md flex flex-col gap-2 border-blue-300 border py-6 px-4 ">
        <div className="flex justify-between items-center flex-nowrap gap-4 px-2">
          <span className="text-gray-600">Gross Total</span>
          <span>{Number(grossTotal).toFixed(2)}</span>
        </div>
        <Separator />
        {paid ? (
          <>
            <div className="flex justify-between items-center flex-nowrap gap-4 px-2">
              <span className="text-gray-600">Paid</span>
              <span>{Number(paid).toFixed(2)}</span>
            </div>
            <Separator />
          </>
        ) : (
          false
        )}
        <div className="flex justify-between items-center flex-nowrap gap-4 px-2">
          <span className="text-gray-600">Discount</span>
          <NextInput
            inputClassName={`text-right`}
            placeholder={`enter amount`}
            max={7}
            onChange={(e) => {
              setDiscount(e.target.value);
            }}
          />
        </div>
        <Separator />
        <div className="flex justify-between items-center flex-nowrap gap-4 px-2">
          <span className="text-gray-600">Net Total</span>
          <span>{Number(netTotal).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
