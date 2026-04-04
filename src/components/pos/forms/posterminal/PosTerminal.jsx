"use client";

import { useState, useMemo, useEffect } from "react";
import ProductListGrid from "../../grid/productlist/ProductListGrid";
import SelectCustomer from "../customer/SelectCustomer";
import CartCard from "../../cards/cartcard/CartCard";
import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";
import Separator from "@/components/common/separator/Separator";
import NextInput from "@/components/common/form/nextinput/NextInput";
import { toast } from "react-toastify";

const PosTerminal = ({ customersList, itemsList, quotationList }) => {
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState("invoice");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // 🔥 ONLY RAW USER INPUT
  const [paymentInput, setPaymentInput] = useState({
    cash_received: 0,
    card: 0,
    bank: 0,
  });

  // 🧮 TOTALS (DERIVED)
  const totals = useMemo(() => {
    const gross = cart.reduce((s, i) => s + i.selling * i.qty, 0);
    const discount = cart.reduce((s, i) => s + (i.discount || 0) * i.qty, 0);
    const net = gross - discount;

    return { gross, discount, net };
  }, [cart]);

  // 💳 PAYMENT (DERIVED)
  const paymentData = useMemo(() => {
    if (tab !== "invoice") return null;

    const net = totals.net;

    if (paymentMethod === "cash") {
      return {
        paid_amount: net,
        cash_received: paymentInput.cash_received || 0,
        cash: net,
        card: null,
        bank: null,
        balance: (paymentInput.cash_received || 0) - net,
        method: "cash",
      };
    }

    if (paymentMethod === "card") {
      return {
        paid_amount: net,
        cash_received: null,
        cash: null,
        card: net,
        bank: null,
        balance: 0,
        method: "card",
      };
    }

    if (paymentMethod === "mix") {
      const cash = paymentInput.cash_received || 0;
      const card = paymentInput.card || 0;
      const bank = paymentInput.bank || 0;

      const totalPaid = cash + card + bank;
      const balance = totalPaid - net;

      return {
        paid_amount: net,
        cash_received: cash,
        cash,
        card,
        bank,
        balance,
        method: "mix",
      };
    }

    return null;
  }, [paymentMethod, paymentInput, totals.net, tab]);

  // 🔄 RESET INPUTS WHEN METHOD CHANGES
  useEffect(() => {
    setPaymentInput({
      cash_received: 0,
      card: 0,
      bank: 0,
    });
  }, [paymentMethod]);

  // 🛒 CART OPS
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      return exist
        ? prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
        : [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
      ),
    );

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  // 💾 SAVE
  const handleSave = () => {
    if (!customer) return alert("Select customer");
    if (!cart.length) return alert("Cart empty");
    if (paymentMethod === `cash` || paymentMethod === `mix`) {
      if (paymentData.balance < 0) {
        toast.error("Insufficient payment");
        return;
      }
    }

    const items = cart.map((i) => ({
      id: i.id,
      qty: i.qty,
      selling: i.selling,
      total: i.selling * i.qty,
    }));

    const data = {
      type: tab,
      customer,
      items,
      totals,
      payment: paymentData,
      date: new Date().toISOString(),
    };

    // console.log(data);
    toast.warning(`Trasaction Bloked !`);
    // alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-full h-[calc(100vh-92px)]">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <NextDropdown
              items={quotationList || []}
              label="Select Quotation"
            />
            <Button
              name="Load Quotation"
              wfull
              bg="bg-blue-500 text-white mt-2"
            />
          </div>

          <SelectCustomer
            customersList={customersList}
            customer={customer}
            setCustomer={setCustomer}
          />
        </div>

        <ProductListGrid itemsList={itemsList} addToCart={addToCart} />
      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 rounded-xl shadow w-full lg:max-w-110 h-[calc(100vh-92px)] flex flex-col">
        {/* TAB */}
        <div className="flex mb-3 bg-gray-100 p-1 rounded-lg">
          {["invoice", "quotation"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1 rounded ${
                tab === t ? "bg-white shadow font-bold" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CART */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.map((item) => (
            <CartCard
              key={item.id}
              name={item.name}
              selling={item.selling}
              quantity={item.qty}
              quantityPlus={() => increaseQty(item.id)}
              quantityMinus={() => decreaseQty(item.id)}
              removeItem={() => removeItem(item.id)}
            />
          ))}
        </div>

        {/* TOTALS */}
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Gross</span>
            <span>LKR {totals.gross.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-400">
            <span>Discount</span>
            <span>-{totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Net</span>
            <span>LKR {totals.net.toFixed(2)}</span>
          </div>
        </div>

        {/* PAYMENT */}
        {tab === "invoice" && (
          <>
            <Separator />

            <div className="flex gap-2">
              {["cash", "card", "mix"].map((m) => (
                <Button
                  key={m}
                  name={m}
                  click={() => setPaymentMethod(m)}
                  bg={
                    paymentMethod === m
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }
                  wfull
                />
              ))}
            </div>

            {/* CASH */}
            {paymentMethod === "cash" && (
              <div className="flex flex-col gap-2 mt-2">
                <NextInput
                  label={`Cash Received`}
                  placeholder="Cash Received"
                  value={paymentInput.cash_received}
                  onChange={(e) =>
                    setPaymentInput((p) => ({
                      ...p,
                      cash_received: +e.target.value || 0,
                    }))
                  }
                />

                <div className="flex justify-between">
                  <span>Balance</span>
                  <span>LKR {(paymentData?.balance || 0).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* MIX */}
            {paymentMethod === "mix" && (
              <div className="flex flex-col gap-2 mt-2">
                <NextInput
                  label={`Cash Amount`}
                  placeholder="Cash"
                  value={paymentInput.cash_received}
                  onChange={(e) =>
                    setPaymentInput((p) => ({
                      ...p,
                      cash_received: +e.target.value || 0,
                    }))
                  }
                />
                <NextInput
                  label={`Card Amount`}
                  placeholder="Card"
                  value={paymentInput.card}
                  onChange={(e) =>
                    setPaymentInput((p) => ({
                      ...p,
                      card: +e.target.value || 0,
                    }))
                  }
                />
                <NextInput
                  label={`Bank Amount`}
                  placeholder="Bank"
                  value={paymentInput.bank}
                  onChange={(e) =>
                    setPaymentInput((p) => ({
                      ...p,
                      bank: +e.target.value || 0,
                    }))
                  }
                />

                <div className="flex justify-between">
                  <span>Balance</span>
                  <span>LKR {(paymentData?.balance || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ACTIONS */}
        <div className="flex gap-2 mt-3">
          <Button
            name={tab === "invoice" ? "Save & Pay" : "Save Quote"}
            click={handleSave}
            wfull
            bg="bg-green-500 text-white"
            disabled={!customer || !cart.length}
          />
          <Button
            name="Reset"
            click={() => {
              setCart([]);
              setCustomer(null);
              setPaymentInput({
                cash_received: 0,
                card: 0,
                bank: 0,
              });
            }}
            bg="bg-red-400 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PosTerminal;
