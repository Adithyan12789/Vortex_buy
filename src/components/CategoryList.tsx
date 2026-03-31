import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
  const [cats, setCats] = useState<any>({ items: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCats(res.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoaded(true);
      }
    };
    fetchCats();
  }, []);

  /* Skeleton */
  if (!loaded) {
    return (
      <div className="px-4 flex gap-4 md:gap-6 overflow-x-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-[180px] h-56 rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  if (!cats?.items?.length) {
    return (
      <p className="px-4 text-gray-400 text-sm mt-4">No categories yet.</p>
    );
  }

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-6">
        {cats.items.map((item: any, i: number) => (
          <Link
            key={item._id}
            to={`/list?cat=${item.slug}`}
            className="group relative flex-shrink-0 w-40 sm:w-48 md:w-56 h-56 md:h-64 rounded-2xl overflow-hidden shadow-md
              animate-fade-up opacity-0-init
              hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15
              transition-all duration-350 cursor-pointer"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Background image */}
            <img
              src={item.media?.mainMedia?.image?.url || '/cat.png'}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider drop-shadow-md
                translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                {item.name}
              </h2>
              <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Shop now →
              </p>
            </div>

            {/* Top shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
