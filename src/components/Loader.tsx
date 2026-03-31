import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Timer to start fade out animation
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Timer to completely remove from DOM
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-vortexBuy/20 blur-3xl animate-pulse rounded-full" />
        
        {/* Logo Icon Mockup */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-vortexBuy rounded-2xl flex items-center justify-center shadow-2xl rotate-12 transition-transform duration-700 hover:rotate-0">
             <span className="text-white text-4xl font-bold -rotate-12">V</span>
          </div>
          {/* Orbital Ring Animation */}
          <div className="absolute inset-0 border-2 border-vortexBuy/30 rounded-full scale-150 animate-ping opacity-20" />
        </div>

        {/* Text Animation */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Vortex<span className="text-vortexBuy">Buy</span>
          </h1>
          
          {/* Modern Progress Bar */}
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-vortexBuy animate-shimmer-progress rounded-full" />
          </div>
          
          <p className="mt-4 text-xs font-medium text-gray-400 uppercase tracking-[0.2em] animate-fade-in">
            Elevating Your Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
