"use client";
import { Mail, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const NotificationBar = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/common/notifications", {
          cache: "no-store",
        });

        if (!res.ok) {
          setData(null);
          return;
        }

        setData(await res.json());
      } catch (error) {
        console.error(error);
        setData(null);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-gray-100 py-2 px-4 rounded-xl">
      <div className="flex gap-1 items-center ">
        <Package size={20} className="text-red-400" />
        <span className="tracking-tighter font-semibold text-gray-600">
          {data?.low_stock_count ?? 0}
        </span>
      </div>
      <div className="flex gap-1 items-center text-gray-800">
        <Mail
          size={20}
          className="text-amber-400
        "
        />
        <span className="text-gray-600 tracking-tighter font-semibold ">
          {data?.sms_balance ?? 0}
        </span>
      </div>
      <div className="flex gap-1 items-center">
        <ShoppingCart
          size={20}
          className="text-green-500
        "
        />
        <span className="text-gray-600 tracking-tighter font-semibold ">
          {data?.today_issued_count ?? 0}
        </span>
      </div>
    </div>
  );
};

export default NotificationBar;
