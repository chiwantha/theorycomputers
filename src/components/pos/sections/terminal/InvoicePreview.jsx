"use client";

import Button from "@/components/common/button/Button";
import Separator from "@/components/common/separator/Separator";
import { useCUSTOMERStore } from "@/store/customerStore";
import { useINVOICEStore } from "@/store/invoiceStore";
import { useSession } from "next-auth/react";
import Image from "next/image";

const DumitemsList = [
  {
    name: "Gaming Mouse",
    qty: 2,
    price: 5000,
    total: 10000,
    warranty: `3 Month SUpplier Warranty`,
  },
  {
    name: "Gaming Mouse",
    qty: 2,
    price: 5000,
    total: 10000,
    warranty: `3 Month SUpplier Warranty`,
  },
  {
    name: "Mechanical Keyboard",
    qty: 1,
    price: 7500,
    total: 7500,
    warranty: `3 Month SUpplier Warranty`,
  },
  {
    name: "SSD 1TB",
    qty: 1,
    price: 18000,
    total: 18000,
    warranty: `3 Month SUpplier Warranty`,
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
    warranty: `4 Month SUpplier Warranty`,
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
    name: "SSD 1TB",
    qty: 1,
    price: 18000,
    total: 18000,
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

export default function InvoicePreview({ additianalData }) {
  const { data: cashierData } = useSession();

  const customerName = useCUSTOMERStore((state) => state.customerName);
  const customerPhone = useCUSTOMERStore((state) => state.customerPhone);

  const invNo = useINVOICEStore((state) => state.invNo);
  const docType = useINVOICEStore((state) => state.docType);
  const paymentMethod = useINVOICEStore((state) => state.paymentMethod);
  const date = useINVOICEStore((state) => state.date);
  const invType = useINVOICEStore((state) => state.invType);
  const jobId = useINVOICEStore((state) => state.jobId);
  const quoteId = useINVOICEStore((state) => state.quoteId);
  const grossTotal = useINVOICEStore((state) => state.grossTotal);
  const discount = useINVOICEStore((state) => state.discount);
  const netTotal = useINVOICEStore((state) => state.netTotal);
  const rows = useINVOICEStore((state) => state.rows);

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
          className="bg-white w-[210mm] shadow-md border-gray-200 border min-h-[297mm]
   flex relative rounded-xl flex-col p-6 text-gray-800 space-y-4"
        >
          {/* Header — unchanged */}
          <div className="w-full gap-4 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative aspect-square w-16">
                <Image
                  alt="logo.png"
                  src={`/app/logo.png`}
                  fill
                  className="object-contain object-center"
                  sizes="33vw"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-600 uppercase tracking-tight">
                  Theory Computers
                </span>
                <span className="text-xs font-bold text-gray-400 capitalize">
                  Your every it solution partner
                </span>
              </div>
            </div>
            <div className="bg-blue-500 rounded-b-xl absolute text-white text-2xl h-22 right-6 top-0 flex items-center justify-center font-semibold px-12">
              {docType === `INVOICE` ? `INVOICE` : `QUOTATION`}
            </div>
          </div>

          {/* Invoice Data — unchanged */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize">
                Customer
              </span>
              <Separator />
              <span className="text-xs text-gray-600 line-clamp-1 text-ellipsis">
                {customerName || `Customer Name`}
              </span>
              <span className="text-xs text-gray-600">
                {customerPhone || `Unknown`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize">
                Document
              </span>
              <Separator />
              <span className="text-xs text-gray-600">
                {invNo
                  ? `${invNo} ${invType === `JOB` ? ` / JOB ${jobId} ` : ``}`
                  : `0`}
              </span>
              <span className="text-xs text-gray-600 capitalize">
                Cashier : {cashierData?.user?.name.split(" ")[0] || `Unknown`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize">
                Payment
              </span>
              <Separator />
              <span className="text-xs text-gray-600">
                Method : {paymentMethod || `Unknown`}
              </span>
              <span className="text-xs text-gray-600">
                {date || `0000 JAN 00`}
              </span>
            </div>
          </div>

          {/* Table — compact rows */}
          <table className="rounded-xl overflow-hidden text-sm w-full">
            <thead className="bg-gray-100">
              <tr className="text-gray-600">
                <th className="py-1 px-2 font-medium text-sm">No</th>
                <th className="py-1 px-2 font-medium text-sm text-left">
                  Item
                </th>
                <th className="py-1 px-2 font-medium text-sm text-center">
                  Price
                </th>
                <th className="py-1 px-2 font-medium text-sm">Quantity</th>
                <th className="py-1 px-2 font-medium text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 ? `bg-gray-50` : `bg-white`} text-gray-600`}
                  >
                    <td className="text-center text-sm py-0.5">{index + 1}</td>
                    <td className="px-3 py-1">
                      <div className="flex flex-col">
                        <span className="text-sm">{row.itemName}</span>
                        {row.warrantyId && (
                          <span className="text-[12px] text-blue-500">
                            {row.warrantyName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-1 text-center text-sm">
                      {row.selling}
                    </td>
                    <td className="px-3 py-1 text-center text-sm">
                      {row.quantity}
                    </td>
                    <td className="pr-3 py-1 text-center text-sm">
                      {row.lineTotal}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-5 text-center " colSpan={5}>
                    No Items Found !
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals — unchanged */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Gross
              </span>
              <span className="text-xl font-semibold text-blue-700 mt-0.5">
                {grossTotal}
              </span>
            </div>
            <div className="flex flex-col p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                Discount
              </span>
              <span className="text-xl font-semibold text-red-600 mt-0.5">
                {discount}
              </span>
            </div>
            <div className="flex flex-col p-3 bg-green-600 rounded-xl">
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                Net total
              </span>
              <span className="text-xl font-semibold text-white mt-0.5">
                {netTotal}
              </span>
            </div>
          </div>

          {/* ── FOOTER: mt-auto pins this block to the bottom always ── */}
          <div className="mt-auto flex flex-col gap-3">
            {/* Instructions */}
            <div className="bg-gray-100 rounded-xl p-3">
              <div className="text-[12px] grid grid-cols-2 gap-x-3 gap-y-1">
                <span>🟢 14 days required for warranty claims.</span>
                <span>
                  🟢 Burn marks, physical damage & corrosion void warranty.
                </span>
                <span className="col-span-2">
                  🟢 Warranty covers manufacturer defects only. Damage from
                  negligence, misuse, power fluctuation, lightning, natural
                  disaster, or accident is not covered. Repairs due to such
                  causes are subject to charges for labor, time, and material.
                </span>
                <span>
                  🟢 Goods once sold are not returnable under any circumstances.
                </span>
                <span>🟢 Warranty void if sticker is removed or damaged.</span>
              </div>
            </div>

            {/* Signs */}
            <div className="grid grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center">
                <div className="border-dashed border-b h-12 w-full"></div>
                <span className="text-xs mt-1">Cashier</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-dashed border-b h-12 w-full"></div>
                <span className="text-xs mt-1">Management</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-dashed border-b h-12 w-full"></div>
                <span className="text-xs mt-1">Received By</span>
              </div>
            </div>

            {/* K-Chord */}
            <div className="w-full items-center flex text-xs text-blue-500 font-bold justify-center pb-1">
              System By : K-Chord (Pvt) Ltd - 078 880 6670
            </div>
          </div>
          {/* end footer */}
        </div>
        {/* end invoice */}
      </div>
    </div>
  );
}
