import { useCartStore } from "@/hooks/useCartStore";
import React from "react";

const CartModel = () => {
  const { cart, isLoading, removeItem } = useCartStore();

  return (
    <div className="absolute right-0 top-12 w-80 md:w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-fade-up">
      {!cart.lineItems || cart.lineItems.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner">🛒</div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Empty Sanctuary</h3>
            <p className="text-gray-400 text-sm font-medium">Your marketplace journey starts here. Add some premium items to begin.</p>
        </div>
      ) : (
        <>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
             <h2 className="text-xl font-black text-gray-900 tracking-tight">Vortex Cart</h2>
             <span className="text-[10px] font-black uppercase tracking-widest text-vortexBuy bg-vortexBuy/10 px-2 py-0.5 rounded-full">{cart.lineItems.length} Products</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto scrollbar-hide px-6 py-4 flex flex-col gap-6">
            {cart.lineItems.map((item: any) => (
              <div className="flex gap-4 group" key={item._id}>
                {item.image && (
                  <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                     <img
                       src={item.image}
                       alt={item.productName?.original || "Product"}
                       className="w-full h-full object-cover"
                     />
                  </div>
                )}

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 truncate">
                      {item.productName?.original}
                    </h3>
                    <div className="font-black text-vortexBuy text-sm">
                      ₹{item.price?.amount}
                    </div>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                    Ref: {item._id?.slice(-8) || 'VX-001'}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Qty</span>
                       <span className="text-xs font-black text-gray-900">{item.quantity}</span>
                    </div>
                    <button 
                      className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors cursor-pointer" 
                      onClick={() => !isLoading && removeItem(item._id!)}
                    >
                      {isLoading ? "Wait..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100">
            <div className="flex items-center justify-between font-black text-gray-900 text-lg mb-2">
              <span className="tracking-tight">Grand Total</span>
              <span className="text-vortexBuy">₹{cart.subtotal.amount}</span>
            </div>
            <p className="text-gray-400 text-xs font-medium mb-8">
              Complimentary shipping for premium members. Taxes included.
            </p>

            <div className="flex flex-col gap-3">
              <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl shadow-black/10 hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                 Proceed to Checkout
                 <span>→</span>
              </button>
              <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 active:scale-[0.98] transition-all">
                 Full Cart Overview
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModel;
