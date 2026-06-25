"use client";

import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { Phone, MapPin, Globe } from "lucide-react";
import Image from "next/image";

const items = [
  {
    name: "Gaming Mouse",
    qty: 2,
    price: 5000,
    total: 10000,
  },
  {
    name: "Mechanical Keyboard",
    qty: 1,
    price: 7500,
    total: 7500,
  },
  {
    name: "SSD 1TB",
    qty: 1,
    price: 18000,
    total: 18000,
  },
  {
    name: "Gaming Mouse",
    qty: 2,
    price: 5000,
    total: 10000,
  },
  {
    name: "Mechanical Keyboard",
    qty: 1,
    price: 7500,
    total: 7500,
  },
  {
    name: "SSD 1TB",
    qty: 1,
    price: 18000,
    total: 18000,
  },
  {
    name: "Gaming Mouse",
    qty: 2,
    price: 5000,
    total: 10000,
  },
];
const handlePrint = () => {
  const printContent = document.getElementById("invoice");

  const originalContent = document.body.innerHTML;

  document.body.innerHTML = printContent.outerHTML;

  window.print();

  document.body.innerHTML = originalContent;

  window.location.reload();
};

export default function InvoicePreview() {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const discount = 500;

  const total = subtotal - discount;

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="bg-white w-full rounded-xl min-h-87.5"></div>
      <div className="flex flex-col gap-6 -mt-60">
        {/* Buttons */}
        <div className="flex gap-4 items-center ">
          <Button
            name={`PRINT`}
            click={handlePrint}
            pd={`py-8 px-4 flex items-center justify-center`}
            bg={`bg-green-500 text-white hover:bg-green-600`}
            fg={`font-bold text-lg`}
            wfull={true}
          />
          <Button
            name={`TERMINAL`}
            link={`/pos/terminal`}
            pd={`py-8 px-4 flex items-center justify-center`}
            bg={`bg-gray-200 text-gray-500 hover:bg-gray-300`}
            fg={`font-bold text-lg`}
            wfull={true}
          />
          <Button
            name={`DASH`}
            link={`/pos`}
            pd={`py-8 px-4 flex items-center justify-center`}
            fg={`font-bold text-lg`}
            wfull={true}
          />
        </div>

        {/* Preview */}

        {/* A4 */}
        <div
          id="invoice"
          className="bg-white w-[210mm] shadow-md border-gray-200 border min-h-[297mm] flex relative rounded-xl flex-col p-10 text-gray-800 space-y-10
          "
        >
          <div className="w-full gap-4 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative aspect-square w-17.5">
                <Image
                  alt="logo.png"
                  src={`/app/logo.png`}
                  fill
                  className="object-contain object-center"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-600 uppercase tracking-tight">
                  Theory Computers
                </span>
                <span className="text-sm font-bold text-gray-400 capitalize">
                  Your every it solution partner
                </span>
              </div>
            </div>
            <div className="bg-blue-500 rounded-b-xl absolute text-white text-2xl h-[120px] right-10 top-0 flex items-center justify-center font-semibold px-12">
              INVOICE
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize text-xl">
                Customer
              </span>
              <Separator />
              <span className="text-sm text-gray-600 line-clamp-1 text-ellipsis">
                Kasun Chiwantha
              </span>
              <span className="text-sm text-gray-600">0788806670</span>
            </div>
            <div className="flex flex-col ">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize text-xl">
                Document
              </span>
              <Separator />
              <span className="text-sm text-gray-600">INV-1056-FG75R6</span>
              <span className="text-sm text-gray-600">Cashier : Dimuthu</span>
            </div>
            <div className="flex flex-col ">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize text-xl">
                Payment
              </span>
              <Separator />
              <span className="text-sm text-gray-600">Method : CASH</span>
              <span className="text-sm text-gray-600">2026 JUNE 26</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
