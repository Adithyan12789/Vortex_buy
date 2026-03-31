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
  const [quantity, setQuatity] = useState(1);

  // const stock = 4;

  const handleQuatity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuatity((prev) => prev - 1);
    }

    if (type === "i" && quantity < stockNumber) {
      setQuatity((prev) => prev + 1);
    }
  };

  const { addItem, isLoading } = useCartStore();

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quatity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-22 gap-6">
            <button
              className="cursor-pointer text-xl"
              title="minus"
              onClick={() => handleQuatity("d")}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl"
              title="plus"
              onClick={() => handleQuatity("i")}
            >
              +
            </button>
          </div>

          {stockNumber < 1 ? (
            <div className="text-xs">
                Product is out of stock
            </div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left!
              <br /> {"Don't"} miss it
            </div>
          )}

          <button
          onClick={() => addItem(productId, variantId, quantity)}
            title="add to cart"
            className="w-36 text-sm rounded-3xl ring-1 ring-vortexBuy text-vortexBuy py-2 px-4 hover:bg-vortexBuy hover:text-white disabled:cursor-not-allowed disabled:text-white disabled:ring-none disabled:ring-0" disabled={isLoading}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
