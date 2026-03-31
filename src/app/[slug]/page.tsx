import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ProductList from "@/components/ProductList";

const SinglePage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progress = document.getElementById("scroll-progress");
      if (progress) progress.style.width = scrolled + "%";
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-vortexBuy/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-vortexBuy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!product) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
      <div className="text-9xl font-black text-gray-100 mb-4 select-none">404</div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Not Found</h1>
      <p className="text-gray-500 mt-4 max-w-md mx-auto">The exclusive piece you're looking for might have been moved or is no longer available in our collection.</p>
      <Link to="/list" className="mt-10 px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl shadow-black/10">Return to Gallery</Link>
    </div>
  );

  const isStockLow = product.stock?.quantity > 0 && product.stock?.quantity <= 10;
  const isOutOfStock = !product.stock?.quantity || product.stock?.quantity === 0;

  // Extract full description from additional info if it exists, otherwise use standard description
  const fullDescSection = product.additionalInfoSections?.find((s: any) => 
    s.title?.toLowerCase().includes('description') || 
    s.title?.toLowerCase().includes('about') ||
    s.title?.toLowerCase().includes('details')
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 xl:px-24 relative mt-6 mb-32 animate-fade-up">
      {/* Scroll Progress Line (Subtle) */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-gray-100 z-50 overflow-hidden">
        <div id="scroll-progress" className="h-full bg-vortexBuy transition-all duration-300 w-0"></div>
      </div>

      {/* PRE-HEADER: BREADCRUMB */}
      <nav className="mb-10 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold flex items-center gap-3">
        <Link to="/" className="hover:text-vortexBuy transition-colors">Home</Link>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <Link to="/list" className="hover:text-vortexBuy transition-colors">Collection</Link>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="text-gray-900 line-clamp-1">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* LEFT COLUMN: VISUALS */}
        <div className="w-full lg:w-1/2 lg:sticky top-24 h-max">
          <div className="relative group">
            <div className="absolute -inset-10 bg-vortexBuy/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
            <ProductImages items={product.media?.items} />
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6 mt-16">
            {[
              { icon: 'auto_awesome', label: 'Artisanal Quality', sub: 'Handpicked materials' },
              { icon: 'verified', label: 'Authentic Piece', sub: 'Original Vortex collection' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col p-8 rounded-[2rem] bg-white border border-gray-100/60 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-vortexBuy/10 flex items-center justify-center mb-6 text-vortexBuy">
                  <span className="material-icons-outlined text-2xl">{f.icon}</span>
                </div>
                <span className="text-xs font-black text-gray-900 uppercase tracking-[0.1em]">{f.label}</span>
                <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest leading-loose">{f.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-16">
          {/* PRODUCT HEADER */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="text-vortexBuy text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 bg-vortexBuy/5 rounded-full border border-vortexBuy/10 shadow-sm">
                In View: {product.categorySlug || "Exclusive"}
              </span>
              {isStockLow && !isOutOfStock && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Limited Availability</span>
                </div>
              )}
            </div>

            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] -ml-1">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-8 mt-4">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-4">
                   <span className="text-6xl font-black text-gray-900 tracking-tighter">₹{product.price?.discountedPrice || product.price?.price}</span>
                   {product.price?.price !== product.price?.discountedPrice && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300 line-through font-bold">₹{product.price?.price}</span>
                      <span className="text-vortexBuy text-[10px] font-black uppercase tracking-widest">
                        Save {Math.round(((product.price.price - product.price.discountedPrice) / product.price.price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT CONTENT (FULL DESCRIPTION) */}
          <div className="flex flex-col gap-12">
            <div className="flex items-center gap-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Specifications / The Concept</h4>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
            </div>
            
            <div className="flex flex-col gap-10">
              <div className="text-gray-800 text-xl md:text-2xl leading-[1.6] font-medium tracking-tight">
                {product.description ? (
                  <div className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:font-black prose-strong:text-vortexBuy" dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p className="opacity-60">
                    {product.additionalInfoSections?.[0]?.description || "Experience the pinnacle of curated design and modern luxury."}
                  </p>
                )}
              </div>

              {/* Grid of detail sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 p-10 bg-gray-50/50 rounded-[3rem] border border-gray-100/50">
                {product.additionalInfoSections?.filter((s:any) => s.title !== 'shortDesc').map((section: any) => (
                  <div key={section.title} className="flex flex-col gap-4">
                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-vortexBuy rounded-full"></span>
                      {section.title}
                    </h5>
                    <div 
                      className="text-gray-500 text-sm leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHECKOUT CARD - PREMIUM GLASS EFFECT */}
          <div className="glass p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-vortexBuy/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-vortexBuy/10 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-100 rounded-full -ml-16 -mb-16 blur-3xl"></div>
            
            <div className="relative z-10">
              {product.variants && product.productOptions && product.productOptions.length > 0 ? (
                <CustomizeProducts
                  productId={product._id!}
                  variants={product.variants}
                  productOptions={product.productOptions}
                />
              ) : (
                <Add 
                  productId={product._id || "unknown-id"} 
                  variantId="00000000-0000-0000-0000-000000000000" 
                  stockNumber={product.stock?.quantity || 0}
                />
              )}
            </div>
          </div>

          {/* TRUST BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10 py-6 rounded-3xl bg-gray-50 border border-gray-100">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <span className="material-icons-outlined text-vortexBuy text-sm">history</span>
               </div>
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Universal Returns</span>
             </div>
             <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <span className="material-icons-outlined text-vortexBuy text-sm">enhanced_encryption</span>
               </div>
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Encrypted Checkout</span>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER: RELATED PRODUCTS */}
      <div className="mt-48 pt-24 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-xl">
            <span className="text-[11px] font-black text-vortexBuy uppercase tracking-[0.6em] mb-6 block">Curated Recommendations</span>
            <h2 className="text-6xl xl:text-7xl font-black text-gray-900 tracking-tighter leading-none">Designed to Pair</h2>
          </div>
          <Link to={`/list?cat=${product.categorySlug}`} className="group relative bg-white border-2 border-gray-900 px-10 py-4 rounded-full overflow-hidden transition-all duration-300">
            <div className="absolute inset-0 w-0 bg-gray-900 transition-all duration-300 group-hover:w-full"></div>
            <span className="relative z-10 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 group-hover:text-white">
              Discover All Pieces
              <span className="material-icons-outlined text-lg">east</span>
            </span>
          </Link>
        </div>
        
        <div className="transform origin-top transition-all duration-1000">
          <ProductList 
            categoryId={product.categorySlug} 
            limit={4} 
            hidePagination={true}
            excludeId={product._id}
          />
        </div>
      </div>
    </div>
  );
};

export default SinglePage;

