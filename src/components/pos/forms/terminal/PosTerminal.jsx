"use client";

import { useState, useMemo, useEffect } from "react";
import ProductListGrid from "../../grid/productlist/ProductListGrid";
import CartCard from "../../cards/cartcard/CartCard";
import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import Separator from "@/components/common/separator/Separator";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { toast } from "react-toastify";
import SelectCustomer from "../customer/SelectCustomer";
import SelectTrnDoc from "../trndoc/SelectTrnDoc";

const PosTerminal = ({ customersList, itemsList, quotationList }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-full h-[calc(100vh-92px)]">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <SelectTrnDoc />

          <SelectCustomer customersList={customersList} />
        </div>

        <ProductListGrid itemsList={itemsList} />
      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 rounded-xl shadow w-full lg:max-w-110 h-[calc(100vh-92px)] flex flex-col">
        {/* TAB */}
        <div className="flex mb-3 bg-gray-100 p-1 rounded-lg">
          {["invoice", "quotation"].map((t) => (
            <button
              key={crypto.randomUUID(5)}
              // onClick={() => setTab(t)}
              className={`flex-1 py-1 rounded ${
                "t" === "t" ? "bg-white shadow font-bold" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CART */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {[].map((item) => (
            <CartCard
              key={item.id}
              name={item.name}
              selling={item.selling}
              quantity={item.qty}
              // quantityPlus={() => increaseQty(item.id)}
              // quantityMinus={() => decreaseQty(item.id)}
              // removeItem={() => removeItem(item.id)}
            />
          ))}
        </div>

        {/* TOTALS */}
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Gross</span>
            <span>LKR 000</span>
          </div>
          <div className="flex justify-between text-red-400">
            <span>Discount</span>
            <span>- 000</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net</span>
            <span>LKR 000</span>
          </div>
        </div>

        {/* PAYMENT */}
        {"invoice" === "invoice" && (
          <>
            <Separator />

            <div className="flex gap-2">
              {["cash", "card", "mix"].map((m) => (
                <Button
                  key={m}
                  name={m}
                  // click={() => setPaymentMethod(m)}
                  bg={
                    "paymentMethod" === "paymentMethod"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }
                  wfull
                />
              ))}
            </div>

            {/* CASH */}
            {"cash" === "cash" && (
              <div className="flex flex-col gap-2 mt-2">
                <NextInput
                  label={`Cash Received`}
                  placeholder="Cash Received"
                />

                <div className="flex justify-between">
                  <span>Balance</span>
                  <span>LKR 000</span>
                </div>
              </div>
            )}

            {/* MIX */}
            {false === "mix" && (
              <div className="flex flex-col gap-2 mt-2">
                <NextInput label={`Cash Amount`} placeholder="Cash" />
                <NextInput label={`Card Amount`} placeholder="Card" />
                <NextInput label={`Bank Amount`} placeholder="Bank" />

                <div className="flex justify-between">
                  <span>Balance</span>
                  <span>LKR 000</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ACTIONS */}
        <div className="flex gap-2 mt-3">
          <Button
            name={"invoice" === "invoice" ? "Save & Pay" : "Save Quote"}
            wfull
            bg="bg-green-500 text-white"
          />
          <Button name="Reset" bg="bg-red-400 text-white" />
        </div>
      </div>
    </div>
  );
};

export default PosTerminal;
