import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from './Searchbar';
import Navicons from './Navicons';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home',    to: '/' },
    { label: 'Shop',    to: '/list' },
    { label: 'Deals',   to: '/deals' },
    { label: 'About',   to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-black/5 border-b border-gray-100'
          : 'bg-white/85 backdrop-blur-md border-b border-gray-100/60'
      }`}
    >
      <div className="h-20 px-4 md:px-8 lg:px-12 xl:px-20 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LEFT: BRAND LOGO */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-vortexBuy to-orange-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-vortexBuy/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              V
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight uppercase text-gray-950">
              Vortex<span className="text-vortexBuy">Buy</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS (Visible on lg and above) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(({ label, to }) => {
              const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={label}
                  to={to}
                  className={`relative text-xs font-bold uppercase tracking-wider transition-colors duration-200 py-1 ${
                    isActive
                      ? 'text-vortexBuy'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-vortexBuy rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT: SEARCHBAR & NAVICONS */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-6 flex-1 max-w-xl">
          {/* Searchbar (Desktop & Tablet) */}
          <div className="hidden sm:block flex-1 max-w-xs xl:max-w-sm">
            <Searchbar />
          </div>

          {/* Navicons (Cart, Notifications, Profile) */}
          <Navicons />

          {/* Mobile Hamburger Toggle (Visible on lg and below) */}
          <div className="lg:hidden pl-1">
            <Menu />
          </div>
        </div>
      </div>

      {/* MOBILE SEARCHBAR ROW (Visible on small screens < 640px) */}
      <div className="sm:hidden px-4 pb-3 pt-0">
        <Searchbar />
      </div>
    </header>
  );
};

export default Navbar;