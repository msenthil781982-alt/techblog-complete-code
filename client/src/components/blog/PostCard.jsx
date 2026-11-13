
import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiClock, FiCalendar } from 'react-icons/fi';

const CATEGORY_BADGE_STYLE =
  'bg-white/95 text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 shadow-subtle';

const PostCard = ({ post }) => {
  if (!post) return null;

  const publishedDate = post.publishedAt
    ? format(parseISO(post.publishedAt), 'MMM dd, yyyy')
    : 'Recently';

  const imageUrl = post.featuredImage?.url;

  return (
    <article className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-subtle hover:border-slate-300 transition-all duration-200 flex flex-col h-full">

      <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.featuredImage?.altText || post.title}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center p-6 text-center">
            <span className="font-heading font-medium text-slate-400 text-xs line-clamp-2">
              {post.title}
            </span>
          </div>
        )}

        {post.category && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${CATEGORY_BADGE_STYLE}`}
            >
              <span>{post.category.icon || '📁'}</span>
              <span>{post.category.name}</span>
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>

          <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-2 font-medium">
            <span className="inline-flex items-center gap-1">
              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{publishedDate}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readingTime || 1} min read</span>
            </span>
          </div>

          <h3 className="font-heading font-semibold text-base sm:text-lg text-[#222222] group-hover:text-[#2563eb] transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        </div>

        {post.author && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                {post.author.initials || post.author.name?.slice(0, 2).toUpperCase() || 'AU'}
              </div>
            )}
            <span className="text-xs font-medium text-slate-700">
              {post.author.name}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
