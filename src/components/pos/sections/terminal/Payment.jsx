"use client";
import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import { FaRupeeSign } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { useState } from "react";
import { RiVisaLine } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa6";
import { RefreshCcw } from "lucide-react";

const PaymentSection = () => {
  const [pending, setPending] = useState(false);
  const docType = useINVOICEStore((state) => state.docType);
  const advance = useINVOICEStore((state) => state.advance);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);
  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const cashAmount = useINVOICEStore((state) => state.cashAmount);
  const cardAmount = useINVOICEStore((state) => state.cardAmount);
  const bankAmount = useINVOICEStore((state) => state.bankAmount);
  const downPayment = useINVOICEStore((state) => state.downPayment);
  const creditAmount = useINVOICEStore((state) => state.creditAmount);
  const dueDate = useINVOICEStore((state) => state.dueDate);
  const cardDigits = useINVOICEStore((state) => state.cardDigits);
  const cardType = useINVOICEStore((state) => state.cardType);
  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);
  const resetINVPayment = useINVOICEStore((state) => state.resetINVPayment);

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

  const handleCrud = async () => {
    setPending(true);
    try {
    } catch (err) {
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
      {/* invoice totals */}
      <div className="flex flex-col ">
        <div className="grid grid-cols-2 gap-2 items-center">
          <span className="pl-4 text-gray-400">Gross Total</span>
          <span className=" py-1 font-semibold px-4 ">{grossTotal}</span>
        </div>

        <Separator />

        {advance ? (
          <>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="pl-4 text-gray-400">Advance</span>
              <span className=" py-1 font-semibold px-4 ">{advance}</span>
            </div>
            <Separator />
          </>
        ) : (
          false
        )}

        <div className="grid grid-cols-2 gap-2 items-center">
          <span className="pl-4 text-gray-400">Discount</span>
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

        <div className="flex mt-2 justify-center items-center flex-col py-4 ">
          <span className=" text-gray-400">Net Total</span>
          <span className=" py-0.5 font-bold px-4 text-xl">{netTotal}</span>
        </div>
      </div>

      {/* payment method */}
      {docType === `INVOICE` && (
        <div className="flex flex-col space-y-4">
          {/* Payment Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map((method, index) => (
              <Button
                key={index}
                rounded={`rounded-lg`}
                pd={`px-4 py-6`}
                wfull={true}
                fg={`flex items-center justify-center text-2xl`}
                bg={
                  paymentMethod == method.name
                    ? `bg-green-500 hover:bg-green-600 text-white`
                    : `bg-gray-200 text-gray-700 hover:bg-gray-300`
                }
                name={method.icon}
                click={method.func}
              />
            ))}
          </div>
          {/* Paymtn Tabs */}
          <div className="flex flex-col space-y-2">
            {paymentMethod == `CASH` && (
              <div className="flex flex-col gap-1">
                <NextInput
                  name={`cashReceived`}
                  type="number"
                  label={`Cash Received`}
                  placeholder={`5000.00`}
                  value={cashAmount}
                  onChange={(e) => {
                    setHeaderField(`cashAmount`, e.target.value);
                  }}
                />
                <NextInput
                  name={`cashBalance`}
                  type="number"
                  label={`Balance`}
                  placeholder={`0`}
                  value={cashAmount - netTotal}
                  readonly={true}
                />
              </div>
            )}

            {paymentMethod == `CARD` && (
              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    name={<RiVisaLine />}
                    fg={`flex items-center justify-center text-6xl ${cardType == `VISA` ? `border-l-12 border-green-400` : ``}`}
                    pd={`px-4 py-4`}
                    wfull={true}
                    click={() => setHeaderField(`cardType`, `VISA`)}
                  />
                  <Button
                    name={<FaCcMastercard />}
                    fg={`flex items-center justify-center text-6xl ${cardType == `MASTER` ? `border-l-12 border-green-400` : ``}`}
                    bg={`bg-orange-400 text-white hover:bg-orange-500`}
                    pd={`px-4 py-4`}
                    wfull={true}
                    click={() => setHeaderField(`cardType`, `MASTER`)}
                  />
                </div>
                <NextInput
                  name={`cardDigits`}
                  label={`Last 4 Digits`}
                  placeholder={`6564`}
                  value={cardDigits}
                  max={4}
                  onChange={(e) => {
                    setHeaderField(`cardDigits`, e.target.value);
                  }}
                />
              </div>
            )}

            {paymentMethod == `MIX` && (
              <>
                <NextInput
                  name={`cash amount`}
                  type="number"
                  label={`Cash Amount`}
                  placeholder={`5000.00`}
                  value={cashAmount}
                  onChange={(e) => {
                    setHeaderField(`cashAmount`, e.target.value);
                  }}
                />
                <NextInput
                  name={`card amount`}
                  type="number"
                  label={`Card Amount`}
                  placeholder={`5000.00`}
                  value={cardAmount}
                  onChange={(e) => {
                    setHeaderField(`cardAmount`, e.target.value);
                  }}
                />
                <NextInput
                  name={`bank amount`}
                  type="number"
                  label={`Bank Amount`}
                  placeholder={`5000.00`}
                  value={bankAmount}
                  onChange={(e) => {
                    setHeaderField(`bankAmount`, e.target.value);
                  }}
                />
              </>
            )}

            {paymentMethod == `CREDIT` && (
              <div className="flex flex-col space-y-2">
                <NextInput
                  name={`down payment amount`}
                  type="number"
                  label={`DownPayment`}
                  placeholder={`5000.00`}
                  value={downPayment}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setHeaderField(`downPayment`, e.target.value);
                    setHeaderField(`creditAmount`, netTotal - value);
                  }}
                />

                <div className="bg-red-400 flex items-center justify-center flex-col p-4 rounded-lg">
                  <span className=" text-gray-100">Total Due</span>
                  <span className="text-white py-0.5 font-bold px-4 text-4xl">
                    {creditAmount}
                  </span>
                </div>

                <NextInput
                  name={`down payment amount`}
                  type="date"
                  label={`Due Date`}
                  value={dueDate}
                  onChange={(e) => {
                    setHeaderField(`dueDate`, e.target.value);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="items-center flex gap-2">
        <Button
          name={
            pending ? `Processing...` : docType === `INVOICE` ? `PAY` : `SAVE`
          }
          wfull={true}
          pd={`py-3 px-4 font-bold text-xl`}
          bg={`bg-green-500 text-white hover:bg-green-600`}
          disabled={
            paymentMethod == "CASH" || paymentMethod == `MIX`
              ? Number(cashAmount) + Number(cardAmount) + Number(bankAmount) ==
                0
              : paymentMethod == "CARD"
                ? cardType == `` || cardDigits == ``
                : paymentMethod == `CREDIT`
                  ? downPayment == `` ||
                    dueDate == `` ||
                    Number(downPayment) + Number(creditAmount) !=
                      Number(netTotal) ||
                    Number(creditAmount) > netTotal
                  : false
          }
          click={() => console.log(useINVOICEStore.getState())}
        />
        <Button
          name={
            <RefreshCcw
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          }
          pd={`py-4 px-4 font-bold text-xl aspect-square `}
          bg={`bg-red-400 text-white hover:bg-red-500`}
          click={() => resetINVOICE()}
        />
      </div>
    </div>
  );
};

export default PaymentSection;
