import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" 
            alt="About VortexBuy" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter animate-fade-up">
            REDEFINING <span className="text-vortexBuy">COMMERCE</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium animate-fade-up stagger-2">
            VortexBuy was born from a simple idea: that premium quality and seamless experience should be accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-up">
            <span className="text-vortexBuy font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">The Journey to Excellence</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in 2024, VortexBuy began as a small boutique dedicated to sourcing the world's most innovative products. Today, we've evolved into a global platform, yet our core mission remains unchanged.
              </p>
              <p>
                We believe that every product tells a story—one of craftsmanship, dedication, and purpose. Our team travels the globe to partner with creators who share our commitment to quality and sustainability.
              </p>
              <p>
                From cutting-edge technology to timeless fashion, we curate each item with meticulous attention to detail, ensuring that when you shop with us, you're not just buying a product; you're investing in an experience.
              </p>
            </div>
          </div>
          
          <div className="relative animate-fade-up stagger-2">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" 
                alt="Our Team" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
            {/* Design accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-vortexBuy/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-6 w-32 h-32 border-[20px] border-vortexBuy/10 rounded-full z-0" />
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 bg-gray-50 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <div className="h-1.5 w-20 bg-vortexBuy mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { 
              title: "Quality First", 
              desc: "We never compromise. Every item in our catalog is tested for durability and performance.",
              icon: "✨"
            },
            { 
              title: "Customer Obsession", 
              desc: "Your satisfaction is our only metric for success. We're here to help, 24/7.",
              icon: "❤️"
            },
            { 
              title: "Sustainable Innovation", 
              desc: "We look towards the future, prioritizing eco-friendly packaging and ethical sourcing.",
              icon: "🌍"
            }
          ].map((value, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-vortexBuy/20">
               <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300 inline-block">{value.icon}</div>
               <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
               <p className="text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <div className="text-4xl md:text-6xl font-black text-vortexBuy mb-2">1M+</div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black text-vortexBuy mb-2">50+</div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Premium Brands</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black text-vortexBuy mb-2">24/7</div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Expert Support</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black text-vortexBuy mb-2">全球</div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Shipping Network</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
