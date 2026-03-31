
import React, { useEffect, useState } from 'react';
import { useCartStore } from "@/hooks/useCartStore";
import axios from "axios";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineCube, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi2";

const ProfilePage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getGuestId = () => {
        return localStorage.getItem("guestId");
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const guestId = getGuestId();
                if (guestId) {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payment/orders?guestId=${guestId}`);
                    setOrders(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vortexBuy border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 pt-16 pb-32 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                <div className="max-w-2xl">
                    <nav className="flex items-center gap-3 mb-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        <Link to="/" className="hover:text-vortexBuy transition-colors">Home</Link>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-gray-900">Orders History</span>
                    </nav>
                    <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-8">
                        Orders <br /><span className="text-gray-200">History.</span>
                    </h1>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Securely track and review your guest acquisitions from the Vortex collection. Every piece tells a story of curated excellence.
                    </p>
                </div>
                
                <div className="flex flex-col gap-4 p-8 bg-gray-50 rounded-[3rem] border border-gray-100 min-w-[280px]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guest ID</span>
                        <span className="text-xs font-black text-gray-900">...{getGuestId()?.slice(-8)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200/50 pt-4 mt-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</span>
                        <span className="text-lg font-black text-vortexBuy">{orders.length}</span>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
                    <HiOutlineCube className="text-6xl text-gray-200 mb-8" />
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">No Archives Found</h3>
                    <p className="text-gray-400 max-w-sm mb-10">You haven't initialized any acquisitions yet. Experience the collection to start your archive.</p>
                    <Link to="/list" className="px-10 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-vortexBuy transition-all transform hover:scale-105">Start Journey</Link>
                </div>
            ) : (
                <div className="flex flex-col gap-12">
                    {orders.map((order) => (
                        <div key={order._id} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-vortexBuy/10 to-transparent rounded-[4.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            <div className="relative bg-white border border-gray-100 rounded-[4rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                                {/* Order Header */}
                                <div className="p-10 md:p-12 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-50">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                                            <span className="text-xs font-black text-gray-900 uppercase">#ORD-{order._id?.slice(-8)}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Acclimated on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Valuation</span>
                                            <span className="text-2xl font-black text-gray-900 tracking-tight">₹{order.totalAmount}</span>
                                        </div>
                                        
                                        <div className={`px-5 py-2 rounded-full border flex items-center gap-2 ${
                                            order.paymentStatus === 'Paid' 
                                            ? 'bg-green-50 border-green-100 text-green-600' 
                                            : 'bg-orange-50 border-orange-100 text-orange-600'
                                        }`}>
                                            {order.paymentStatus === 'Paid' ? (
                                                <HiOutlineCheckCircle className="text-lg" />
                                            ) : (
                                                <HiOutlineClock className="text-lg" />
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{order.paymentStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-10 md:p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {order.lineItems.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-6 items-center">
                                                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                    <img 
                                                        src={item.productId?.media?.mainMedia?.image?.url || "/product.png"} 
                                                        alt={item.productId?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <h4 className="text-sm font-black text-gray-900 tracking-tight truncate line-clamp-1">{item.productId?.name}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</span>
                                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                        <span className="text-[10px] font-black text-vortexBuy">₹{item.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Details Footer */}
                                <div className="p-10 md:p-12 bg-gray-50/30 border-t border-gray-50 flex flex-col md:flex-row gap-12">
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Logistics Destination</span>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-gray-900">{order.shippingInfo?.name || "Premium Guest"}</span>
                                            <span className="text-xs font-medium text-gray-500">{order.shippingInfo?.email}</span>
                                            <span className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs">{order.shippingInfo?.address || "Global Vault Coordinates"}</span>
                                        </div>
                                    </div>
                                    <div className="md:border-l border-gray-100 md:pl-12 flex flex-col gap-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transfer Protocol</span>
                                            <span className="text-xs font-black text-vortexBuy uppercase tracking-wider">{order.paymentMethod}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acquisition Status</span>
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Authentication Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
