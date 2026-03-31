"use client";

import { useState } from "react";
import ProductListGrid from "../../grid/productlist/ProductListGrid";
import SelectCustomer from "../customer/SelectCustomer";
import CartCard from "../../cards/cartcard/CartCard";
import Button from "@/components/common/button/Button";

const PosTerminal = ({ customersList, itemsList }) => {
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);

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
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty - 1) } // 🔒 min = 1
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ SAVE INVOICE
  const handleSaveInvoice = () => {
    if (!customer) {
      alert("Please select a customer");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // ✅ CLEAN ITEMS (only required fields)
    const cleanItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      cost: item.cost,
      selling: item.selling,
      total: item.selling * item.qty,
    }));

    const total = cleanItems.reduce((sum, item) => sum + item.total, 0);

    const invoiceData = {
      customer,
      items: cleanItems,
      total,
      date: new Date().toISOString(),
    };

    // 🔥 ALERT CLEAN DATA ONLY
    alert(JSON.stringify(invoiceData, null, 2));

    console.log("Clean Invoice:", invoiceData);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="col-span-2 flex flex-col gap-4 w-full">
        <SelectCustomer
          customersList={customersList}
          setCustomer={setCustomer}
        />

        <ProductListGrid itemsList={itemsList} addToCart={addToCart} />
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col min-w-72  w-full lg:max-w-110 overflow-y-auto">
        <h2 className="font-bold mb-2">Cart</h2>

        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.map((item) => (
            // <div
            //   key={item.id}
            //   className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
            // >
            //   {/* LEFT */}
            //   <div className="flex flex-col">
            //     <span className="font-medium line-clamp-1">{item.name}</span>
            //     <span className="text-sm text-gray-500">
            //       {item.selling} x {item.qty}
            //     </span>
            //   </div>

            //   {/* RIGHT */}
            //   <div className="flex items-center gap-2">
            //     {/* ➖ */}
            //     <button
            //       onClick={() => decreaseQty(item.id)}
            //       className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            //     >
            //       -
            //     </button>

            //     {/* QTY */}
            //     <span className="w-6 text-center">{item.qty}</span>

            //     {/* ➕ */}
            //     <button
            //       onClick={() => increaseQty(item.id)}
            //       className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            //     >
            //       +
            //     </button>

            //     {/* ❌ REMOVE */}
            //     <button
            //       onClick={() => removeItem(item.id)}
            //       className="ml-2 text-red-500 hover:text-red-700 font-bold"
            //     >
            //       ×
            //     </button>
            //   </div>
            // </div>

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

        <div className="flex flex-col gap-2 ">
          <hr className="my-2 border-gray-100" />

          <p className="font-bold mb-2">
            Total: {cart.reduce((sum, i) => sum + i.selling * i.qty, 0)}
          </p>

          {/* ✅ SAVE BUTTON */}

          <Button
            name={`Save Invoice`}
            disabled={!customer || cart.length === 0}
            wfull={true}
            bg={
              !customer || cart.length === 0
                ? `bg-gray-400 cursor-not-allowed`
                : `bg-green-500 hover:bg-green-500 text-white`
            }
            click={handleSaveInvoice}
          />
        </div>
      </div>
    </div>
  );
};

export default PosTerminal;
