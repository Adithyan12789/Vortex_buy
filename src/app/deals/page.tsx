import React from 'react';
import ProductList from "@/components/ProductList";

const DealsPage = () => {
  return (
    <div className=''>
      {/* EVENT BANNER */}
      <div className='relative h-[400px] md:h-[500px] w-full overflow-hidden bg-black flex items-center justify-center'>
        {/* Animated Background Layers */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-vortexBuy/40 via-transparent to-vortexBuy/40 mix-blend-overlay' />
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da" 
            alt="Mega Sale"
            className='w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom' 
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60' />
        </div>

        <div className='relative z-10 text-center px-4'>
           <div className='inline-block mb-4 px-4 py-1.5 rounded-full bg-vortexBuy text-white text-sm font-bold tracking-widest uppercase animate-fade-in'>
             Limited Time Event
           </div>
           <h1 className='text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter animate-fade-up uppercase'>
             MEGA<span className='text-vortexBuy'>VORTEX</span> SALE
           </h1>
           <p className='text-xl md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto mb-10 animate-fade-up stagger-2'>
             Experience the ultimate shopping event. Unbeatable discounts on premium tech, fashion, and lifestyle essentials.
           </p>
           <div className='flex flex-wrap justify-center gap-6 animate-fade-up stagger-3'>
              <div className='flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 min-w-[120px]'>
                 <span className='text-3xl font-bold text-white'>UP TO</span>
                 <span className='text-4xl font-extrabold text-vortexBuy'>70%</span>
              </div>
              <div className='flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 min-w-[120px]'>
                 <span className='text-3xl font-bold text-white'>ENDS IN</span>
                 <span className='text-4xl font-extrabold text-vortexBuy'>48H</span>
              </div>
           </div>
        </div>
        
        {/* Floating elements for premium feel */}
        <div className='absolute -bottom-10 -right-10 w-64 h-64 bg-vortexBuy/30 rounded-full blur-3xl opacity-50 animate-pulse' />
        <div className='absolute -top-10 -left-10 w-64 h-64 bg-vortexBuy/30 rounded-full blur-3xl opacity-50 animate-pulse' />
      </div>

      {/* PRODUCTS SECTION */}
      <div className='max-w-7xl mx-auto px-4 md:px-8 py-20'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
          <div>
             <h2 className='text-4xl font-bold text-gray-900'>Hot Deals</h2>
             <p className='text-gray-500 mt-2'>The most discounted products from our collection</p>
          </div>
          <div className='flex gap-4'>
             <span className='px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-600'>Best Sellers</span>
             <span className='px-4 py-2 bg-vortexBuy/10 rounded-full text-sm font-semibold text-vortexBuy border border-vortexBuy/20'>Biggest Savings</span>
          </div>
        </div>
        
        <ProductList 
          categoryId="" 
          searchParams={{ isDeals: 'true', sort: 'price_asc' }} 
        />
      </div>
      
      {/* PREMIUM NEWSLETTER/CTA */}
      <div className='bg-gray-50 py-24 border-y border-gray-100'>
         <div className='max-w-4xl mx-auto text-center px-4'>
            <h3 className='text-3xl font-bold mb-4'>Don't Miss Out</h3>
            <p className='text-gray-600 mb-8'>Sign up for early access to our next event and receive an additional 10% discount on your first order.</p>
            <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
               <input 
                 type="text" 
                 placeholder="Enter your email" 
                 className='flex-1 px-6 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-vortexBuy/20 transition-all font-mediumShadow-sm'
               />
               <button className='bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-xl shadow-black/10'>
                 Join Now
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DealsPage;
