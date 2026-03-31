import Button from "@/components/common/button/Button";
import { Minus, Plus, Trash } from "lucide-react";
import React from "react";

const CartCard = ({
  quantity,
  quantityPlus,
  quantityMinus,
  removeItem,
  name,
  selling,
}) => {
  return (
    <div className="flex items-start justify-center flex-col w-full bg-gray-50 p-4 rounded-lg">
      {/* LEFT */}
      <div className="flex flex-col">
        <span className="font-medium line-clamp-1">{name}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="text-sm text-gray-500">
          {selling} x {quantity}
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 bg-gray-200 rounded-lg">
            <Button
              name={<Minus size={20} />}
              click={quantityMinus}
              pd={`p-1.5`}
              rounded={`rounded-lg`}
            />
            {/* QTY */}
            <span className="w-6 text-center font-bold text-gray-600 ">
              {quantity}
            </span>

            <Button
              name={<Plus size={20} />}
              click={quantityPlus}
              pd={`p-1.5`}
              rounded={`rounded-lg`}
            />
          </div>

          <Button
            name={<Trash size={20} />}
            click={quantityPlus}
            pd={`p-1.5`}
            rounded={`rounded-lg`}
            bg={`bg-red-400 hover:bg-red-600 text-white`}
          />
        </div>
      </div>
    </div>
  );
};

export default CartCard;
