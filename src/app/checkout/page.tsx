
import React, { useState } from 'react';
import { useCartStore } from "@/hooks/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineArrowLeft } from "react-icons/hi2";

const CheckoutPage = () => {
    const { cart, checkout, isLoading } = useCartStore();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

    const subtotal = cart.lineItems.reduce((acc: number, item: any) => 
        acc + (item.productId?.price?.price || 0) * item.quantity, 0
    );

    const privilegeDiscount = Math.round(subtotal * 0.1);
    const marketIncentive = subtotal > 0 ? 500 : 0;
    const finalTotal = Math.max(0, subtotal - privilegeDiscount - marketIncentive);

    const handleAcquisition = () => {
        if (paymentMethod === 'cod') {
            alert("Order placed successfully via Cash on Delivery! Experience the Vortex soon.");
            window.location.href = "/orders"; // Navigate to orders page
        } else {
            checkout(finalTotal);
        }
    };

    if (!cart.lineItems || cart.lineItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <h2 className="text-3xl font-black text-gray-900 mb-6 italic">No Assets Stage.</h2>
                <p className="text-gray-400 mb-10 max-w-xs">You must select pieces from the collection before proceeding to the acquisition stage.</p>
                <Link to="/list" className="px-8 py-3 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">View Collection</Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 pt-16 pb-32 animate-fade-up">
            <div className="flex flex-col items-center text-center mb-24">
                <nav className="flex items-center gap-3 mb-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    <Link to="/cart" className="hover:text-vortexBuy transition-colors">Review Cart</Link>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-gray-900">Final Acquisition</span>
                </nav>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6">Secure <span className="text-vortexBuy">Stage.</span></h1>
                <p className="text-gray-500 font-medium max-w-xl">Finalize your premium acquisition. All transactions are encrypted and authentications are verified through the Vortex vault.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-20 items-start">
                {/* LEFT: FORM (SIMPLIFIED FOR GUEST) */}
                <div className="flex-1 w-full flex flex-col gap-12">
                    <section className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">01</div>
                            <h3 className="text-xl font-black tracking-tight text-gray-900">Market Destination</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Legal Name</label>
                                <input type="text" placeholder="e.g. Alexander Vortex" className="bg-gray-50 border border-gray-100 rounded-2xl p-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-vortexBuy/20 transition-all font-medium" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Contact Email</label>
                                <input type="email" placeholder="alex@vault.vortex" className="bg-gray-50 border border-gray-100 rounded-2xl p-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-vortexBuy/20 transition-all font-medium" />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Global Delivery Address</label>
                                <textarea rows={3} placeholder="Provide your full premium delivery coordinates..." className="bg-gray-50 border border-gray-100 rounded-2xl p-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-vortexBuy/20 transition-all font-medium resize-none"></textarea>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">02</div>
                            <h3 className="text-xl font-black tracking-tight text-gray-900">Transfer Methods</h3>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            {/* Razorpay Option */}
                            <button 
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`w-full p-8 rounded-3xl border text-left transition-all duration-500 flex items-center justify-between group ${paymentMethod === 'razorpay' ? 'bg-vortexBuy/5 border-vortexBuy/40 shadow-xl shadow-vortexBuy/5' : 'bg-gray-50 border-gray-100 hover:border-vortexBuy/20 hover:bg-gray-100/50'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === 'razorpay' ? 'bg-vortexBuy text-white' : 'bg-white border border-gray-100 text-gray-400'}`}>
                                        <HiOutlineShieldCheck className="text-2xl" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-base font-black ${paymentMethod === 'razorpay' ? 'text-gray-900' : 'text-gray-500'}`}>Razorpay Secure Transfer</span>
                                        <span className="text-[9px] font-bold text-vortexBuy uppercase tracking-widest mt-1">Authentic Vault Protocol Active</span>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-4 transition-all ${paymentMethod === 'razorpay' ? 'border-vortexBuy bg-white scale-110' : 'border-gray-200 bg-white'}`}></div>
                            </button>

                            {/* COD Option */}
                            <button 
                                onClick={() => setPaymentMethod('cod')}
                                className={`w-full p-8 rounded-3xl border text-left transition-all duration-500 flex items-center justify-between group ${paymentMethod === 'cod' ? 'bg-gray-900 border-gray-900 shadow-xl shadow-black/10' : 'bg-gray-50 border-gray-100 hover:border-vortexBuy/20 hover:bg-gray-100/50'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'bg-white text-gray-900' : 'bg-white border border-gray-100 text-gray-400'}`}>
                                        <span className="material-icons-outlined text-2xl">payments</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-base font-black ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-500'}`}>Cash on Delivery</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${paymentMethod === 'cod' ? 'text-vortexBuy' : 'text-gray-400'}`}>Market Logistics Incentive</span>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-4 transition-all ${paymentMethod === 'cod' ? 'border-vortexBuy bg-white scale-110' : 'border-gray-200 bg-white'}`}></div>
                            </button>
                        </div>
                    </section>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="w-full lg:w-[500px]">
                    <div className="p-10 md:p-14 bg-white border border-gray-100 rounded-[4rem] shadow-2xl shadow-black/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-vortexBuy/5 transition-all duration-700"></div>
                        
                        <h3 className="text-2xl font-black tracking-tighter italic mb-10 text-gray-900">Review Assets.</h3>
                        
                        <div className="flex flex-col gap-8 mb-12 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                            {cart.lineItems.map((item: any) => (
                                <div key={item._id} className="flex gap-6 items-center">
                                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex-shrink-0">
                                        <img src={item.productId?.media?.mainMedia?.image?.url || "/product.png"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                        <h4 className="text-sm font-black text-gray-900 tracking-tight truncate">{item.productId?.name}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Quantity: {item.quantity}</span>
                                            <span className="text-sm font-black text-gray-900">₹{item.productId?.price?.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-6 pt-10 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal Value</span>
                                <span className="text-sm font-bold text-gray-400">₹{subtotal}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-vortexBuy uppercase tracking-widest">Vortex Privilege</span>
                                    <span className="text-[8px] font-black text-green-500 uppercase">10% Exclusive Benefit</span>
                                </div>
                                <span className="text-sm font-black text-green-500">-₹{privilegeDiscount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Incentive</span>
                                <span className="text-sm font-black text-green-500">-₹{marketIncentive}</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-vortexBuy">Amount to Secure</span>
                                <span className="text-4xl font-black text-gray-900 tracking-tight">₹{finalTotal}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleAcquisition}
                            disabled={isLoading}
                            className={`w-full mt-12 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 disabled:bg-gray-200 ${paymentMethod === 'cod' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-900 text-white hover:bg-vortexBuy hover:shadow-2xl hover:shadow-vortexBuy/20'}`}
                        >
                            {isLoading ? "Synchronizing Vault..." : paymentMethod === 'cod' ? "Confirm Acquisition (COD)" : "Initiate Secure Transfer"}
                            <span className="material-icons-outlined text-sm">{paymentMethod === 'cod' ? 'done_all' : 'lock'}</span>
                        </button>

                        <div className="mt-10 flex items-center justify-center gap-10">
                            <img src="/mastercard.png" alt="Visa" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-30 hover:opacity-100" />
                            <img src="/paypal.png" alt="PayPal" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-30 hover:opacity-100" />
                            <img src="/visa.png" alt="ApplePay" className="h-4 grayscale hover:grayscale-0 transition-all cursor-pointer opacity-30 hover:opacity-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
