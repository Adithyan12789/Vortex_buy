import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: { price: number; discountedPrice?: number };
  media: { mainMedia?: { image?: { url: string } }; items?: { image?: { url: string } }[] };
  additionalInfoSections?: { title: string; description: string }[];
  categorySlug?: string;
}

/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <div className="w-full h-72 rounded-2xl skeleton" />
    <div className="h-4 w-2/3 rounded-lg skeleton mt-1" />
    <div className="h-4 w-1/3 rounded-lg skeleton" />
  </div>
);

/* ─────────────────────────────────────────────
   Product card
───────────────────────────────────────────── */
const ProductCard = ({ product, delay }: { product: Product; delay: string }) => {
  const hasDiscount =
    product.price?.discountedPrice != null &&
    product.price.discountedPrice < product.price.price;

  return (
    <Link
      to={`/${product.slug}`}
      className="group flex flex-col gap-3 animate-fade-up opacity-0-init"
      style={{ animationDelay: delay }}
    >
      {/* Image */}
      <div className="card-shine relative w-full h-72 overflow-hidden rounded-2xl bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-30 bg-vortexBuy text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
            Sale
          </div>
        )}
        <img
          src={product.media?.mainMedia?.image?.url || '/product.png'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
        />
        <img
          src={
            product.media?.items?.[1]?.image?.url ||
            product.media?.mainMedia?.image?.url ||
            '/product.png'
          }
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
          <span className="bg-white text-gray-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            View Product →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-vortexBuy transition-colors duration-200 mb-1">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-bold text-vortexBuy text-sm">
            ₹{hasDiscount ? product.price.discountedPrice : product.price.price}
          </span>
          {hasDiscount && (
            <span className="text-gray-400 text-xs line-through">₹{product.price.price}</span>
          )}
        </div>
        {product.additionalInfoSections && (
          <p
            className="text-xs text-gray-400 mt-1 line-clamp-1"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                product.additionalInfoSections.find((s) => s.title === 'shortDesc')?.description || ''
              ),
            }}
          />
        )}
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────
   Sort options
───────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'oldest',     label: 'Oldest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const STAGGER = ['0s','0.06s','0.12s','0.18s','0.24s','0.30s','0.36s','0.42s','0.48s','0.54s','0.60s','0.66s'];

