
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBookOpen } from 'react-icons/fi';
import SEOHead from '../../components/ui/SEOHead';

const NotFoundPage = () => {
  return (
    <>
      <SEOHead title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <span className="font-heading font-black text-7xl sm:text-9xl text-slate-200 tracking-tight select-none">
          404
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 mt-4 mb-2">
          Article or Page Not Found
        </h1>
        <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base mb-8 leading-relaxed">
          The link you followed may be broken or the article may have been moved, renamed, or unpublished.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 shadow-sm transition-colors"
          >
            <FiHome className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiBookOpen className="w-4 h-4" />
            <span>Browse All Articles</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
