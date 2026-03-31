

import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CartModel from "./CartModel";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";
import NotificationModel from "./NotificationModel";
import { HiOutlineQueueList, HiOutlineBell, HiOutlineShoppingCart, HiUser } from "react-icons/hi2";

const Navicons = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const handleCart = () => {
    setIsCartOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const handleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsCartOpen(false);
  };

  const { counter, getCart } = useCartStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* ORDERS HISTORY */}
      <Link 
        to="/orders" 
        className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-100/80 transition-all flex items-center gap-2"
        title="View Order History"
      >
        <HiOutlineQueueList className="text-2xl text-gray-700 group-hover:text-vortexBuy transition-colors" />
        <span className="hidden lg:block text-[10px] font-black text-gray-400 group-hover:text-vortexBuy uppercase tracking-widest transition-colors">Orders</span>
      </Link>

      {/* NOTIFICATIONS */}
      <div className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-100/80 transition-all" onClick={handleNotification}>
        <HiOutlineBell className="text-2xl text-gray-700 group-hover:text-vortexBuy transition-colors" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-vortexBuy rounded-full border-2 border-white shadow-sm animate-pulse" />
      </div>

      {isNotificationOpen && <NotificationModel />}

      {/* CART */}
      <div className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-100/80 transition-all" onClick={handleCart}>
        <HiOutlineShoppingCart className="text-2xl text-gray-700 group-hover:text-vortexBuy transition-colors" />
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-vortexBuy border-2 border-white rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
          {counter}
        </div>
      </div>

      {isCartOpen && <CartModel />}
    </div>
  );
};

export default Navicons;
