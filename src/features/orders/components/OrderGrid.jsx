"use client";
import React, { useState } from "react";
import OrderCard from "./OrderCard";

const OrderGrid = ({ orderList = [], gridName, grid }) => {
  const [search, setSearch] = useState("");
  const data = orderList;

  const filteredOrders = data.filter((order) =>
    ` ${order.customerName} ${order.customerPhone} ${order.ordNo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-4 ">
      {/* Search */}
      <div className="flex justify-between items-center sm:flex-row flex-col">
        <h2 className="text-xl font-semibold text-gray-700 px-2 sm:block hidden">
          {gridName || "Your Orders"}
        </h2>

        <input
          type="text"
          placeholder="Search Orders ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-56 md:w-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 ${grid ? grid : ` grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 `}`}
      >
        <OrderCard add={true} />

        {filteredOrders.length > 0 &&
          filteredOrders.map((card, index) => (
            <OrderCard
              key={index}
              id={card.ordId}
              ord_no={card.ordNo}
              customer_name={card.customerName}
              phone={card.customerPhone}
              state={card.ordState}
              invoice_Id={card.invoice_id}
              created_at={card.created_at}
              index={index}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderGrid;
