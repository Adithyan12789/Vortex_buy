import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import {
  HiBars3,
  HiXMark,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTag,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlinePhone
} from "react-icons/hi2";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { counter } = useCartStore();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", to: "/", icon: HiOutlineHome },
    { label: "Shop Marketplace", to: "/list", icon: HiOutlineShoppingBag },
    { label: "Exclusive Deals", to: "/deals", icon: HiOutlineTag },
    { label: "About Us", to: "/about", icon: HiOutlineInformationCircle },
    { label: "Contact Support", to: "/contact", icon: HiOutlinePhone },
  ];

  return (
    <div>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-xl text-gray-700 hover:text-vortexBuy hover:bg-gray-100/80 transition-all focus:outline-none flex items-center justify-center"
      >
        <HiBars3 className="text-2xl" />
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Right slide-in drawer */}
          <div className="fixed top-0 bottom-0 right-0 w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between z-50 p-6 animate-in slide-in-from-right duration-300">
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-vortexBuy to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-vortexBuy/20">
                    V
                  </div>
                  <span className="text-lg font-black tracking-tight uppercase text-gray-950">
                    Vortex<span className="text-vortexBuy">Buy</span>
                  </span>
                </Link>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <HiXMark className="text-2xl" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-3">
                  Marketplace
                </span>
                {navLinks.map(({ label, to, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-vortexBuy/10 text-vortexBuy"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                      }`}
                    >
                      <Icon className="text-xl" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* User Account / Orders Section */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-3">
                  Account & Orders
                </span>

                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/profile?tab=profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <HiOutlineUser className="text-xl text-gray-400" />
                      <span className="truncate">My Profile ({user.username})</span>
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <HiOutlineShoppingBag className="text-xl text-gray-400" />
                      <span>My Order History</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-xl text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="py-3 bg-gray-950 hover:bg-black text-white text-center font-bold text-xs rounded-2xl shadow-md shadow-black/10 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login?mode=register"
                      onClick={() => setOpen(false)}
                      className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-center font-bold text-xs rounded-2xl transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400 font-medium">
                © {new Date().getFullYear()} VortexBuy Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Menu;
