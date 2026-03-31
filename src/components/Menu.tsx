


import { Link } from "react-router-dom";
import React, { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <img
        src="/menu.png"
        alt="menu"
        width={20}
        height={20}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-5 text-lg z-10">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/logout">Logout</Link>
          <Link to="/cart">Cart[1]</Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
