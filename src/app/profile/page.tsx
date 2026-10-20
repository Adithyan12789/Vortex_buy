import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineArrowRightOnRectangle,
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineSparkles,
  HiOutlineCube,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineTrash,
  HiOutlineXCircle,
  HiXMark
} from "react-icons/hi2";

enum TAB {
  PROFILE = "PROFILE",
  ORDERS = "ORDERS",
  SHIPPING = "SHIPPING",
  SECURITY = "SECURITY",
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token, isAuthenticated, isLoading, logout, updateUser, fetchProfile } = useAuthStore();

  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TAB>(() => {
    if (requestedTab === "orders") return TAB.ORDERS;
    if (requestedTab === "shipping") return TAB.SHIPPING;
    if (requestedTab === "security") return TAB.SECURITY;
    return TAB.PROFILE;
  });

  // Sync state if url param changes
  useEffect(() => {
    if (requestedTab === "orders" && activeTab !== TAB.ORDERS) setActiveTab(TAB.ORDERS);
    else if (requestedTab === "shipping" && activeTab !== TAB.SHIPPING) setActiveTab(TAB.SHIPPING);
    else if (requestedTab === "security" && activeTab !== TAB.SECURITY) setActiveTab(TAB.SECURITY);
    else if (requestedTab === "profile" && activeTab !== TAB.PROFILE) setActiveTab(TAB.PROFILE);
  }, [requestedTab]);

  // Form fields
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Orders state
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isClearingOrders, setIsClearingOrders] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<any | null>(null);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || "http://localhost:5000";
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchUserOrders();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setPostalCode(user.postalCode || "");
      setCountry(user.country || "");
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const guestId = localStorage.getItem("guestId");
      const res = await axios.get(
        `${getApiUrl()}/api/payment/orders${guestId ? `?guestId=${guestId}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleClearOrders = async () => {
    if (!token) return;
    setIsClearingOrders(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const guestId = localStorage.getItem("guestId");
      await axios.delete(
        `${getApiUrl()}/api/payment/orders/clear${guestId ? `?guestId=${guestId}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserOrders([]);
      setShowClearConfirm(false);
      setSuccessMessage("Your order history has been cleared successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.msg || "Failed to clear order history.");
    } finally {
      setIsClearingOrders(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel || !token) return;
    setIsCancellingOrder(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const guestId = localStorage.getItem("guestId");
      const res = await axios.put(
        `${getApiUrl()}/api/payment/orders/${orderToCancel._id}/cancel${guestId ? `?guestId=${guestId}` : ""}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedOrder = res.data.order;
      setUserOrders((prev) =>
        prev.map((ord) => (ord._id === orderToCancel._id ? updatedOrder : ord))
      );
      setSuccessMessage(res.data.msg || "Order has been cancelled. 20% fee was deducted and remaining refund initiated.");
      setOrderToCancel(null);
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.msg || "Failed to cancel order.");
    } finally {
      setIsCancellingOrder(false);
    }
  };

  const handleTabChange = (tab: TAB) => {
    setActiveTab(tab);
    setSuccessMessage("");
    setErrorMessage("");
    const tabParam = tab.toLowerCase();
    setSearchParams({ tab: tabParam });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await axios.put(
        `${getApiUrl()}/api/profile`,
        {
          username: username.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = res.data.user;
      updateUser(updated);
      setSuccessMessage("Your profile information has been saved successfully.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.msg || "Could not update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!currentPassword || !newPassword) {
      setErrorMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await axios.put(
        `${getApiUrl()}/api/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage(res.data.msg || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.msg || "Failed to change password. Verify your current password.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If user is not authenticated, show sign-in prompt
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-black/5 text-center">
          <div className="w-16 h-16 bg-vortexBuy/10 text-vortexBuy rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            <HiOutlineUser />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Member Profile Access</h2>
          <p className="text-gray-500 text-sm mb-8">
            Please sign in to your VortexBuy account to view and manage your profile, delivery addresses, and personal order history.
          </p>
          <div className="space-y-3">
            <Link
              to="/login?redirect=/profile"
              className="block w-full py-4 bg-vortexBuy text-white rounded-2xl font-bold text-sm shadow-lg shadow-vortexBuy/20 hover:bg-vortexBuy/90 transition-all"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/login?mode=register&redirect=/profile"
              className="block w-full py-4 bg-gray-50 text-gray-800 hover:bg-gray-100 rounded-2xl font-bold text-sm transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user initials for avatar
  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "VB";

  return (
    <div className="min-h-screen bg-gray-50/60 pb-24 selection:bg-vortexBuy selection:text-white">
      {/* HEADER HERO */}
      <div className="bg-gray-950 text-white pt-12 pb-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-vortexBuy to-orange-400 p-1 shadow-2xl shadow-vortexBuy/30 flex items-center justify-center text-white font-black text-2xl">
              <span className="w-full h-full rounded-[22px] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                {initials}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.username || "Valued Member"}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <HiOutlineShieldCheck className="text-xs" /> Verified
                </span>
              </div>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabChange(TAB.ORDERS)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all backdrop-blur-md border ${
                activeTab === TAB.ORDERS
                  ? "bg-vortexBuy text-white border-vortexBuy shadow-lg shadow-vortexBuy/30"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/10"
              }`}
            >
              <HiOutlineShoppingBag className="text-base text-white" />
              <span>Orders ({userOrders.length})</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold text-xs tracking-wider uppercase transition-all border border-red-500/20"
            >
              <HiOutlineArrowRightOnRectangle className="text-base" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-4 shadow-xl shadow-black/5 border border-gray-100 space-y-2 sticky top-28">
              <button
                onClick={() => handleTabChange(TAB.PROFILE)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === TAB.PROFILE
                    ? "bg-gray-950 text-white shadow-lg shadow-black/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <HiOutlineUser className="text-xl" />
                <div className="text-left">
                  <p className="leading-none">Personal Details</p>
                  <p className={`text-[11px] font-medium mt-1 ${activeTab === TAB.PROFILE ? "text-gray-400" : "text-gray-400"}`}>
                    Name, phone, identity
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleTabChange(TAB.ORDERS)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === TAB.ORDERS
                    ? "bg-gray-950 text-white shadow-lg shadow-black/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <HiOutlineShoppingBag className="text-xl" />
                <div className="text-left flex-1 flex items-center justify-between">
                  <div>
                    <p className="leading-none">My Order History</p>
                    <p className={`text-[11px] font-medium mt-1 ${activeTab === TAB.ORDERS ? "text-gray-400" : "text-gray-400"}`}>
                      Past purchases & tracking
                    </p>
                  </div>
                  {userOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-vortexBuy/10 text-vortexBuy font-black text-[10px]">
                      {userOrders.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleTabChange(TAB.SHIPPING)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === TAB.SHIPPING
                    ? "bg-gray-950 text-white shadow-lg shadow-black/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <HiOutlineMapPin className="text-xl" />
                <div className="text-left">
                  <p className="leading-none">Shipping & Address</p>
                  <p className={`text-[11px] font-medium mt-1 ${activeTab === TAB.SHIPPING ? "text-gray-400" : "text-gray-400"}`}>
                    Default delivery location
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleTabChange(TAB.SECURITY)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === TAB.SECURITY
                    ? "bg-gray-950 text-white shadow-lg shadow-black/10"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <HiOutlineLockClosed className="text-xl" />
                <div className="text-left">
                  <p className="leading-none">Security & Password</p>
                  <p className={`text-[11px] font-medium mt-1 ${activeTab === TAB.SECURITY ? "text-gray-400" : "text-gray-400"}`}>
                    Protect your account
                  </p>
                </div>
              </button>

              {/* Quick Perks Box */}
              <div className="pt-4 mt-4 border-t border-gray-100 px-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/60">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                    <HiOutlineSparkles className="text-vortexBuy" />
                    <span>Member Privilege</span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                    Orders linked directly to your account receive fast express dispatch and prioritized support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5 border border-gray-100">
              {/* STATUS MESSAGES */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-3">
                  <HiCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-3">
                  <HiExclamationCircle className="text-red-500 text-lg flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: PERSONAL DETAILS */}
              {activeTab === TAB.PROFILE && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-950 mb-1">Personal Information</h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Manage your profile identity across VortexBuy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Full Name / Username
                      </label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Adithyan Narayanan"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Email Address (Verified)
                      </label>
                      <div className="relative">
                        <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="email"
                          disabled
                          value={user?.email || ""}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-100/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-4 bg-gray-950 text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-black transition-all disabled:bg-gray-300 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MY ORDER HISTORY */}
              {activeTab === TAB.ORDERS && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-950 mb-1">My Order History</h2>
                      <p className="text-xs text-gray-500 font-medium">
                        Verified acquisitions and orders linked to {user?.email}.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {userOrders.length > 0 && !showClearConfirm && (
                        <button
                          type="button"
                          onClick={() => setShowClearConfirm(true)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-sm"
                          title="Clear all orders from history"
                        >
                          <HiOutlineTrash className="text-sm" />
                          <span>Clear Order History</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={fetchUserOrders}
                        className="text-xs font-bold text-vortexBuy hover:underline px-2 py-1"
                      >
                        Refresh Orders
                      </button>
                    </div>
                  </div>

                  {/* Inline Confirmation for Clearing Order History */}
                  {showClearConfirm && (
                    <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center gap-2.5 text-red-900 font-bold">
                        <HiExclamationCircle className="text-lg text-red-600 shrink-0" />
                        <span>Are you sure you want to permanently clear your order history? This cannot be undone.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isClearingOrders}
                          onClick={() => setShowClearConfirm(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isClearingOrders}
                          onClick={handleClearOrders}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isClearingOrders ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <HiOutlineTrash className="text-sm" />
                          )}
                          <span>{isClearingOrders ? "Clearing..." : "Yes, Clear All"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isLoadingOrders ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-vortexBuy border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading your orders...</p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-50/60 rounded-3xl border border-dashed border-gray-200 p-8">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mb-4">
                        <HiOutlineCube className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">No Orders Found</h3>
                      <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                        You haven't placed any orders with this account yet. Discover items from our curated marketplace.
                      </p>
                      <Link
                        to="/list"
                        className="px-8 py-3.5 bg-gray-950 hover:bg-black text-white text-xs font-bold rounded-2xl shadow-lg shadow-black/10 transition-all"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userOrders.map((order) => {
                        const isCancelled = order.orderStatus === "Cancelled";
                        const isPaid = order.paymentStatus === "Paid" || order.paymentStatus === "Paid (On Delivery)";
                        const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <div
                            key={order._id}
                            className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                              isCancelled ? "border-rose-200 bg-rose-50/10" : "border-gray-100"
                            }`}
                          >
                            {/* Order Header */}
                            <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-black text-gray-950 uppercase tracking-tight">
                                    #ORD-{order._id?.slice(-8).toUpperCase()}
                                  </span>
                                  {isCancelled ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                      <HiOutlineXCircle className="text-xs" />
                                      Cancelled
                                    </span>
                                  ) : (
                                    <span
                                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                        isPaid
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : "bg-amber-50 text-amber-700 border border-amber-200"
                                      }`}
                                    >
                                      <HiCheckCircle className="text-xs" />
                                      {order.paymentStatus || "Processing"}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                  <HiOutlineClock className="text-xs" />
                                  <span>Placed on {formattedDate}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                                  Total Amount
                                </span>
                                <span className={`text-xl font-black ${isCancelled ? "text-gray-400 line-through" : "text-vortexBuy"}`}>
                                  ₹{order.totalAmount}
                                </span>
                              </div>
                            </div>

                            {/* Cancelled Banner if cancelled */}
                            {isCancelled && (
                              <div className="mx-6 mt-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5 text-rose-900 font-semibold">
                                  <HiExclamationCircle className="text-lg text-rose-600 shrink-0" />
                                  <div>
                                    <span>Order was cancelled on {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : formattedDate}.</span>
                                    <p className="text-[11px] text-rose-700 font-normal mt-0.5">
                                      20% cancellation deduction applied (Fee: <strong>₹{order.cancellationFee || Math.round(order.totalAmount * 0.20)}</strong>).
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block">Refund Amount (80%)</span>
                                  <span className="text-sm font-black text-rose-800">
                                    ₹{order.refundAmount != null ? order.refundAmount : Math.max(0, order.totalAmount - Math.round(order.totalAmount * 0.20))}
                                  </span>
                                  <span className="text-[10px] text-rose-600 font-medium block">
                                    {order.refundStatus || "Refund Processing"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Order Line Items */}
                            <div className="p-6 divide-y divide-gray-100">
                              {(order.lineItems || []).map((item: any, idx: number) => {
                                const prod = item.productId || {};
                                const imgUrl =
                                  prod.media?.mainMedia?.image?.url ||
                                  prod.media?.items?.[0]?.image?.url ||
                                  "/product.png";

                                return (
                                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                          src={imgUrl}
                                          alt={prod.name || "Product"}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-900 leading-snug">
                                          {prod.name || "Curated Piece"}
                                        </h4>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                                          Qty: {item.quantity} × ₹{item.price || prod.price?.price || 0}
                                        </p>
                                      </div>
                                    </div>

                                    {prod.slug && (
                                      <Link
                                        to={`/${prod.slug}`}
                                        className="text-xs font-bold text-gray-700 hover:text-vortexBuy transition-colors"
                                      >
                                        View Item →
                                      </Link>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order Footer Info */}
                            <div className="px-6 py-4 bg-gray-50/40 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 font-medium">
                              <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <HiOutlineCreditCard className="text-base text-gray-400" />
                                  <span>Payment Method: <strong className="text-gray-900">{order.paymentMethod || "Razorpay"}</strong></span>
                                </div>
                                {order.shippingInfo?.address && (
                                  <div className="flex items-center gap-2">
                                    <HiOutlineTruck className="text-base text-gray-400" />
                                    <span className="truncate max-w-xs">Ship to: {order.shippingInfo.address}</span>
                                  </div>
                                )}
                              </div>

                              {/* Cancel Order Action */}
                              {!isCancelled && order.orderStatus !== "Delivered" && (
                                <button
                                  type="button"
                                  onClick={() => setOrderToCancel(order)}
                                  className="px-3.5 py-1.5 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-all text-xs flex items-center gap-1.5 shadow-sm"
                                  title="Cancel this order and request refund"
                                >
                                  <HiOutlineXCircle className="text-sm" />
                                  <span>Cancel Order</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Cancel Order Modal with 20% deduction policy */}
                  {orderToCancel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => !isCancellingOrder && setOrderToCancel(null)}
                      />

                      {/* Modal Dialog */}
                      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 z-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
                              <HiOutlineXCircle />
                            </div>
                            <div>
                              <h3 className="text-base font-black text-gray-950">Cancel Order</h3>
                              <p className="text-xs text-gray-400 font-medium">#ORD-{orderToCancel._id?.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={isCancellingOrder}
                            onClick={() => setOrderToCancel(null)}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            <HiXMark className="text-xl" />
                          </button>
                        </div>

                        {/* 20% Deduction Notice */}
                        <div className="my-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1.5">
                          <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                            <HiExclamationCircle className="text-base text-amber-600 shrink-0" />
                            <span>Cancellation Policy Notice</span>
                          </div>
                          <p className="text-xs text-amber-900 leading-relaxed font-medium">
                            If you are cancelling the order, <strong>20% will be cut from the cash you paid</strong>, and we will return the remaining cash to your account.
                          </p>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5 text-xs">
                          <div className="flex justify-between items-center text-gray-600 font-medium">
                            <span>Cash Paid</span>
                            <span className="font-bold text-gray-900">₹{orderToCancel.totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-rose-600 font-medium">
                            <span>Cancellation Cut (20%)</span>
                            <span className="font-bold">-₹{Math.round(orderToCancel.totalAmount * 0.20)}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-black text-gray-950">
                            <span>Refund Amount (80%)</span>
                            <span className="text-emerald-600 text-base">
                              ₹{Math.max(0, orderToCancel.totalAmount - Math.round(orderToCancel.totalAmount * 0.20))}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 text-center mt-3 font-medium">
                          Refunds are initiated immediately to your payment method.
                        </p>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                          <button
                            type="button"
                            disabled={isCancellingOrder}
                            onClick={() => setOrderToCancel(null)}
                            className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-all text-center"
                          >
                            Keep Order
                          </button>
                          <button
                            type="button"
                            disabled={isCancellingOrder}
                            onClick={handleCancelOrder}
                            className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isCancellingOrder ? (
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                              <span>Confirm & Cancel</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SHIPPING ADDRESS */}
              {activeTab === TAB.SHIPPING && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-950 mb-1">Delivery Address</h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Set your primary shipping address for instant checkout on upcoming orders.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Street Address & Apartment
                    </label>
                    <div className="relative">
                      <HiOutlineMapPin className="absolute left-4 top-4 text-gray-400 text-lg" />
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Apartment #, Street Name, Area"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        City / Town
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kochi"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="682001"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-4 bg-gray-950 text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-black transition-all disabled:bg-gray-300 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Save Address</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: SECURITY */}
              {activeTab === TAB.SECURITY && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-950 mb-1">Security & Password</h2>
                    <p className="text-xs text-gray-500 font-medium">
                      Update your password to keep your account safe.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Current Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        New Password (min. 6 chars)
                      </label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 text-sm font-medium text-gray-900 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-4 bg-vortexBuy text-white rounded-2xl font-bold text-sm shadow-xl shadow-vortexBuy/20 hover:bg-vortexBuy/90 transition-all disabled:bg-gray-300 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
