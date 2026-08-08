"use client";

import Button from "@/components/button/Button";
import Separator from "@/components/separator/Separator";
import { formatDateTimeYear } from "@/lib/utils";
import { format_date } from "@/lib/validation";
import { ChevronLeft, Printer } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const handlePrint = () => {
  const printContent = document.getElementById("invoice");

  const originalContent = document.body.innerHTML;

  document.body.innerHTML = printContent.outerHTML;

  window.print();

  document.body.innerHTML = originalContent;

  window.location.reload();
};

const InvoicePreview = ({ invoiceData, backURL }) => {
  const router = useRouter();
  const { data: cashierData } = useSession();
  const [invData, setInvoiceData] = useState(invoiceData?.data);
  const [payments, setPayments] = useState({
    jobAdvance: 0,
    invAdvance: 0,
  });

  useEffect(() => {
    const JobdownPayment =
      invData?.payments?.find((payment) => payment.doc === "JOB")?.amount ?? 0;

    const InvoicedownPayment =
      invData?.payments?.find(
        (payment) =>
          payment.doc === "INVOICE" && payment.payment_type === "DOWN",
      )?.amount ?? 0;

    setPayments({
      jobAdvance: JobdownPayment,
      invAdvance: InvoicedownPayment,
    });
  }, [invData]);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="w-full border-gray-200 border rounded-xl min-h-87.5 pattern-bg"></div>
      <div className="flex flex-col xl:flex-row gap-4 -mt-60">
        {/* Buttons */}
        <div className="flex gap-4 items-center xl:flex-col">
          <Button
            name={<ChevronLeft size={30} />}
            // link={`/pos/terminal`}
            click={() => {
              router.push(backURL || `/terminal`);
            }}
            pd={`py-4 px-4 flex items-center justify-center`}
            bg={`bg-gray-200 text-gray-500 hover:bg-gray-300 aspect-square `}
            fg={`font-bold text-lg`}
          />
          <Button
            name={<Printer size={30} />}
            click={handlePrint}
            pd={`py-4 px-4 flex items-center justify-center`}
            bg={`bg-green-500 text-white hover:bg-green-600`}
            fg={`font-bold text-lg`}
          />
        </div>

        {/* A4 */}
        <div
          id="invoice"
          className="bg-white w-[210mm] shadow-md border-gray-200 border min-h-[297mm]
                    flex relative rounded-xl flex-col p-6 text-gray-800 space-y-4"
        >
          {/* Header — unchanged */}
          <div className="w-full gap-4 flex items-center justify-between">
            <div className="flex gap-4 items-center w-full">
              <div className="relative aspect-square w-24">
                <Image
                  alt="logo.png"
                  src={`/app/logo.png`}
                  fill
                  className="object-contain object-center"
                  sizes="33vw"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-2xl font-bold text-gray-600 uppercase tracking-tight">
                  Theory Computers
                </span>
                <span className="text-xs font-bold text-blue-600 capitalize pl-0.5">
                  Your Trusted IT Solutions Partner
                </span>
                <div className="flex gap-2 items-center mt-2  w-full text-gray-600">
                  <span className=" py-1 px-4 text-[13px] rounded-lg bg-gray-100 w-full text-nowrap text-center">
                    075 517 8503 - 077 115 2824
                  </span>
                  <span className=" py-1 px-4 text-sm rounded-lg bg-gray-100 w-full text-nowrap text-center">
                    www.theorycomputers.lk
                  </span>
                  <span className=" py-1 px-4 text-[13px] rounded-lg bg-gray-100 w-full text-nowrap text-center">
                    No 154/D Kanduboda, Delgoda
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500 rounded-b-xl absolute text-white text-2xl h-16.25 right-6 top-0 flex items-center justify-center font-semibold px-12">
              {invData?.header?.doc_type === `INVOICE`
                ? `INVOICE`
                : `QUOTATION`}
            </div>
          </div>

          {/* Invoice Data — unchanged */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize">
                Customer
              </span>
              <Separator />
              <span className="text-xs text-gray-600 line-clamp-1 text-ellipsis capitalize">
                {invData?.header?.customerName || `Customer Name`}
              </span>
              <span className="text-xs text-gray-600">
                {invData?.header?.phone || `Unknown`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-semibold tracking-tighter capitalize">
                Document
              </span>
              <Separator />
              <span className="text-xs text-gray-600">
                {invData?.header?.inv_no
                  ? `${invData?.header?.inv_no} ${invData?.header?.inv_type === `JOB` ? ` / JOB#${invData?.header?.job_id} ` : ``}`
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
                {invData?.header?.doc_type === `INVOICE`
                  ? invData?.header?.settlement === `CREDIT`
                    ? `CREDIT / ${Number(invData?.header?.credit_amount || 0).toFixed(2)}
                `
                    : invData?.header?.settlement || `Unknown`
                  : `-`}
              </span>
              <span className="text-xs text-gray-600">
                {invData?.header?.doc_type === `INVOICE`
                  ? formatDateTimeYear(invData?.header?.created_at) ||
                    `0000 JAN 00`
                  : `Valid Until ${format_date(invData?.header?.quote_expiry_date)}`}
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
              {invData?.details.length > 0 ? (
                invData?.details.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 ? `bg-gray-50` : `bg-white`} text-gray-600`}
                  >
                    <td className="text-center text-sm py-0.5">{index + 1}</td>
                    <td className="px-3 py-1">
                      <div className="flex flex-col">
                        <span className="text-sm">{row.item_name}</span>
                        <div className="flex gap-4">
                          {row.warranty_id && (
                            <span className="text-[12px] text-blue-500">
                              {row.warranty_name}
                            </span>
                          )}
                          {row.warranty_id && row.note && <span> - </span>}
                          {row.note && (
                            <span className="text-[12px] text-gray-500 italic">
                              {row.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-1 text-center text-sm">
                      {Number(row.unit_selling).toFixed(2)}
                    </td>
                    <td className="px-3 py-1 text-center text-sm">
                      {row.quantity}
                    </td>
                    <td className="pr-3 py-1 text-center text-sm">
                      {Number(row.line_total).toFixed(2)}
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
          <div
            className={`grid grid-cols-3 gap-3 ${payments.invAdvance && payments.jobAdvance ? `grid-cols-5` : payments.jobAdvance ? `grid-cols-4` : payments.invAdvance ? `grid-cols-4` : `grid-cols-3`}`}
          >
            <div className="flex flex-col p-3 bg-blue-50 border border-blue-200 rounded-xl -space-y-0.5">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Gross Total
              </span>
              <span className="text-xl font-semibold text-blue-700 mt-0.5">
                {Number(invData?.header?.gross_total || 0).toFixed(2)}
              </span>
            </div>
            {payments.jobAdvance ? (
              <div className="flex flex-col p-3 bg-red-50 border border-red-200 rounded-xl -space-y-0.5">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                  Job Adv
                </span>
                <span className="text-lg font-semibold text-red-600 mt-0.5">
                  {Number(payments.jobAdvance || 0).toFixed(2)}
                </span>
              </div>
            ) : (
              false
            )}
            <div className="flex flex-col p-3 bg-red-50 border border-red-200 rounded-xl -space-y-0.5">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                Discount
              </span>
              <span className="text-xl font-semibold text-red-600 mt-0.5">
                {Number(invData?.header?.discount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col p-3 bg-green-600 rounded-xl -space-y-0.5">
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                Net total
              </span>
              <span className="text-xl font-semibold text-white mt-0.5">
                {Number(invData?.header?.net_total || 0).toFixed(2)}
              </span>
            </div>
            {payments.invAdvance ? (
              <div className="flex flex-col p-3 bg-green-50 border border-green-500 rounded-xl -space-y-0.5">
                <span className="text-xs font-semibold text-green-500 uppercase tracking-wide">
                  Down Payment
                </span>
                <span className="text-xl font-semibold text-green-500 mt-0.5">
                  {Number(payments.invAdvance || 0).toFixed(2)}
                </span>
              </div>
            ) : (
              false
            )}
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
};

export default InvoicePreview;
