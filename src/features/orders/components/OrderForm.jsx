"use client";
import AniDiv from "@/components/animatedDiv/AniDiv";
import SelectCustomer from "@/features/customer/components/SelectCustomer";
import InvoiceRow from "@/features/invoices/components/InvoiceRow";
import PaymentSection2 from "@/features/invoices/components/Payment2";
import React, { useState } from "react";
import SelectDelivary from "./SelectDelivary";
import NextInput from "@/components/form/nextinput/NextInput";
import Separator from "@/components/separator/Separator";
import ValueDisplay from "@/components/valuedisplay/ValueDisplay";
import { generateDocNo } from "@/lib/utils";
import OrderRow from "./OrderRow";
import { useORDERStore } from "@/store/ordStore";
import Button from "@/components/button/Button";

const OrderForm = ({ form_props }) => {
  const { customersList, categoriesList, brandsList, itemsList, warrantyList } =
    form_props || {};

  const delivary = useORDERStore((state) => state.delivary);
  const note = useORDERStore((state) => state.note);

  const setHeaderField = useORDERStore((state) => state.setHeaderField);

  const [courier, setCourier] = useState({
    delivary: false,
    courierId: null,
    delivaryCharges: 0,
  });
  return (
    <div className="flex flex-col gap-4">
      {/* Top Line */}
      <div className="grid grid-cols-3 gap-4">
        {/* Customer */}
        <AniDiv delayIndex={1}>
          <SelectCustomer customersList={customersList} />
        </AniDiv>

        {/* Document Data */}
        <div className="grid grid-cols-2 gap-4">
          <AniDiv
            delayIndex={2}
            className={`flex flex-col justify-center p-4 bg-blue-500 rounded-xl shadow-md`}
          >
            <ValueDisplay
              title={`Order No`}
              value={generateDocNo("ORD")}
              titleClassName={`text-gray-100`}
              valueClassName={`text-white`}
            />
          </AniDiv>
          <AniDiv
            delayIndex={3}
            className={`rounded-xl grid grid-cols-2 bg-gray-200 shadow-md`}
          >
            <button
              className={`px-4 py-2 rounded-lg transition-colors  ${
                delivary ? "bg-green-500 text-white" : "text-gray-600"
              }`}
              onClick={() => setHeaderField(`delivary`, true)}
            >
              Delivary
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                !delivary ? "bg-green-500 text-white" : "text-gray-600"
              }`}
              onClick={() => setHeaderField(`delivary`, false)}
            >
              Pickup
            </button>
          </AniDiv>
        </div>

        {/* Order Note */}
        <AniDiv
          delayIndex={4}
          className={`shadow-md bg-white border border-gray-300 rounded-xl overflow-hidden p-4`}
        >
          <NextInput
            textarea={true}
            placeholder={`Order Note !`}
            name={`orderNote`}
            textareaRows={3}
            inputClassName={`bg-white resize-none`}
            value={note}
            onChange={(e) => setHeaderField(`note`, e.target.value)}
          />
        </AniDiv>
      </div>

      {/* Order Row */}
      <AniDiv
        delayIndex={5}
        className={`bg-white p-4 rounded-xl shadow-md overflow-hidden`}
      >
        <OrderRow item_list={itemsList} warranty_list={warrantyList} />
      </AniDiv>

      {/* Action Btn */}
      <AniDiv delayIndex={6}>
        <Button
          name={`Place Order`}
          bg={`bg-green-400 text-white hover:bg-green-500`}
          click={() => {
            const state = useORDERStore.getState();

            const cleanObject = Object.fromEntries(
              Object.entries(state).filter(
                ([key, value]) => typeof value !== "function",
              ),
            );

            alert(JSON.stringify(cleanObject, null, 2));
          }}
        />
      </AniDiv>
    </div>
  );
};

export default OrderForm;
