import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import Pagination from './Pagination';
import axios from 'axios';

/* ── Skeleton card ── */
const SkeletonCard = ({ delay }: { delay: string }) => (
  <div
    className="w-full sm:w-[48%] lg:w-[23%] flex flex-col gap-3 animate-fade-up opacity-0-init"
    style={{ animationDelay: delay }}
  >
    <div className="w-full h-80 rounded-xl skeleton" />
    <div className="h-4 w-3/4 rounded skeleton" />
    <div className="h-4 w-1/2 rounded skeleton" />
    <div className="h-8 w-28 rounded-full skeleton" />
  </div>
);

const staggerDelays = ['0.05s', '0.15s', '0.25s', '0.35s', '0.45s', '0.55s', '0.65s', '0.75s'];

const ProductList = ({
  categoryId,
  limit,
  searchParams: additionalParams,
  hidePagination = false,
  excludeId,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
  hidePagination?: boolean;
  excludeId?: string;
}) => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const [res, setRes] = useState<any>({
    items: [],
    currentPage: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = { limit, page, ...additionalParams };
        if (categoryId) params.categoryId = categoryId;
        if (excludeId) params.exclude = excludeId;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { params });
        setRes(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, limit, page, additionalParams]);

  if (loading) {
    return (
      <div className="mt-12 flex gap-x-6 gap-y-10 justify-between flex-wrap">
        {Array.from({ length: limit || 4 }).map((_, i) => (
          <SkeletonCard key={i} delay={staggerDelays[i] || '0.1s'} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12 flex gap-x-6 gap-y-10 justify-between flex-wrap">
      {res.items.map((product: any, i: number) => (
        <Link
          key={product._id}
          to={'/' + product.slug}
          className="w-full sm:w-[48%] lg:w-[23%] flex flex-col gap-4 group animate-fade-up opacity-0-init"
          style={{ animationDelay: staggerDelays[i] || '0.1s' }}
        >
          {/* Image box */}
          <div className="card-shine relative w-full h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow duration-400">
            {/* Main image */}
            <img
              src={product.media?.mainMedia?.image?.url || '/product.png'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
            />
            {/* Hover image */}
            <img
              src={
                product.media?.items?.[1]?.image?.url ||
                product.media?.mainMedia?.image?.url ||
                '/product.png'
              }
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick-add pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <span className="bg-white text-gray-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                View Product →
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex justify-between items-start px-1">
            <span className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 max-w-[70%] group-hover:text-vortexBuy transition-colors duration-200">
              {product.name}
            </span>
            <span className="font-bold text-vortexBuy text-sm whitespace-nowrap ml-2">
              ₹{product.price?.price}
            </span>
          </div>

          {product.additionalInfoSections && (
            <div
              className="text-xs text-gray-400 px-1 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (s: any) => s.title === 'shortDesc'
                  )?.description || ''
                ),
              }}
            />
          )}

          <button className="self-start rounded-full border border-vortexBuy text-vortexBuy text-xs py-2 px-5 font-semibold
            hover:bg-vortexBuy hover:text-white hover:shadow-lg hover:shadow-vortexBuy/30
            transition-all duration-250 active:scale-95">
            Add to Cart
          </button>
        </Link>
      ))}

      {!hidePagination && (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev}
          hasNext={res.hasNext}
        />
      )}
    </div>
  );
};

export default ProductList;
