
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiTrendingUp, FiFolder } from 'react-icons/fi';
import SearchBar from '../ui/SearchBar';

const Sidebar = ({ categories = [], trendingPosts = [] }) => {
  const navigate = useNavigate();

  const handleSearch = (term) => {
    if (term?.trim()) {
      navigate(`/blog?search=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <aside className="space-y-6">

      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
        <h3 className="font-heading font-semibold text-xs text-slate-900 uppercase tracking-wider mb-3">
          Search Articles
        </h3>
        <SearchBar onSearch={handleSearch} />
      </div>

      {trendingPosts.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FiTrendingUp className="w-4 h-4 text-slate-700" />
            <h3 className="font-heading font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Trending Articles
            </h3>
          </div>

          <div className="space-y-4">
            {trendingPosts.map((post, idx) => {
              const formattedDate = post.publishedAt
                ? format(parseISO(post.publishedAt), 'MMM dd')
                : '';

              return (
                <div key={post._id || post.id || post.slug} className="flex items-start gap-3 group">
                  <span className="font-heading font-bold text-base text-slate-300 group-hover:text-slate-700 transition-colors w-5 shrink-0 pt-0.5">
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-heading font-medium text-xs sm:text-sm text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      {formattedDate && <span>{formattedDate}</span>}
                      <span>•</span>
                      <span>{post.readingTime || 1} min read</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FiFolder className="w-4 h-4 text-slate-700" />
            <h3 className="font-heading font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Categories
            </h3>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/blog?category=${cat.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span>{cat.icon || '📁'}</span>
                  <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                    {cat.name}
                  </span>
                </div>
                {cat.postCount > 0 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900 transition-colors">
                    {cat.postCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
