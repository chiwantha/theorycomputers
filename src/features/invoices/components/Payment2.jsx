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
  const [isOpenPayment, setisOpenPayment] = useState(false);

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
        click={() => setisOpenPayment(true)}
      />

      <Drawer
        button={`Pay`}
        title={`My Payment`}
        trigger={false}
        open={isOpenPayment}
        setOpen={setisOpenPayment}
        onCloseCallback={() => alert(`Closing !`)}
        onOpenCallback={() => alert(`Opening !`)}
      />
    </div>
  );
};

export default PaymentSection2;
