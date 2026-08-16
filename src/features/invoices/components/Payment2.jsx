"use client";
import Button from "@/components/button/Button";
import Separator from "@/components/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import { FaRupeeSign } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import NextInput from "@/components/form/nextinput/NextInput";
import { useEffect, useState } from "react";
import { RiVisaLine } from "react-icons/ri";
import { FaCcMastercard } from "react-icons/fa6";
import { RefreshCcw } from "lucide-react";
import { useCUSTOMERStore } from "@/store/customerStore";
import { validateFields } from "@/lib/validation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { generateDocNo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Drawer from "@/components/drawer/Drawer";

const PaymentSection2 = () => {
  const router = useRouter();
  const { data: userData } = useSession();
  const [pending, setPending] = useState(false);

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
  const quoteExpiryDate = useINVOICEStore((state) => state.quoteExpiryDate);

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
    setPending(true);

    try {
      let validation;
      const customerData = useCUSTOMERStore.getState();
      const invoiceData = useINVOICEStore.getState();
      console.log(customerData);

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

          if (!row.quantity) {
            toast.error(`Missing Quantity on ${row?.itemName} !`);
            return;
          }

          if (row.serial && docType === `INVOICE`) {
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
      if (invType === "QUOTE" && !quoteId) {
        toast.error(`Quotation Id Missing !`);
        return;
      }
      validation = validateFields(
        {
          docType,
          paymentMethod,
        },
        [`docType`, `paymentMethod`],
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
          if (
            Number(cardAmount) + Number(cashAmount) + Number(bankAmount) <
            netTotal
          ) {
            toast.error(`Insuficent Funds !`);
            return;
          }
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

      if (docType === `QUOTATION`) {
        if (!quoteExpiryDate || quoteExpiryDate == ``) {
          toast.error(`Quotation Expiary Missing !`);
          return;
        }
      }

      const data = new FormData();
      data.append(`docType`, invoiceData.docType);
      data.append(`invType`, invoiceData.invType);
      data.append(`quoteId`, invoiceData.quoteId);
      data.append(`jobId`, invoiceData.jobId);
      data.append(`customerState`, customerData.customerState);
      data.append(`customerId`, customerData.customerId);
      data.append(`customerName`, customerData.customerName);
      data.append(`customerPhone`, customerData.customerPhone);
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
      data.append(`quoteExpiryDate`, invoiceData.quoteExpiryDate);
      data.append(`cardType`, invoiceData.cardType);
      data.append(`cardDigits`, invoiceData.cardDigits);
      data.append(`bankReference`, null);
      data.append(`note`, invoiceData.note);
      data.append(`userId`, userData?.user?.id);

      data.append(`invItems`, JSON.stringify(invoiceData?.rows));

      const res = await fetch(`/api/pos/terminal`, {
        method: `POST`,
        body: data,
      });

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

      const response = await res.json();
      // resetINVOICE();
      // resetCustomer();
      toast.success(`Saved !`);
      router.push(`/pos/terminal/${response?.invNo}`);
    } catch (err) {
      console.log("Operation Failed:", err);
      toast.error("Something went wrong !");
    } finally {
      setPending(false);
    }
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

      <Drawer
        button={`Pay`}
        title={`My Payment`}
        callback={() => alert(`Opened !`)}
        onCloseCallback={() => alert(`Closing !`)}
      />
    </div>
  );
};

export default PaymentSection2;
