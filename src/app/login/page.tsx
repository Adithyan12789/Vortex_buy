import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = !!Cookies.get("token");
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const [mode, setMode] = useState(MODE.LOGIN);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Welcome Back"
      : mode === MODE.REGISTER
      ? "Join the Vortex"
      : mode === MODE.RESET_PASSWORD
      ? "Secure Recovery"
      : "Verify Identity";

  const formSubtitle = 
    mode === MODE.LOGIN
      ? "Please enter your credentials to access your account."
      : mode === MODE.REGISTER
      ? "Start your journey with premium access today."
      : mode === MODE.RESET_PASSWORD
      ? "We'll send a secure link to your registered email."
      : "Enter the code sent to your device.";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Initialize Access"
      : mode === MODE.REGISTER
      ? "Create Identity"
      : mode === MODE.RESET_PASSWORD
      ? "Send Request"
      : "Confirm Identity";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock Backend Login
      setTimeout(() => {
        if (mode === MODE.LOGIN || mode === MODE.REGISTER) {
          Cookies.set("token", "dummy-auth-token", { expires: 2 });
          setMessage("Authentication successful.");
          navigate("/");
        } else {
          setMessage("Action initiated. Check your inbox.");
        }
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Authorization failed. Please verify details.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* LEFT PANEL: BRAND & VISUALS */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
          alt="Premium Experience"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
        
        {/* BRAND CONTENT */}
        <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
           <div>
              <div className="flex items-center gap-3 mb-12">
                 <div className="w-10 h-10 bg-vortexBuy rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">V</div>
                 <span className="text-2xl font-black tracking-tight text-white uppercase">Vortex<span className="text-vortexBuy">Buy</span></span>
              </div>
              <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter mb-8 max-w-lg">
                ELEVATE YOUR <br />
                <span className="text-vortexBuy">SHOPPING</span> <br />
                EXPERIENCE.
              </h2>
           </div>
           
           <div className="max-w-md">
              <p className="text-gray-300 text-lg font-medium leading-relaxed mb-8">
                "VortexBuy provides more than just products; it offers a curated lifestyle that defines the modern standard."
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-vortexBuy shadow-xl">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" alt="Testimonial" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <div className="text-white font-bold">Alessandra Rossi</div>
                    <div className="text-vortexBuy text-sm font-medium">Verified Curator</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT PANEL: FORM */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 md:p-16 xl:p-24 bg-white relative">
        <div className="w-full max-w-md animate-fade-up">
           {/* Mobile Logo */}
           <div className="lg:hidden flex justify-center mb-10">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-vortexBuy rounded-lg flex items-center justify-center font-bold text-white text-lg">V</div>
                 <span className="text-xl font-black tracking-tight uppercase">Vortex<span className="text-vortexBuy">Buy</span></span>
              </div>
           </div>

           <div className="mb-12">
              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{formTitle}</h1>
              <p className="text-gray-500 font-medium">{formSubtitle}</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              {mode === MODE.REGISTER && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="LuxuryCollector"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-vortexBuy/30 focus:ring-4 focus:ring-vortexBuy/5 transition-all font-medium text-gray-900"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              )}

              {mode !== MODE.EMAIL_VERIFICATION && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Identity / Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@vortexbuy.com"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-vortexBuy/30 focus:ring-4 focus:ring-vortexBuy/5 transition-all font-medium text-gray-900"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {mode === MODE.EMAIL_VERIFICATION && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Access Key</label>
                  <input
                    type="text"
                    required
                    placeholder="000-000"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-vortexBuy/30 focus:ring-4 focus:ring-vortexBuy/5 transition-all font-medium text-gray-900 text-center tracking-[0.5em]"
                    onChange={(e) => setEmailCode(e.target.value)}
                  />
                </div>
              )}

              {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Secure Password</label>
                    {mode === MODE.LOGIN && (
                       <span 
                         onClick={() => setMode(MODE.RESET_PASSWORD)}
                         className="text-xs font-bold text-vortexBuy hover:underline cursor-pointer"
                       >
                         Forgot?
                       </span>
                    )}
                   </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-vortexBuy/30 focus:ring-4 focus:ring-vortexBuy/5 transition-all font-medium text-gray-900"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:bg-black/90 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {buttonTitle}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100">{error}</div>}
              {message && <div className="p-4 bg-vortexBuy/5 text-vortexBuy rounded-xl text-sm font-bold text-center border border-vortexBuy/10">{message}</div>}

              {/* FOOTER ACTIONS */}
              <div className="pt-8 text-center">
                {mode === MODE.LOGIN && (
                  <p className="text-gray-500 font-medium">
                    New to the collection?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode(MODE.REGISTER)}
                      className="text-gray-900 font-black hover:text-vortexBuy transition-colors"
                    >
                      Join Now
                    </button>
                  </p>
                )}

                {mode === MODE.REGISTER && (
                  <p className="text-gray-500 font-medium">
                    Already a member?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode(MODE.LOGIN)}
                      className="text-gray-900 font-black hover:text-vortexBuy transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                )}

                {mode === MODE.RESET_PASSWORD && (
                  <button 
                    type="button"
                    onClick={() => setMode(MODE.LOGIN)}
                    className="text-gray-900 font-black hover:text-vortexBuy transition-colors"
                  >
                    Back to Secure Login
                  </button>
                )}
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
