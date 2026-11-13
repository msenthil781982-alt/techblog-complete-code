
import React from 'react';
import { Link } from 'react-router-dom';

const CategoryFilter = ({ categories = [], activeSlug = '', onSelect = null }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-8">
      <div className="flex items-center gap-2 min-w-max">

        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !activeSlug
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#f4f4f4] text-[#222222] hover:bg-[#e5e5e5] border border-[#dddddd]'
            }`}
          >
            All Topics
          </button>
        ) : (
          <Link
            to="/blog"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !activeSlug
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#f4f4f4] text-[#222222] hover:bg-[#e5e5e5] border border-[#dddddd]'
            }`}
          >
            All Topics
          </Link>
        )}

        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;

          if (onSelect) {
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => onSelect(cat.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-[#f4f4f4] text-[#222222] hover:bg-[#e5e5e5] border border-[#dddddd]'
                }`}
              >
                <span>{cat.icon || '📁'}</span>
                <span>{cat.name}</span>
                {cat.postCount > 0 && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#222222] border border-[#dddddd]'
                    }`}
                  >
                    {cat.postCount}
                  </span>
                )}
              </button>
            );
          }

          return (
            <Link
              key={cat.id || cat.slug}
              to={`/blog?category=${cat.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#f4f4f4] text-[#222222] hover:bg-[#e5e5e5] border border-[#dddddd]'
              }`}
            >
              <span>{cat.icon || '📁'}</span>
              <span>{cat.name}</span>
              {cat.postCount > 0 && (
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#222222] border border-[#dddddd]'
                  }`}
                >
                  {cat.postCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
