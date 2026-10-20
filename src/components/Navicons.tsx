import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import CartModel from "./CartModel";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import NotificationModel from "./NotificationModel";
import {
  HiOutlineBell,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShoppingBag,
  HiOutlineShieldCheck
} from "react-icons/hi2";

const Navicons = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { counter, getCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCart = () => {
    setIsCartOpen((prev) => !prev);
    setIsNotificationOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsCartOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen((prev) => !prev);
    setIsCartOpen(false);
    setIsNotificationOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const userInitials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="flex items-center gap-3 sm:gap-4 xl:gap-6 relative">
      {/* NOTIFICATIONS */}
      <div
        className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-100/80 transition-all"
        onClick={handleNotification}
        title="Notifications"
      >
        <HiOutlineBell className="text-2xl text-gray-700 group-hover:text-vortexBuy transition-colors" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-vortexBuy rounded-full border-2 border-white shadow-sm animate-pulse" />
      </div>

      {isNotificationOpen && <NotificationModel />}

      {/* CART */}
      <div
        className="relative cursor-pointer group p-2 rounded-full hover:bg-gray-100/80 transition-all"
        onClick={handleCart}
        title="Shopping Cart"
      >
        <HiOutlineShoppingCart className="text-2xl text-gray-700 group-hover:text-vortexBuy transition-colors" />
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-vortexBuy border-2 border-white rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
          {counter}
        </div>
      </div>

      {isCartOpen && <CartModel />}

      {/* PROFILE / ACCOUNT DROPDOWN */}
      <div className="relative" ref={profileMenuRef}>
        {isAuthenticated && user ? (
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100/80 transition-all focus:outline-none group"
            title="My Account"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-vortexBuy to-orange-400 text-white font-black text-xs flex items-center justify-center shadow-md shadow-vortexBuy/20 ring-2 ring-transparent group-hover:ring-vortexBuy/30 transition-all">
              {userInitials}
            </div>
            <span className="hidden xl:block text-xs font-bold text-gray-700 group-hover:text-vortexBuy transition-colors max-w-[80px] truncate">
              {user.username}
            </span>
          </button>
        ) : (
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-full hover:bg-gray-100/80 transition-all text-gray-700 hover:text-vortexBuy focus:outline-none"
            title="Sign In or Register"
          >
            <HiOutlineUser className="text-2xl" />
          </button>
        )}

        {/* PROFILE FLYOUT MENU */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-down">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-black text-gray-950 truncate">{user.username}</p>
                    <HiOutlineShieldCheck className="text-emerald-500 text-sm flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/profile?tab=profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-vortexBuy transition-all"
                  >
                    <HiOutlineUser className="text-base text-gray-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-vortexBuy transition-all"
                  >
                    <HiOutlineShoppingBag className="text-base text-gray-400" />
                    <span>My Order History</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-base text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3 text-center space-y-3">
                <div className="text-left px-1">
                  <p className="text-sm font-black text-gray-900">Welcome to VortexBuy</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sign in for exclusive drops & tracking</p>
                </div>
                <Link
                  to="/login"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="block w-full py-2.5 bg-gray-950 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md shadow-black/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/login?mode=register"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="block w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-xl transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navicons;
