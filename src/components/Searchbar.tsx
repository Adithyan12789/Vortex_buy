import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  // Sync input with URL search params
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/list?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/list');
    }
  }

  return (
    <form 
      className='relative flex items-center bg-gray-50 border border-gray-100 focus-within:bg-white focus-within:border-vortexBuy/40 focus-within:ring-4 focus-within:ring-vortexBuy/5 transition-all duration-300 rounded-2xl px-4 py-2 w-full max-w-sm shadow-sm' 
      onSubmit={handleSearch}
    >
      <div className='flex items-center justify-center mr-3 text-gray-400 group-focus-within:text-vortexBuy transition-colors'>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>
      
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search for perfection...' 
        className='flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400'
      />

      {query && (
        <button 
          type="button"
          onClick={() => { setQuery(''); navigate('/list'); }}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all opacity-0-init animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}

export default Searchbar;
