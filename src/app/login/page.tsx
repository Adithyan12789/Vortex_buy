import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiEye,
  HiEyeSlash,
  HiOutlineArrowPath
} from "react-icons/hi2";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { isAuthenticated, setAuth } = useAuthStore();

  const [mode, setMode] = useState<MODE>(() => {
    const requestedMode = searchParams.get("mode");
    return requestedMode === "register" ? MODE.REGISTER : MODE.LOGIN;
  });

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || "http://localhost:5000";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${getApiUrl()}/api/register`, {
        username: userName.trim(),
        email: email.trim(),
        password,
      });

      setMessage(res.data.msg || `Verification code emailed to ${email}. Please check your inbox.`);
      setResendCooldown(30);
      setMode(MODE.EMAIL_VERIFICATION);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${getApiUrl()}/api/verify-otp`, {
        email: email.trim(),
        otp: emailCode.trim(),
      });

      const { token, user } = res.data;
      setAuth(token, user);
      setMessage("Verification successful! Welcome to VortexBuy.");
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.msg || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      const res = await axios.post(`${getApiUrl()}/api/resend-otp`, {
        email: email.trim(),
      });
      setMessage(res.data.msg || `A new verification code has been dispatched to ${email}.`);
      setResendCooldown(45);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${getApiUrl()}/api/login`, {
        email: email.trim(),
        password,
      });

      const { token, user } = res.data;
      setAuth(token, user);
      setMessage("Login successful!");
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.requiresVerification) {
        setError(data.msg || "Account verification required.");
        setResendCooldown(30);
        setMode(MODE.EMAIL_VERIFICATION);
      } else {
        setError(data?.msg || "Authentication failed. Please verify credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden selection:bg-vortexBuy selection:text-white">
      {/* LEFT PANEL: LUXURY BRAND VISUAL */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
          alt="Premium VortexBuy Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/50 to-transparent" />

        {/* BRAND OVERLAY CONTENT */}
        <div className="relative z-10 p-16 xl:p-20 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-11 h-11 bg-vortexBuy rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-vortexBuy/30">
                V
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Vortex<span className="text-vortexBuy">Buy</span>
              </span>
            </div>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold tracking-wider uppercase mb-6 border border-white/10">
              Curated Luxury Commerce
            </span>
            <h2 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6 max-w-lg">
              DISCOVER THE <br />
              <span className="text-vortexBuy">NEXT ERA</span> <br />
              OF SHOPPING.
            </h2>
            <p className="text-gray-300 text-base max-w-md font-medium leading-relaxed">
              Join thousands of members accessing exclusive designer releases, prioritized rapid fulfillment, and concierge service.
            </p>
          </div>

          <div className="max-w-md pt-10 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-vortexBuy shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Verified Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Elena Rostova</div>
                <div className="text-vortexBuy text-xs font-semibold tracking-wide">VIP Club Member • Verified Buyer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE AUTH FORMS */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white relative">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-8"
          >
            <HiOutlineArrowLeft className="text-base" /> Back to Store
          </button>

          {/* Header Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-2">
              {mode === MODE.LOGIN
                ? "Welcome Back"
                : mode === MODE.REGISTER
                ? "Create Account"
                : "Check Your Email"}
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              {mode === MODE.LOGIN
                ? "Sign in to access your saved profile, orders, and bag."
                : mode === MODE.REGISTER
                ? "Join VortexBuy to unlock personalized curations and perks."
                : `We dispatched a real 6-digit confirmation code to ${email || "your inbox"}.`}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only when not in OTP verification) */}
          {mode !== MODE.EMAIL_VERIFICATION && (
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode(MODE.LOGIN);
                  setError("");
                  setMessage("");
                }}
                className={`py-3 text-sm font-bold rounded-xl transition-all ${
                  mode === MODE.LOGIN
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(MODE.REGISTER);
                  setError("");
                  setMessage("");
                }}
                className={`py-3 text-sm font-bold rounded-xl transition-all ${
                  mode === MODE.REGISTER
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* ALERTS */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* FORMS */}
          {mode === MODE.LOGIN && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="name@vortexbuy.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-medium text-sm text-gray-900"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-medium text-sm text-gray-900"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-950 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-black transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(MODE.REGISTER);
                      setError("");
                      setMessage("");
                    }}
                    className="text-gray-950 font-black hover:text-vortexBuy transition-colors underline decoration-2 underline-offset-4"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {mode === MODE.REGISTER && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Full Name / Username
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    required
                    value={userName}
                    placeholder="Adithyan"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-medium text-sm text-gray-900"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-medium text-sm text-gray-900"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Create Password (min. 6 chars)
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-medium text-sm text-gray-900"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-vortexBuy text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-vortexBuy/20 hover:bg-vortexBuy/90 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(MODE.LOGIN);
                      setError("");
                      setMessage("");
                    }}
                    className="text-gray-950 font-black hover:text-vortexBuy transition-colors underline decoration-2 underline-offset-4"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {mode === MODE.EMAIL_VERIFICATION && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* REAL EMAIL NOTIFICATION CARD */}
              <div className="p-5 bg-gradient-to-br from-gray-950 to-gray-900 text-white rounded-2xl shadow-xl shadow-black/10 border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-vortexBuy/20 text-vortexBuy flex items-center justify-center text-lg">
                    <HiOutlineEnvelope />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Email Dispatched</h3>
                    <p className="text-[11px] text-gray-400">Sent via secure Gmail delivery</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mt-2">
                  A 6-digit confirmation code was sent to <strong className="text-white underline">{email}</strong>. Please check your inbox and promotions/spam folder.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isResending}
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-vortexBuy hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    <HiOutlineArrowPath className={isResending ? "animate-spin" : ""} />
                    <span>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : isResending
                        ? "Sending..."
                        : "Resend Code"}
                    </span>
                  </button>
                </div>
                <div className="relative">
                  <HiOutlineShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailCode}
                    placeholder="••••••"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-vortexBuy focus:ring-4 focus:ring-vortexBuy/10 transition-all font-mono text-xl font-bold text-gray-900 tracking-[0.5em] text-center"
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || emailCode.length < 6}
                className="w-full bg-gray-950 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-black transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Activate Account</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(MODE.LOGIN);
                    setError("");
                    setMessage("");
                  }}
                  className="text-xs text-gray-500 font-bold hover:text-gray-900"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
