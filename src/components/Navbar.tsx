import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { Link } from 'react-router-dom';
import Searchbar from './Searchbar';
import Navicons from './Navicons';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-md shadow-black/5'
          : 'bg-white/90'
      }`}
    >
      {/* Mobile */}
      <div className="flex justify-between items-center h-full md:hidden">
        <Link to="/">
          <span className="text-2xl font-extrabold tracking-tight">
            Vortex<span className="text-vortexBuy">Buy</span>
          </span>
        </Link>
        <Menu />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between gap-5 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
            <span className="text-2xl font-extrabold tracking-tight">
              Vortex<span className="text-vortexBuy">Buy</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {[
              { label: 'Home',    to: '/' },
              { label: 'Shop',    to: '/list' },
              { label: 'Deals',   to: '/deals' },
              { label: 'About',   to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="nav-link text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-end gap-4 xl:gap-8">
          <Searchbar />
          <Navicons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;