/* ─────────────────────────────────────────────
   Main Shop Page
───────────────────────────────────────────── */
const ListPage = () => {
  const [searchParamsHook, setSearchParamsHook] = useSearchParams();

  const getParam = (key: string, fallback = '') =>
    searchParamsHook.get(key) || fallback;

  // ── Local state (UI-only, debounced into URL) ──
  const [search,   setSearch]   = useState(getParam('search'));
  const [sort,     setSort]     = useState(getParam('sort', 'newest'));
  const [minPrice, setMinPrice] = useState(getParam('min'));
  const [maxPrice, setMaxPrice] = useState(getParam('max'));
  const [cat,      setCat]      = useState(getParam('cat'));
  const [page,     setPage]     = useState(parseInt(getParam('page', '1')));

  // ── Data ──
  const [products,   setProducts]   = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* fetch categories once */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(r => setCategories(r.data?.items || []))
      .catch(() => {});
  }, []);

  /* sync URL → state */
  useEffect(() => {
    setSearch(getParam('search'));
    setSort(getParam('sort', 'newest'));
    setMinPrice(getParam('min'));
    setMaxPrice(getParam('max'));
    setCat(getParam('cat'));
    setPage(parseInt(getParam('page', '1')));
  }, [searchParamsHook]);

  /* fetch products */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, sort, limit: 12 };
      if (search)   params.search = search;
      if (minPrice) params.min    = minPrice;
      if (maxPrice) params.max    = maxPrice;
      if (cat)      params.cat    = cat;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { params });
      setProducts(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, sort, minPrice, maxPrice, cat, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── URL helper ── */
  const pushParams = (patches: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsHook);
    Object.entries(patches).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    if (!('page' in patches)) params.set('page', '1');
    setSearchParamsHook(params, { replace: true });
  };

  /* ── Handlers ── */
  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams({ search: val, page: '1' }), 400);
  };

  const handleSort = (val: string) => { setSort(val); pushParams({ sort: val }); };
  const handleCat  = (val: string) => { setCat(val);  pushParams({ cat: val }); };

  const applyPrice = () => pushParams({ min: minPrice, max: maxPrice });
  const clearPrice = () => { setMinPrice(''); setMaxPrice(''); pushParams({ min: '', max: '' }); };

  const clearAll = () => {
    setSearch(''); setMinPrice(''); setMaxPrice(''); setCat(''); setSort('newest');
    setSearchParamsHook({}, { replace: true });
  };

  const goPage = (p: number) => pushParams({ page: String(p) });

  const activeFilters = [
    cat      && { key: 'cat',   label: `Category: ${categories.find(c => c.slug === cat)?.name || cat}`, clear: () => handleCat('') },
    (minPrice || maxPrice) && { key: 'price', label: `₹${minPrice || '0'} – ₹${maxPrice || '∞'}`,             clear: clearPrice },
    search   && { key: 'search',label: `"${search}"`, clear: () => handleSearch('') },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* ══════════════════════════════════════════
          HEADER — minimal, premium
      ══════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 pt-10 pb-8">
          {/* Breadcrumb */}
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">
            Home &nbsp;/&nbsp; <span className="text-gray-800">Shop</span>
          </p>
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                All Products
              </h1>
              {!loading && (
                <p className="text-gray-400 text-sm mt-1 animate-fade-in opacity-0-init">
                  {totalCount} item{totalCount !== 1 ? 's' : ''}
                  {cat ? ` in ${categories.find(c => c.slug === cat)?.name || cat}` : ''}
                </p>
              )}
            </div>

            {/* Search bar — lives in the header */}
            <div className="relative w-full sm:w-80">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-vortexBuy focus:border-transparent text-sm outline-none transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Filter + Sort bar ── */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-gray-100">

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[{ slug: '', name: 'All' }, ...categories].map(c => (
                <button
                  key={c.slug}
                  onClick={() => handleCat(c.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                    cat === c.slug
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 hidden sm:block mx-1" />

            {/* Price range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyPrice()}
                placeholder="Min ₹"
                className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-vortexBuy outline-none transition-all"
              />
              <span className="text-gray-300 text-xs">—</span>
              <input
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyPrice()}
                placeholder="Max ₹"
                className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-vortexBuy outline-none transition-all"
              />
              <button
                onClick={applyPrice}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-all active:scale-95"
              >
                Apply
              </button>
              {(minPrice || maxPrice) && (
                <button onClick={clearPrice} className="text-xs text-gray-400 hover:text-vortexBuy transition-colors">
                  Clear
                </button>
              )}
            </div>

            {/* Sort — pushed to the right */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">Sort by</span>
              <select
                value={sort}
                onChange={e => handleSort(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-vortexBuy focus:border-transparent outline-none cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Active filter chips ── */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3 animate-fade-in opacity-0-init">
              {activeFilters.map(f => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {f.label}
                  <button
                    onClick={f.clear}
                    className="text-gray-400 hover:text-vortexBuy transition-colors leading-none"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-vortexBuy transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PRODUCT GRID
      ══════════════════════════════════════════ */}
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 py-10">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-up opacity-0-init">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-400 text-sm max-w-xs">Try a different keyword or remove some filters.</p>
            <button
              onClick={clearAll}
              className="mt-6 bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-700 transition-all active:scale-95"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} delay={STAGGER[i % 12]} />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-14 flex-wrap">
                <button
                  disabled={page <= 1}
                  onClick={() => goPage(page - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`e-${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goPage(p as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          p === page
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )
                }

                <button
                  disabled={page >= totalPages}
                  onClick={() => goPage(page + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}

            <p className="text-center text-gray-400 text-xs mt-4">
              Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, totalCount)} of {totalCount} products
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ListPage;
