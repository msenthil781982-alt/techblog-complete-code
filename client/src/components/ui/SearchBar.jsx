
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({
  defaultValue = '',
  onSearch,
  placeholder = 'Search articles, topics, keywords...',
  debounceMs = 400,
  className = '',
}) => {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch && query !== defaultValue) {
        onSearch(query);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onSearch, defaultValue]);

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) onSearch(query);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <FiSearch className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="block w-full pl-10 pr-9 py-2 text-sm bg-white text-[#222222] placeholder-[#666666] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb] transition duration-150"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear search query"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
