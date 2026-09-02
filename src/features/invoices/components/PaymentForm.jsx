import Button from "@/components/button/Button";
import NextDropdown from "@/components/form/nextinput/NextDropdown";
import NextInput from "@/components/form/nextinput/NextInput";
import Separator from "@/components/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AiFillBank } from "react-icons/ai";
import { FaCcMastercard, FaCreditCard, FaRupeeSign } from "react-icons/fa6";
import { RiVisaLine } from "react-icons/ri";

const settlementsType = [
  {
    name: `Full`,
    value: `FULL`,
  },
  {
    name: `Partial`,
    value: `PARTIAL`,
  },
  {
    name: `Credit`,
    value: `CREDIT`,
  },
];

const PaymentForm = () => {
  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVPayment = useINVOICEStore((state) => state.resetINVPayment);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);

  const docType = useINVOICEStore((state) => state.docType);

  const settlement = useINVOICEStore((state) => state.settlement);
  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const paid = useINVOICEStore((state) => state.paid);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const netTotal = useINVOICEStore((state) => state.netTotal);

  const cashAmount = useINVOICEStore((state) => state.cashAmount);
  const cardAmount = useINVOICEStore((state) => state.cardAmount);
  const bankAmount = useINVOICEStore((state) => state.bankAmount);
  const creditAmount = useINVOICEStore((state) => state.creditAmount);

  const cardType = useINVOICEStore((state) => state.cardType);
  const cardDigits = useINVOICEStore((state) => state.cardDigits);
  const cashReceived = useINVOICEStore((state) => state.cashReceived);

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
  ];

  useEffect(() => {
    if (paymentMethod == "CARD") {
      setHeaderField(`cardAmount`, netTotal);
    }
  }, [paymentMethod, settlement]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-2 mt-1">
        <h1 className="text-xl font-bold text-gray-600">Payment Options</h1>
      </div>
      {/* Totals */}
      <div className=" flex flex-col gap-2 pt-2 pb-4 ">
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
      {/* Settlement */}
      <div className={`grid-cols-3 grid `}>
        {settlementsType.map((sett, index) => (
          <Button
            key={index}
            name={sett.name}
            wfull={true}
            pd={`px-4 py-3`}
            rounded={
              index == 0
                ? `rounded-l-xl`
                : index === settlementsType.length - 1
                  ? `rounded-r-xl`
                  : `rounded-none`
            }
            bg={
              settlement == sett.value
                ? `bg-amber-500 text-white hover:bg-amber-600`
                : `bg-gray-200 text-gray-600 hover:bg-amber-200`
            }
            disabled={sett.value === "PARTIAL" && docType != "ORDER"}
            click={() => {
              resetINVPayment();
              setHeaderField(`settlement`, sett.value);
            }}
          />
        ))}
      </div>
      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-2">
        {paymentMethods.map((method, index) => (
          <Button
            key={index}
            rounded={`rounded-xl`}
            pd={`px-4 py-8`}
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
      {/* Payment Tabs */}
      <div className="flex flex-col space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-300 shadow-md">
        {paymentMethod == `CASH` && (
          <div className="flex flex-col gap-1">
            <NextInput
              name={`cashReceived`}
              type="number"
              label={`Cash Received`}
              placeholder={`5000.00`}
              value={cashReceived}
              onChange={(e) => {
                setHeaderField(`cashReceived`, e.target.value);
              }}
            />
            <NextInput
              name={`cashBalance`}
              type="number"
              label={`Balance`}
              placeholder={`0`}
              value={Number(cashReceived) - Number(netTotal)}
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
            <NextInput
              name={`paying`}
              type="number"
              label={`Paying`}
              disabled={settlement === "FULL"}
              placeholder={`0.00`}
              inputClassName={settlement === "FULL" && `bg-red-100`}
              value={cardAmount}
              onChange={(e) => {
                setHeaderField(`cardAmount`, e.target.value);
              }}
            />
            <NextInput
              name={`cashBalance`}
              type="number"
              label={`Balance`}
              placeholder={`0`}
              value={Number(cardAmount) - Number(netTotal)}
              readonly={true}
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
            <NextInput
              name={`cashBalance`}
              type="number"
              label={`Balance`}
              placeholder={`0`}
              value={
                Number(cashAmount) +
                Number(cardAmount) +
                Number(bankAmount) -
                Number(netTotal)
              }
              readonly={true}
            />
          </>
        )}

        {paymentMethod == `CREDIT` && (
          <div className="flex flex-col space-y-2">
            {/* <NextInput
              name={`down payment amount`}
              type="number"
              label={`DownPayment`}
              placeholder={`1500`}
              value={downPayment}
              onChange={(e) => {
                const value =
                  e.target.value == `` ? `` : Number(e.target.value);
                setHeaderField(`downPayment`, value);
                setHeaderField(`creditAmount`, netTotal - value);
              }}
            /> */}

            <div className="bg-red-400 flex items-center justify-center flex-col p-4 rounded-lg">
              <span className=" text-gray-100">Total Due</span>
              <span className="text-white py-0.5 font-bold px-4 text-4xl">
                {Number(creditAmount).toFixed(2)}
              </span>
            </div>

            <NextInput
              name={`down payment amount`}
              type="date"
              label={`Due Date`}
            />
          </div>
        )}
      </div>
      {/* Payment Fullfillment */}
      {settlement !== "FULL" && (
        <div className="flex flex-col space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-300 shadow-md mt-0.5">
          {/* Partial Payment Settlement */}
          {settlement === "PARTIAL" && (
            <div className="flex flex-col gap-4">
              <NextDropdown
                label={`Settle`}
                placeholder="Select When Settles !"
                items={[
                  { label: "On Pickup", value: "ON_PICKUP" },
                  { label: "On Delivary", value: "ON_DELIVARY" },
                ]}
              />
            </div>
          )}

          {settlement === "CREDIT" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="bg-red-400 flex items-center justify-center flex-col p-2 rounded-lg">
                <span className=" text-gray-100">Total Due</span>
                <span className="text-white py-0.5 font-bold px-4 text-xl">
                  {Number(netTotal) -
                    (Number(cashAmount) +
                      Number(cardAmount) +
                      Number(bankAmount))}
                </span>
              </div>
              <NextInput
                name={`down payment amount`}
                type="date"
                label={`Due Date`}
              />
            </div>
          )}
        </div>
      )}
      {/* Delivary Options */}
      {docType === "ORDER" && <div className="flex flex-col"></div>}
      {/* Action */}
      <div className="flex items-center gap-2">
        <Button
          name={`Pay`}
          wfull={true}
          pd={`px-4 py-3`}
          bg={`bg-green-500 text-white hover:bg-green-600`}
          fg={`text-lg font-bold`}
        />
        <Button
          name={
            <RefreshCcw
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300 "
            />
          }
          bg={`bg-red-400 text-white hover:bg-red-600 aspect-square group`}
          click={() => resetINVOICE()}
        />
      </div>
    </div>
  );
};

export default PaymentForm;
