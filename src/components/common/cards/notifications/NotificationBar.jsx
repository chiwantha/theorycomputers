import { Mail, Package, ShoppingCart } from "lucide-react";

const NotificationBar = () => {
  return (
    <div className="flex items-center gap-4 bg-gray-100 py-2 px-4 rounded-xl">
      <div className="flex gap-1 items-center ">
        <Package size={20} className="text-red-400" />
        <span className="tracking-tighter font-semibold text-gray-600">10</span>
      </div>
      <div className="flex gap-1 items-center text-gray-800">
        <Mail
          size={20}
          className="text-amber-400
        "
        />
        <span className="text-gray-600 tracking-tighter font-semibold ">
          3100
        </span>
      </div>
      <div className="flex gap-1 items-center">
        <ShoppingCart
          size={20}
          className="text-green-500
        "
        />
        <span className="text-gray-600 tracking-tighter font-semibold ">
          10
        </span>
      </div>
    </div>
  );
};

export default NotificationBar;
