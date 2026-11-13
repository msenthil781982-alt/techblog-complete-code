
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const PostNavigation = ({ previous, next }) => {
  if (!previous && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-8 border-t border-gray-100">

      {previous ? (
        <Link
          to={`/blog/${previous.slug}`}
          className="group p-5 rounded-xl border border-gray-200/80 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all text-left flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-neutral-200 group-hover:text-neutral-900 flex items-center justify-center text-gray-500 shrink-0 transition-colors mt-0.5">
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Previous Story
            </span>
            <span className="font-heading font-semibold text-sm text-gray-900 group-hover:text-neutral-900 transition-colors line-clamp-2 leading-snug">
              {previous.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={`/blog/${next.slug}`}
          className="group p-5 rounded-xl border border-gray-200/80 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all text-right flex items-start justify-end gap-3 sm:col-start-2"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Next Story
            </span>
            <span className="font-heading font-semibold text-sm text-gray-900 group-hover:text-neutral-900 transition-colors line-clamp-2 leading-snug">
              {next.title}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-neutral-200 group-hover:text-neutral-900 flex items-center justify-center text-gray-500 shrink-0 transition-colors mt-0.5">
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
};

export default PostNavigation;
