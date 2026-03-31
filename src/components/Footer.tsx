
import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <div className="py-24 px-4 md-px-8 lg:px-16 xl:px-32 2xl:px-32 bg-gray-100 text-sm mt-24">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-24">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link to="/">
            <div className="text-2xl tracking-wide">VORTEXBUY</div>
          </Link>
          <p>
            Near J7P7+V4V, Vadakkumuri Rd, Thrissur, Wadakkanchery, Thekkumkara
          </p>
          <span className="font-semibold">adithiruthiparambil12Gmail.com</span>
          <span className="font-semibold">+91 8891768287</span>

          <div className="flex gap-6">
            <img
              src="/facebook.png"
              alt="Facebook"
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <img
              src="/instagram.png"
              alt="Instagram"
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <img
              src="/youtube.png"
              alt="Youtube"
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <img
              src="/pinterest.png"
              alt="Pinterest"
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <img
              src="/x.png"
              alt="X"
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-4">
              <Link to="/">About Us</Link>
              <Link to="/">Careers</Link>
              <Link to="/">Affiliates</Link>
              <Link to="/">Blog</Link>
              <Link to="/">Contact Us</Link>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-4">
              <Link to="/">New Arrivals</Link>
              <Link to="/">Accessories</Link>
              <Link to="/">Men</Link>
              <Link to="/">Women</Link>
              <Link to="/">All Products</Link>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">HELP</h1>
            <div className="flex flex-col gap-4">
              <Link to="/">Customer Service</Link>
              <Link to="/">My Account</Link>
              <Link to="/">Find a store</Link>
              <Link to="/">Legal & Privacy</Link>
              <Link to="/">Gift Card</Link>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">SUBSCRIBE</h1>

          <p>
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>

          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="p-4 w-3/4"
            />
            <button title="join" className="w-1/4 bg-vortexBuy text-white">
              JOIN
            </button>
          </div>
          <span className="font-semibold">Secure Payments</span>
          <div className="flex justify-between">
            <img src="/discover.png" alt="" width={40} height={20} />
            <img src="/skrill.png" alt="" width={40} height={20} />
            <img src="/paypal.png" alt="" width={40} height={20} />
            <img src="/mastercard.png" alt="" width={40} height={20} />
            <img src="/visa.png" alt="" width={40} height={20} />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-16">
        <div>© 2025 VortexBuy Shop</div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div>
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">India | English</span>
          </div>
          
          <div>
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">₹ INR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
