import { Boxes } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

const ProductCard = ({
  name,
  selling,
  stock = 0,
  category,
  onClick,
  image,
}) => {
  const isOutOfStock = stock <= 0;

  const handleClick = () => {
    if (isOutOfStock) {
      toast.warning("Out of stock");
      return;
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl shadow-lg h-full flex flex-col overflow-hidden transition-transform duration-300 border border-gray-200 cursor-pointer
        ${
          isOutOfStock
            ? "bg-gray-100 opacity-60 hover:border-red-300"
            : "bg-white  hover:scale-105 hover:border-blue-300"
        }
      `}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center bg-gray-50">
        {!image ? (
          <Image
            src={`/master/items/${image}`}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
            className="object-cover object-center transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <Boxes size={50} className="text-gray-300" />
        )}
        <div className="absolute bottom-4 right-4 ">
          {isOutOfStock ? (
            <span className="text-sm text-white rounded-lg bg-red-500 px-3 py-1">
              Sold Out
            </span>
          ) : (
            <p className="text-sm text-white rounded-lg bg-green-500 px-3 py-1">
              {stock} In-Stock
            </p>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col  p-4">
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
          {category}
        </span>
        <h3 className="font-bold text-gray-800 uppercase line-clamp-2 leading-4">
          {name}
        </h3>
        <p className="font-semibold text-gray-700">
          LKR {selling.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
