"use client";
import Button from "@/components/button/Button";
import Separator from "@/components/separator/Separator";
import { useINVOICEStore } from "@/store/invoiceStore";
import { FaRupeeSign } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { GiReceiveMoney } from "react-icons/gi";
import { useEffect, useState } from "react";

import { useCUSTOMERStore } from "@/store/customerStore";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Drawer from "@/components/drawer/Drawer";
import PaymentForm from "./PaymentForm";

const PaymentSection2 = () => {
  const router = useRouter();
  const { data: userData } = useSession();
  const [pending, setPending] = useState(false);

  const docType = useINVOICEStore((state) => state.docType);

  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const paid = useINVOICEStore((state) => state.paid);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);

  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const downPayment = useINVOICEStore((state) => state.downPayment);

  const setDiscount = useINVOICEStore((state) => state.setDiscount);
  const billEdit = useINVOICEStore((state) => state.billEdit);
  const setHeaderField = useINVOICEStore((state) => state.setHeaderField);
  const resetINVPayment = useINVOICEStore((state) => state.resetINVPayment);

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
        click={() => setHeaderField("billEdit", false)}
      />

      <Drawer
        button={`Pay`}
        trigger={false}
        form={<PaymentForm />}
        open={!billEdit}
        setOpen={(e) => setHeaderField("billEdit", !e)}
        // onCloseCallback={() => alert(`Closing !`)}
        // onOpenCallback={() => alert(`Opening !`)}
        responsiveWidths={`md:min-w-[62%] min-w-screen lg:min-w-[45%] xl:min-w-[40%]`}
      />
    </div>
  );
};

export default PaymentSection2;
