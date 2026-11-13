
import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi';

const FeaturedPost = ({ post }) => {
  if (!post) return null;

  const publishedDate = post.publishedAt
    ? format(parseISO(post.publishedAt), 'MMMM dd, yyyy')
    : 'Recently';

  const imageUrl = post.featuredImage?.url;

  return (
    <section className="bg-white rounded-xl border border-slate-200/80 shadow-subtle overflow-hidden mb-12 hover:border-slate-300 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

        <Link
          to={`/blog/${post.slug}`}
          className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-900 group"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.featuredImage?.altText || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full min-h-[320px] bg-slate-900 flex items-center justify-center p-8 text-slate-300">
              <span className="font-heading font-medium text-xl text-center">
                {post.title}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-900/80 backdrop-blur-sm text-slate-200 border border-white/10">
              Featured Story
            </span>
          </div>
        </Link>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>

            <div className="flex items-center gap-2 mb-3">
              {post.category && (
                <Link
                  to={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 transition-colors"
                >
                  <span>{post.category.icon || '📁'}</span>
                  <span>{post.category.name}</span>
                </Link>
              )}
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.readingTime || 1} min read</span>
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 leading-tight hover:text-neutral-600 transition-colors mb-3">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                    {post.author.initials || 'ED'}
                  </div>
                )}
                <div>
                  <div className="font-heading font-medium text-xs text-slate-900">
                    {post.author.name}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <FiCalendar className="w-3 h-3 text-slate-400" />
                    <span>{publishedDate}</span>
                  </div>
                </div>
              </div>
            )}

            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:underline group transition-colors"
            >
              <span>Read article</span>
              <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;
