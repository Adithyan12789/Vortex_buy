
import { Link } from "react-router-dom";
import React from "react";
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";

const Footer = () => {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 xl:px-32 bg-gray-950 text-gray-400 text-sm mt-32 relative overflow-hidden border-t-4 border-vortexBuy">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-vortexBuy/50 to-transparent"></div>
      
      {/* TOP */}
      <div className="flex flex-col lg:flex-row justify-between gap-20">
        {/* LEFT: BRANDING */}
        <div className="w-full lg:w-1/3 flex flex-col gap-10">
          <Link to="/">
            <div className="text-4xl font-black text-white tracking-tighter italic">VORTEX<span className="text-vortexBuy">BUY.</span></div>
          </Link>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <HiOutlineMapPin className="text-xl text-vortexBuy shrink-0" />
              <p className="leading-relaxed">
                Ryqon Digitals HQ<br />
                Hyderabad, Telangana, IN
              </p>
            </div>
            <div className="flex items-center gap-4">
              <HiOutlineEnvelope className="text-xl text-vortexBuy shrink-0" />
              <span className="font-bold text-gray-200">contact@ryqondigitals.com</span>
            </div>
            <div className="flex items-center gap-4">
              <HiOutlinePhone className="text-xl text-vortexBuy shrink-0" />
              <span className="font-bold text-gray-200">+91 9000155767</span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            {["facebook", "instagram", "youtube", "x"].map((icon) => (
              <div key={icon} className="p-3 rounded-2xl bg-gray-900 border border-gray-800 hover:border-vortexBuy/50 hover:bg-vortexBuy/5 transition-all cursor-pointer group">
                <img
                  src={`/${icon}.png`}
                  alt={icon}
                  width={16}
                  height={16}
                  className="opacity-50 group-hover:opacity-100 invert"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1">
          <div className="flex flex-col gap-10">
            <h1 className="font-black text-white text-xs uppercase tracking-[0.4em]">Company</h1>
            <div className="flex flex-col gap-5 text-gray-500 font-medium whitespace-nowrap">
              <Link to="/" className="hover:text-vortexBuy transition-colors">Our Excellence</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Vault Careers</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Privilege Affiliates</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Market Blog</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Direct Contact</Link>
            </div>
          </div>
          
          <div className="flex flex-col gap-10">
            <h1 className="font-black text-white text-xs uppercase tracking-[0.4em]">Collections</h1>
            <div className="flex flex-col gap-5 text-gray-500 font-medium whitespace-nowrap">
              <Link to="/" className="hover:text-vortexBuy transition-colors">New Arrivals</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Boutique Assets</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Gentleman's Archive</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Ladies' Vault</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Global Inventory</Link>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <h1 className="font-black text-white text-xs uppercase tracking-[0.4em]">Protocol</h1>
            <div className="flex flex-col gap-5 text-gray-500 font-medium whitespace-nowrap">
              <Link to="/" className="hover:text-vortexBuy transition-colors">Concierge Service</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Global Logistics</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Legal & Authentic</Link>
              <Link to="/" className="hover:text-vortexBuy transition-colors">Security Vault</Link>
            </div>
          </div>
        </div>

        {/* RIGHT: SUBSCRIBE */}
        <div className="w-full lg:w-1/4 flex flex-col gap-10">
          <h1 className="font-black text-white text-xs uppercase tracking-[0.4em]">The Inner Circle</h1>
          <p className="leading-relaxed">
            Gain early access to exclusive acquisitions and marketplace incentives.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Vault ID (Email)"
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 w-full text-white focus:outline-none focus:border-vortexBuy/50 placeholder:text-gray-600 transition-all"
              />
              <button title="join" className="px-6 py-5 bg-vortexBuy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-vortexBuy/80 hover:shadow-2xl hover:shadow-vortexBuy/20 transition-all transform active:scale-95">
                JOIN
              </button>
            </div>
            
            <div className="mt-6">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-4 block opacity-40">Secured Protocols</span>
              <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <img src="/paypal.png" alt="PayPal" className="h-4" />
                <img src="/mastercard.png" alt="Mastercard" className="h-4" />
                <img src="/visa.png" alt="Visa" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 mt-24 pt-10 border-t border-gray-900">
        <div className="text-gray-500 text-xs">
          © 2025 VortexBuy Marketplace. <br className="md:hidden" /> 
          Exclusive Architecture by <a href="https://www.ryqondigitals.com" target="_blank" rel="noreferrer" className="text-vortexBuy font-black hover:underline tracking-tighter italic">RYQON DIGITALS.</a>
        </div>

        <div className="flex items-center gap-10 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <span className="w-1 h-1 bg-vortexBuy rounded-full"></span>
            English (Global)
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <span className="w-1 h-1 bg-vortexBuy rounded-full"></span>
            ₹ INR (Central)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
