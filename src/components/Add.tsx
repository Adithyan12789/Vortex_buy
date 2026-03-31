import { useCartStore } from "@/hooks/useCartStore";
import React, { useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const { addItem, isLoading } = useCartStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Quantity</h4>
        {stockNumber < 1 ? (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Sold Out</span>
        ) : (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {stockNumber} units in stock
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl flex items-center w-full sm:w-32 justify-between border border-gray-200/50">
          <button
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-vortexBuy transition-colors disabled:opacity-30"
            onClick={() => handleQuantity("d")}
            disabled={quantity <= 1 || stockNumber < 1}
          >
            -
          </button>
          <span className="font-black text-gray-800 tabular-nums">{quantity}</span>
          <button
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:text-vortexBuy transition-colors disabled:opacity-30"
            onClick={() => handleQuantity("i")}
            disabled={quantity >= stockNumber || stockNumber < 1}
          >
            +
          </button>
        </div>

        <button
          onClick={() => addItem(productId, variantId, quantity)}
          className="flex-1 w-full bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] py-4 px-8 rounded-2xl shadow-xl shadow-black/10 hover:bg-vortexBuy hover:shadow-vortexBuy/20 transition-all duration-300 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
          disabled={isLoading || stockNumber < 1}
        >
          {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
        </button>
      </div>

      {stockNumber > 0 && stockNumber <= 5 && (
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest text-center">
          Rare find! Only {stockNumber} left in our global collection.
        </p>
      )}
    </div>
  );
};

export default Add;
