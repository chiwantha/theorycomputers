"use client";
import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import { FaRupeeSign } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { useEffect, useState } from "react";
import { RiVisaLine } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa6";
import { RefreshCcw } from "lucide-react";
import { useCUSTOMERStore } from "@/store/customerStore";
import { validateFields } from "@/lib/validation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { generateDocNo } from "@/lib/utils";

const PaymentSection = () => {
  const { data: userData } = useSession();
  const [pending, setPending] = useState(false);

  const invNo = useINVOICEStore((state) => state.invNo);
  const docType = useINVOICEStore((state) => state.docType);
  const invType = useINVOICEStore((state) => state.invType);
  const jobId = useINVOICEStore((state) => state.jobId);
  const quoteId = useINVOICEStore((state) => state.quoteId);

  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const paid = useINVOICEStore((state) => state.paid);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);

  const rows = useINVOICEStore((state) => state.rows);
  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const cashAmount = useINVOICEStore((state) => state.cashAmount);
  const cardAmount = useINVOICEStore((state) => state.cardAmount);
  const bankAmount = useINVOICEStore((state) => state.bankAmount);
  const downPayment = useINVOICEStore((state) => state.downPayment);
  const creditAmount = useINVOICEStore((state) => state.creditAmount);

  const dueDate = useINVOICEStore((state) => state.dueDate);
  const cardDigits = useINVOICEStore((state) => state.cardDigits);
  const cardType = useINVOICEStore((state) => state.cardType);
  const cashReceived = useINVOICEStore((state) => state.cashReceived);

  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const billEdit = useINVOICEStore((state) => state.billEdit);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVOICE = useINVOICEStore((state) => state.resetINVOICE);
  const resetINVPayment = useINVOICEStore((state) => state.resetINVPayment);

  const customerState = useCUSTOMERStore((state) => state.customerState);
  const customerId = useCUSTOMERStore((state) => state.customerId);
  const customerName = useCUSTOMERStore((state) => state.customerName);
  const customerPhone = useCUSTOMERStore((state) => state.customerPhone);
  const resetCustomer = useCUSTOMERStore((state) => state.resetCustomer);

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

  useEffect(() => {
    if (docType === `INVOICE`) {
      if (paymentMethod === `CASH`) {
        setHeaderField(`cashAmount`, netTotal);
      } else if (paymentMethod === `CARD`) {
        setHeaderField(`cardAmount`, netTotal);
      } else if (paymentMethod === `CREDIT`) {
        setHeaderField(`creditAmount`, downPayment);
      }
    }
  }, [netTotal, paymentMethod, docType]);

  const handleCrud = async () => {
    if (docType === `INVOICE`) {
      setHeaderField(`invNo`, generateDocNo(`INV`));
    } else if (docType === `QUOTATION`) {
      setHeaderField(`invNo`, generateDocNo(`QUT`));
    }
    setPending(true);

    try {
      let validation;
      const customerData = useCUSTOMERStore.getState();
      const invoiceData = useINVOICEStore.getState();

      // Customer Validation
      if (customerData?.customerState === 0) {
        validation = validateFields(customerData, [`customerId`]);
        if (!validation.isValid) {
          toast.error(`Select Customer !`);
          return;
        }
      } else {
        validation = customerData?.customerState
          ? customerData.customerName !== "" &&
            customerData.customerPhone !== ""
          : customerData.customerId !== null;
        if (!validation) {
          toast.error(`Missing New Customer Details !`);
          return;
        }
      }

      // Invoice Items Validation
      if (invoiceData?.rows.length > 0) {
        for (const row of invoiceData?.rows) {
          if (!row.itemId) {
            toast.error(`Select Valid Item!`);
            return;
          }

          if (!row.selling) {
            toast.error(`Missing Selling Price on ${row?.itemName} !`);
            return;
          }

          if (!row.cost && row.item_type === `P`) {
            toast.error(`Missing Unit Cost on ${row?.itemName} !`);
            return;
          }

          if (!row.quantity && row.itemType == "P") {
            toast.error(`Missing Quantity on ${row?.itemName} !`);
            return;
          }

          if (row.serial) {
            const validSerials = row.serials.filter(
              (serial) => serial?.trim() !== "",
            );

            if (validSerials.length !== row.quantity) {
              toast.error(
                `Mismatch in serial and quantity on ${row?.itemName} !`,
              );
              return;
            }
          }
        }
      } else {
        toast.error(`Missing Invoice Details !`);
        return;
      }

      // Invoice Header Validation
      if (invType === "JOB" && !jobId) {
        toast.error(`Job Id Missing !`);
        return;
      }
      if (invType === "QUOTATION" && !quoteId) {
        toast.error(`Quotation Id Missing !`);
        return;
      }
      validation = validateFields(
        {
          invNo,
          docType,
          paymentMethod,
        },
        [`invNo`, `docType`, `paymentMethod`],
      );
      if (!validation.isValid) {
        toast.error(`Missing : ${validation.emptyFields.join(", ")} !`);
        return;
      }

      // Invoice Payment Data Validation
      if (docType === `INVOICE`) {
        if (paymentMethod === `CASH`) {
          validation = validateFields(
            {
              cashAmount,
            },
            [`cashAmount`],
          );
        } else if (paymentMethod === `CARD`) {
          validation = validateFields(
            {
              cardAmount,
              cardType,
              cardDigits,
            },
            [`cardAmount`, `cardType`, `cardDigits`],
          );
        } else if (paymentMethod === `MIX`) {
          validation = validateFields(
            {
              cardAmount,
              cashAmount,
              bankAmount,
            },
            [`cardAmount`, `cashAmount`, `bankAmount`],
          );
        } else if (paymentMethod === `CREDIT`) {
          validation = validateFields({ downPayment, creditAmount, dueDate }, [
            `downPayment`,
            `creditAmount`,
            `dueDate`,
          ]);
        }
        if (!validation.isValid) {
          toast.error(`Missing : ${validation.emptyFields.join(", ")}`);
          return;
        }
      }

      const data = new FormData();
      data.append(`invNo`, invoiceData.invNo);
      data.append(`docType`, invoiceData.docType);
      data.append(`invType`, invoiceData.invType);
      data.append(`quoteId`, invoiceData.quoteId);
      data.append(`jobId`, invoiceData.jobId);
      data.append(`grossTotal`, invoiceData.grossTotal);
      data.append(`discount`, invoiceData.discount);
      data.append(`paid`, invoiceData.paid);
      data.append(`netTotal`, invoiceData.netTotal);
      data.append(`paymentMethod`, invoiceData.paymentMethod);
      data.append(`cashAmount`, invoiceData.cashAmount);
      data.append(`cardAmount`, invoiceData.cardAmount);
      data.append(`bankAmount`, invoiceData.bankAmount);
      data.append(`creditAmount`, invoiceData.creditAmount);
      data.append(`downPayment`, invoiceData.downPayment);
      data.append(`dueDate`, invoiceData.dueDate);
      data.append(`cardType`, invoiceData.cardType);
      data.append(`cardDigits`, invoiceData.cardDigits);
      data.append(`bankReference`, null);
      data.append(`note`, invoiceData.note);
      data.append(`userId`, userData?.user?.id);

      data.append(`invItems`, JSON.stringify(invoiceData?.rows));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/pos/terminal`,
        {
          method: `POST`,
          body: data,
        },
      );

      if (!res.ok) {
        const data = await res.json();

        toast.error(
          `${docType === `INVOICE` ? `Invoice` : `Quotation`} Failed !`,
        );

        if (data.error) {
          toast.warning(data.error);
        }

        return;
      }

      toast.success(`Saved !`);
      // router.push(`/pos/terminal/${invNo}`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
  };

  const btnDisableHandle = () => {
    const btnDisable =
      docType == `QUOTATION`
        ? false
        : paymentMethod == "CASH"
          ? cashReceived == 0 || !cashReceived || cashReceived < netTotal
          : paymentMethod == `MIX`
            ? Number(cashAmount) + Number(cardAmount) + Number(bankAmount) ==
                0 ||
              Number(cashAmount) + Number(cardAmount) + Number(bankAmount) <
                netTotal
            : paymentMethod == "CARD"
              ? cardType == `` || cardDigits == ``
              : paymentMethod == `CREDIT`
                ? dueDate == `` ||
                  downPayment === "" ||
                  Number(downPayment) < 0 ||
                  Number(downPayment) + Number(creditAmount) !=
                    Number(netTotal) ||
                  Number(creditAmount) > Number(netTotal)
                : false;

    return btnDisable;
  };

  const handlePay = () => {
    if (billEdit) {
      if (rows.length <= 0) {
        toast.warning(`Please Add Items !`);
        return;
      }

      if (customerState == 0 && !customerId) {
        toast.warning(`Please Select Customer !`);
        return;
      } else if (customerState == 1 && (!customerName || !customerPhone)) {
        toast.warning(`Enter Customer Details !`);
        return;
      }
    }

    setHeaderField(`billEdit`, !billEdit);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* invoice totals */}
      <fieldset
        className={`${!billEdit ? `cursor-not-allowed` : ``} flex flex-col bg-white rounded-xl shadow-md p-4`}
        disabled={!billEdit}
      >
        <div className="grid grid-cols-2 gap-2 items-center">
          <span className="pl-4 text-gray-400">Gross Total</span>
          <span className=" py-1 font-semibold px-4 ">
            {Number(grossTotal).toFixed(2)}
          </span>
        </div>

        <Separator />

        {paid ? (
          <>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="pl-4 text-gray-400">Advanced</span>
              <span className=" py-1 font-semibold px-4 ">
                {Number(paid).toFixed(2)}
              </span>
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
          <span className=" py-0.5 font-bold px-4 text-xl">
            {Number(netTotal).toFixed(2)}
          </span>
        </div>
      </fieldset>

      <div className="items-center flex gap-2">
        <Button
          name={
            pending
              ? `Processing...`
              : docType === `INVOICE`
                ? billEdit
                  ? `PAY`
                  : `EDIT BACK`
                : `SAVE`
          }
          wfull={true}
          pd={`py-3 px-4 font-bold text-xl`}
          bg={
            billEdit
              ? `bg-green-500 text-white hover:bg-green-600`
              : `bg-blue-500 text-white hover:bg-blue-600`
          }
          click={() => {
            if (docType === `INVOICE`) {
              handlePay();
            } else if (docType === `QUOTATION`) {
              handleCrud();
            }
          }}
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
          click={() => {
            resetCustomer();
            resetINVOICE();
          }}
        />
      </div>

      <div
        className={`
    bg-white rounded-xl overflow-hidden shadow-md
    transition-all duration-300 ease-in-out
    ${
      billEdit ? "max-h-0 opacity-0 p-0" : "max-h-250 opacity-100 p-4 space-y-4"
    }
  `}
      >
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
                  <NextInput
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
                  />

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
              pending
                ? `Processing...`
                : docType === `INVOICE`
                  ? `SAVE`
                  : `SAVE`
            }
            wfull={true}
            pd={`py-3 px-4 font-bold text-xl`}
            bg={
              btnDisableHandle()
                ? `bg-green-100`
                : `bg-green-500 text-white hover:bg-green-600`
            }
            disabled={btnDisableHandle()}
            click={() => handleCrud()}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
