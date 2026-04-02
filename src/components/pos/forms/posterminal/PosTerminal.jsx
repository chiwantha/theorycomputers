"use client";

import { useState } from "react";
import ProductListGrid from "../../grid/productlist/ProductListGrid";
import SelectCustomer from "../customer/SelectCustomer";
import CartCard from "../../cards/cartcard/CartCard";
import Button from "@/components/common/button/Button";
import NextDropdown from "@/components/common/form/nextinput/NextDropdown";

const PosTerminal = ({ customersList, itemsList, quotationList }) => {
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);

  // 🔥 NEW STATES
  const [tab, setTab] = useState("invoice"); // invoice | quotation
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash | card | mix

  // 🛒 ADD TO CART
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p,
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ➕➖ QTY
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item,
      ),
    );
  };

  // ❌ REMOVE
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // 💾 SAVE (INVOICE / QUOTATION)
  const handleSave = () => {
    if (!customer) {
      alert("Please select a customer");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const cleanItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      cost: item.cost,
      selling: item.selling,
      total: item.selling * item.qty,
    }));

    const total = cleanItems.reduce((sum, item) => sum + item.total, 0);

    const data = {
      type: tab, // 🔥 invoice | quotation
      customer,
      paymentMethod: tab === "invoice" ? paymentMethod : null,
      items: cleanItems,
      total,
      date: new Date().toISOString(),
    };

    alert(JSON.stringify(data, null, 2));
    console.log("Saved Data:", data);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="col-span-2 flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl shadow w-full bg-white p-4">
            <NextDropdown
              items={quotationList || []}
              label={`Select Qoutation`}
            />
            <Button
              name={`Load Quotation`}
              wfull={true}
              bg={`bg-blue-500 text-white mt-2`}
              click={() => alert("Load Quotation - To be implemented")}
            />
          </div>
          <SelectCustomer
            customersList={customersList}
            setCustomer={setCustomer}
          />
        </div>

        <ProductListGrid itemsList={itemsList} addToCart={addToCart} />
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col min-w-72 w-full lg:max-w-110 h-[calc(100vh-92px)] overflow-y-auto">
        {/* 🔥 TAB SWITCH */}
        <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTab("invoice")}
            className={`flex-1 py-1 rounded-md ${
              tab === "invoice" ? "bg-white shadow font-semibold" : ""
            }`}
          >
            Invoice
          </button>
          <button
            onClick={() => setTab("quotation")}
            className={`flex-1 py-1 rounded-md ${
              tab === "quotation" ? "bg-white shadow font-semibold" : ""
            }`}
          >
            Quotation
          </button>
        </div>

        <h2 className="font-bold mb-2">Cart</h2>

        {/* 🧾 CART */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.map((item) => (
            <CartCard
              key={item.id}
              removeItem={() => removeItem(item.id)}
              quantity={item.qty}
              quantityPlus={() => increaseQty(item.id)}
              quantityMinus={() => decreaseQty(item.id)}
              name={item.name}
              selling={item.selling}
            />
          ))}
        </div>

        {/* 💰 FOOTER */}
        <div className="flex flex-col gap-2">
          <hr className="my-2 border-gray-100" />

          <p className="font-bold mb-2">
            Total: {cart.reduce((sum, i) => sum + i.selling * i.qty, 0)}
          </p>

          {/* 💳 PAYMENT METHODS (ONLY INVOICE) */}
          {tab === "invoice" && (
            <div className="flex gap-2 mb-2">
              {["cash", "card", "mix"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-1 rounded ${
                    paymentMethod === method
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          )}

          {/* ✅ SAVE BUTTON */}
          <Button
            name={tab === "invoice" ? "Save & Pay" : "Save Quotation"}
            disabled={!customer || cart.length === 0}
            wfull={true}
            bg={
              !customer || cart.length === 0
                ? `bg-gray-400 cursor-not-allowed`
                : tab === "invoice"
                  ? `bg-green-500 text-white`
                  : `bg-blue-500 text-white`
            }
            click={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default PosTerminal;
