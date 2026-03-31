import { useState } from 'react';
import React from 'react';

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [fading, setFading] = useState(false);

  const switchImage = (i: number) => {
    if (i === index) return;
    setFading(true);
    setTimeout(() => {
      setIndex(i);
      setFading(false);
    }, 250);
  };

  if (!items || items.length === 0) {
    return (
      <div className="h-[600px] w-full bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center text-gray-300 gap-4">
        <span className="material-icons-outlined text-5xl opacity-20">inventory_2</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Visuals Unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* MAIN VISUAL EXHIBIT */}
      <div 
        className="h-[640px] md:h-[720px] w-full relative overflow-hidden rounded-[3rem] bg-gray-50 shadow-2xl shadow-black/5 group cursor-zoom-in group"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
      >
        <img
          key={index}
          src={items[index]?.image?.url || '/product.png'}
          alt="Product Exhibit"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            fading ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'
          } ${isZooming ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Artistic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Counter Badge - Glassmorphism */}
        {items.length > 1 && (
          <div className="absolute top-6 right-6 glass px-5 py-2 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-md">
            <span className="text-[10px] font-black text-gray-900 tracking-widest">{index + 1}</span>
            <span className="w-4 h-[1px] bg-gray-300"></span>
            <span className="text-[10px] font-black text-gray-400 tracking-widest">{items.length}</span>
          </div>
        )}

        {/* Interactive Navigation - Hidden on idle, visible on hover */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); switchImage((index - 1 + items.length) % items.length); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/50 backdrop-blur-2xl shadow-2xl text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:scale-110 active:scale-95"
            >
              <span className="material-icons-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); switchImage((index + 1) % items.length); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/50 backdrop-blur-2xl shadow-2xl text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:scale-110 active:scale-95"
            >
              <span className="material-icons-outlined text-lg">chevron_right</span>
            </button>
          </>
        )}
      </div>

      {/* CURATED THUMBNAILS CAROUSEL */}
      {items.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-2">
          {items.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => switchImage(i)}
              className={`relative flex-shrink-0 h-24 w-24 rounded-3xl overflow-hidden border-2 transition-all duration-500 transform
                ${i === index
                  ? 'border-vortexBuy shadow-2xl shadow-vortexBuy/30 scale-105 ring-4 ring-vortexBuy/10 z-10'
                  : 'border-transparent grayscale hover:grayscale-0 hover:scale-105 opacity-60 hover:opacity-100'
                }`}
            >
              <img
                src={item.image?.url || '/product.png'}
                alt={`view-${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {i === index && (
                <div className="absolute inset-0 bg-vortexBuy/5 pointer-events-none animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;

