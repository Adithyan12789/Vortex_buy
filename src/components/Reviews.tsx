
import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiStar, HiOutlineUserCircle, HiCheckBadge } from "react-icons/hi2";

const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews?productId=${productId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !userName) return alert("Please provide your name and thoughts.");
    
    setIsLoading(true);
    try {
      const guestId = localStorage.getItem("guestId") || "guest_unknown";
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/add`, {
        productId,
        guestId,
        userName,
        rating,
        comment,
      });
      setReviews([res.data, ...reviews]);
      setComment("");
      setUserName("");
      setRating(5);
    } catch (err) {
      console.error("Review submission failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0";

  return (
    <div className="flex flex-col gap-24">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-xl">
           <span className="text-[11px] font-black text-vortexBuy uppercase tracking-[0.6em] mb-6 block">The Collector Perspective</span>
           <h2 className="text-6xl xl:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-8 italic">Authentication & <span className="text-gray-200">Aclaim.</span></h2>
           <p className="text-gray-500 font-medium leading-relaxed">
             Read verified testimonials from the global collector community. Every acquisition tells a story of modern luxury and curated design.
           </p>
        </div>
        
        <div className="flex items-center gap-10 p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
           <div className="flex flex-col">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">{averageRating}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global Score</span>
           </div>
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar key={s} className={`text-xl ${Number(averageRating) >= s ? 'text-vortexBuy' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Based on {reviews.length} Archives</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        {/* ADD REVIEW FORM - PREMIUM LOOK */}
        <div className="lg:col-span-5 p-12 bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-black/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vortexBuy/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-vortexBuy/10 transition-all duration-700"></div>
          
          <h3 className="text-2xl font-black tracking-tight text-gray-900 mb-10">Add Your Archive.</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Your Signature</label>
              <input 
                 value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 type="text" 
                 placeholder="Full Signature Name" 
                 className="bg-gray-50 border border-gray-100 rounded-3xl p-5 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-vortexBuy/10 transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Authenticity Rating</label>
              <div className="flex items-center gap-4 bg-gray-50 p-5 px-8 rounded-3xl border border-gray-100">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStar 
                    key={s} 
                    className={`text-2xl cursor-pointer transition-all hover:scale-125 ${rating >= s ? 'text-vortexBuy' : 'text-gray-200'}`} 
                    onClick={() => setRating(s)}
                  />
                ))}
                <span className="ml-auto text-xs font-black text-gray-900">{rating}/5</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">The Testimonial</label>
              <textarea 
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 rows={4} 
                 placeholder="Share your curated experience..." 
                 className="bg-gray-50 border border-gray-100 rounded-[2rem] p-5 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-vortexBuy/10 transition-all font-medium resize-none shadow-inner"
              />
            </div>

            <button 
               disabled={isLoading}
               className="w-full mt-4 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-vortexBuy hover:shadow-2xl hover:shadow-vortexBuy/20 transition-all duration-500 active:scale-95 disabled:bg-gray-200 shadow-xl shadow-black/10"
            >
              {isLoading ? "Synchronizing Vault..." : "Publish Testimonial"}
            </button>
          </form>
        </div>

        {/* REVIEWS LIST */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {reviews.length === 0 ? (
            <div className="py-24 text-center bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200">
               <span className="material-icons-outlined text-4xl text-gray-200 mb-6">history_edu</span>
               <p className="text-gray-400 font-medium">Be the first collector to authenticate this piece.</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <div 
                key={r._id} 
                className="group flex flex-col gap-8 p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden relative group-hover:scale-105 transition-transform">
                        <HiOutlineUserCircle className="text-4xl text-gray-200" />
                        <div className="absolute inset-0 bg-vortexBuy/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-gray-900 hover:text-vortexBuy transition-colors">{r.userName}</span>
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                             <HiCheckBadge className="text-green-500 text-sm" />
                             <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified Collector</span>
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Acquired on: {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <HiStar key={s} className={`text-sm ${r.rating >= s ? 'text-vortexBuy' : 'text-gray-100'}`} />
                      ))}
                   </div>
                </div>

                <div className="relative">
                   <div className="absolute -left-4 top-0 w-1 h-full bg-vortexBuy/10 rounded-full group-hover:bg-vortexBuy transition-colors duration-500"></div>
                   <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed italic pr-10">
                     "{r.comment}"
                   </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
