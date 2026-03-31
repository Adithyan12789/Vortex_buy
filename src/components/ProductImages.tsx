import { useState } from 'react';
import React from 'react';

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const switchImage = (i: number) => {
    if (i === index) return;
    setFading(true);
    setTimeout(() => {
      setIndex(i);
      setFading(false);
    }, 220);
  };

  if (!items || items.length === 0) {
    return (
      <div className="h-[520px] w-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="h-[520px] w-full relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg group">
        <img
          key={index}
          src={items[index]?.image?.url || '/product.png'}
          alt="Product"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
            fading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        {/* Subtle gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        {/* Image counter badge */}
        {items.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {index + 1} / {items.length}
          </div>
        )}

        {/* Arrow nav (shows when multiple images) */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => switchImage((index - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 text-lg font-bold"
            >
              ‹
            </button>
            <button
              onClick={() => switchImage((index + 1) % items.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 text-lg font-bold"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {items.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => switchImage(i)}
              className={`relative flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-all duration-250
                ${i === index
                  ? 'border-vortexBuy shadow-md shadow-vortexBuy/30 scale-105 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90 hover:scale-105 hover:border-gray-300'
                }`}
            >
              <img
                src={item.image?.url || '/product.png'}
                alt={`view-${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
