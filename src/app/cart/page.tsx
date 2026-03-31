
import React from 'react';
import { useCartStore } from "@/hooks/useCartStore";
import { Link } from "react-router-dom";
import { HiOutlineTrash, HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi2";

const CartPage = () => {
  const { cart, isLoading, removeItem, checkout, updateQuantity } = useCartStore();

  const subtotal = cart.lineItems.reduce((acc: number, item: any) => 
    acc + (item.productId?.price?.price || 0) * item.quantity, 0
  );

  const privilegeDiscount = Math.round(subtotal * 0.1);
  const marketIncentive = subtotal > 0 ? 500 : 0;
  const finalTotal = Math.max(0, subtotal - privilegeDiscount - marketIncentive);

  if (!cart.lineItems || cart.lineItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner border border-gray-100">🛒</div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-vortexBuy/10 rounded-full blur-xl animate-pulse"></div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 italic">The Sanctuary is Empty</h1>
        <p className="text-gray-400 max-w-sm text-center font-medium leading-relaxed mb-12">Your curated collection journey begins with a single piece. Discover our exclusive marketplace.</p>
        <Link 
          to="/list" 
          className="px-12 py-5 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-vortexBuy hover:shadow-2xl hover:shadow-vortexBuy/20 transition-all duration-500 transform hover:-translate-y-1"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 pt-12 pb-32 animate-fade-up">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
        <div className="max-w-xl">
          <nav className="flex items-center gap-3 mb-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
            <Link to="/" className="hover:text-vortexBuy transition-colors">Home</Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="text-gray-900">Your Cart</span>
          </nav>
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-6">
            Curated <br /><span className="text-vortexBuy">Gallery.</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md">Review your selected pieces from the Vortex collection before finalizing your acquisition.</p>
        </div>
        <div className="flex items-center gap-4 px-8 py-4 bg-gray-50 rounded-3xl border border-gray-100">
          <HiOutlineShoppingBag className="text-2xl text-vortexBuy" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Assets</span>
            <span className="text-lg font-black text-gray-900 leading-none">{cart.lineItems.length} Unique Pieces</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* LEFT: ITEM LIST */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="hidden md:grid grid-cols-12 px-6 mb-2">
            <div className="col-span-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Acquisition Details</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Qty</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Value</div>
            <div className="col-span-2"></div>
          </div>

          <div className="flex flex-col gap-6">
            {cart.lineItems.map((item: any) => (
              <div 
                key={item._id} 
                className="group p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-4">
                  {/* Info + Image */}
                  <div className="col-span-1 md:col-span-6 flex gap-8 items-center">
                    <div className="w-24 h-32 md:w-32 md:h-40 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                      <img 
                        src={item.productId?.media?.mainMedia?.image?.url || "/product.png"} 
                        alt={item.productId?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-3 min-w-0">
                      <span className="text-[9px] font-black text-vortexBuy uppercase tracking-[0.3em] px-3 py-1 bg-vortexBuy/5 rounded-full w-max">
                        {item.productId?.categorySlug || "Exclusive"}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-vortexBuy transition-colors duration-300 line-clamp-2">
                        {item.productId?.name}
                      </h3>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Ref: {item.productId?._id?.slice(-12)}</span>
                    </div>
                  </div>

                  {/* Qty */}
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex items-center gap-4 px-3 py-2 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-vortexBuy/30 transition-all">
                       <button 
                         onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                         className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-vortexBuy hover:text-white hover:border-vortexBuy transition-all shadow-sm active:scale-90"
                       >
                         -
                       </button>
                       <span className="text-base font-black text-gray-900 tabular-nums w-8 text-center">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                         className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-vortexBuy hover:text-white hover:border-vortexBuy transition-all shadow-sm active:scale-90"
                       >
                         +
                       </button>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="col-span-1 md:col-span-2 text-right">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">₹{item.productId?.price?.price}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Per Unit</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 md:col-span-2 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.productId?._id)}
                      className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 group/btn active:scale-95 shadow-sm overflow-hidden"
                    >
                      <HiOutlineTrash className="text-2xl group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/list" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-vortexBuy mt-8 transition-all group w-max">
            <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-2 transition-transform" />
            Continue Acquiring Pieces
          </Link>
        </div>

        {/* RIGHT: SUMMARY CARD */}
        <div className="w-full lg:w-[450px]">
          <div className="sticky top-12 p-10 md:p-12 rounded-[4rem] bg-gray-900 text-white shadow-2xl shadow-black/20 overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-vortexBuy/10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-vortexBuy/15 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-3xl font-black tracking-tight italic mb-12">Asset Summary.</h2>
              
              <div className="flex flex-col gap-8 mb-12">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Subtotal Value</span>
                  <span className="text-xl font-black tracking-tight text-white/80">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-vortexBuy">Vortex Privilege</span>
                    <span className="text-[#00FF00] text-[8px] uppercase tracking-widest font-black leading-none mt-1">10% Exclusive Benefit</span>
                  </div>
                  <span className="text-lg font-black tracking-tight text-[#00FF00]">-₹{privilegeDiscount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Market Incentive</span>
                  <span className="text-lg font-black tracking-tight text-[#00FF00]">-₹{marketIncentive}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Market Logistics</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#00FF00]">Complimentary</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white underline underline-offset-8 decoration-vortexBuy mb-4">Total Valuation</span>
                    <span className="text-gray-400 text-[9px] uppercase tracking-widest leading-none mt-2">Inclusive of exclusive taxes</span>
                  </div>
                  <span className="text-4xl font-black tracking-tight text-white">₹{finalTotal}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-white text-gray-900 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-vortexBuy hover:text-white transition-all duration-500 shadow-xl shadow-black/40 flex items-center justify-center gap-4 group/checkout active:scale-95 text-center"
              >
                  <>
                    Secure Checkout 
                    <span className="material-icons-outlined text-lg group-hover/checkout:translate-x-2 transition-transform">east</span>
                  </>
              </Link>
              
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-4 text-white/40">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">enhanced_encryption</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Vault-Secure Payments</span>
                </div>
                <div className="flex items-center gap-4 text-white/40">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">verified_user</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Authenticity Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
