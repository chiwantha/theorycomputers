"use client";

import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { Phone, MapPin, Globe } from "lucide-react";

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
          className="bg-white w-[210mm] shadow-md border-gray-200 border min-h-[297mm] flex rounded-xl flex-col text-gray-800
          "
        >
          {/* HEADER */}
          <div
            className="px-12 pt-10 pb-6
            "
          >
            <div className="flex justify-between">
              <div>
                <h1 className=" text-5xl font-black tracking-tight">THEORY</h1>

                <h2 className="text-xl tracking-[8px] ml-0.5 text-blue-600font-light ">
                  COMPUTERS
                </h2>

                <p className="text-gray-500 mt-2">
                  Your Official IT Solution Partner
                </p>

                <div className=" flex gap-6 mt-4 text-sm text-gray-600 flex-wrap  ">
                  <span className="flex gap-2 items-center">
                    <Phone size={15} />
                    075 517 8503
                  </span>

                  <span className="flex gap-2 items-center">
                    <MapPin size={15} />
                    Delgoda, Sri Lanka
                  </span>

                  <span className="flex gap-2 items-center">
                    <Globe size={15} />
                    theorycomputers.lk
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className="
                  bg-blue-500
                  text-white
                  px-8
                  py-5
                  rounded-2xl
                  shadow-lg
                  "
                >
                  <p
                    className="
                    text-3xl
                    font-black
                    "
                  >
                    INVOICE
                  </p>
                </div>

                <div
                  className="
                  mt-5
                  text-sm
                  text-gray-500
                "
                >
                  <p>
                    Invoice No :<b className="text-gray-800 mr-2">INV-000123</b>
                  </p>

                  <p>
                    Date :<b className="text-gray-800 mr-2">25 Jun 2026</b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* CUSTOMER */}
          <div className="grid gap-4 grid-cols-2 px-12 py-4">
            <div className="text-left flex gap-1 flex-col">
              <span className="capitalize font-semibold  text-blue-600">
                CUSTOMER
              </span>
              <div className="flex flex-col -space-y-1">
                <span>Kasun Chiwantha</span>
                <span>0788806670</span>
              </div>
            </div>
            <div className="text-right flex gap-1 flex-col">
              <span className="capitalize font-semibold  text-blue-600">
                PAYMENT
              </span>
              <div className="flex flex-col -space-y-1">
                <span>CASH</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* ITEMS */}
          <div
            className="px-12 my-8 flex-1
          "
          >
            <table className="w-full">
              <thead>
                <tr className=" border-b border-gray-200 ">
                  <th className=" text-left pb-6">No</th>
                  <th className=" text-left pb-6">Item Name</th>
                  <th className="text-center pb-6">Qty</th>
                  <th className=" text-right pb-6">Price</th>
                  <th className=" text-right pb-6">Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className=" border-b border-gray-100">
                    <td className="text-left">{index + 1}</td>
                    <td className="py-2 flex flex-col -space-y-1">
                      <span className="font-semibold tracking-normal">
                        {item.name}
                      </span>
                      <span className="capitalize text-sm text-gray-400">
                        3 Month Supplier Warranty
                      </span>
                    </td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-right">
                      {item.price.toLocaleString()}
                    </td>
                    <td className="text-right font-semibold">
                      {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2} className="py-2 border-b border-gray-200">
                    <span>Sub Total</span>
                  </td>
                  <td
                    colSpan={1}
                    className="text-right py-2 border-b border-gray-200"
                  >
                    <b>{subtotal.toLocaleString()}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2} className="py-2 border-b border-gray-200">
                    <span>Discount</span>
                  </td>
                  <td
                    colSpan={1}
                    className="text-right py-2 border-b border-gray-200"
                  >
                    <b>{discount.toLocaleString()}</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2} className="py-2 border-b border-gray-200">
                    <span>Net Total</span>
                  </td>
                  <td
                    colSpan={1}
                    className="text-right py-2 border-b border-gray-200"
                  >
                    <b>{total.toLocaleString()}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className=" mt-auto border-t px-12 py-8 flex justify-between ">
            <div>
              <p className="font-bold">Thank you for your business</p>

              <p className="text-sm text-gray-500">
                Computer Sales • Repairs • Networking
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">Authorized Signature</p>

              <div className=" w-40 border-b mt-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
