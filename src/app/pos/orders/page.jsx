import { DummyOrderList } from "@/constant/DummyOrders";
import OrderGrid from "@/features/orders/components/OrderGrid";
import React from "react";

export const dynamic = "force-dynamic";

const PosOrderPage = async () => {
  const orderList = DummyOrderList;
  return (
    <div className="flex flex-col space-y-4">
      {/* <BreadCrumb /> */}
      <OrderGrid orderList={orderList} />
    </div>
  );
};

export default PosOrderPage;
