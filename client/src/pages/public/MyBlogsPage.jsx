
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiPlus, FiExternalLink, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';
import Spinner from '../../components/ui/Spinner';

const MyBlogsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated) {
      const load = async () => {
        setIsLoading(true);
        try {
          const data = await postService.getMyBlogs();
          if (!ignore) {
            setBlogs(data || []);
          }
        } catch (err) {
          if (!ignore) {
            setError(err.message || 'Failed to fetch your blogs.');
          }
        } finally {
          if (!ignore) {
            setIsLoading(false);
          }
        }
      };
      load();
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading font-bold text-2xl text-[#222222] mb-3">
          Sign In to View Your Blogs
        </h2>
        <p className="text-sm text-[#666666] mb-6">
          Please log in to see the status of your submitted articles.
        </p>
        <Link
          to="/admin/login"
          className="px-5 py-2.5 rounded bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            <FiXCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#f4f4f4] text-[#666666] border border-[#dddddd]">
            <FiClock className="w-3.5 h-3.5" />
            <span>Pending Approval</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#dddddd]">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#222222]">
            My Blogs
          </h1>
          <p className="text-sm text-[#666666] mt-1">
            Track the approval status of your submitted technical articles.
          </p>
        </div>

        <Link
          to="/submit-blog"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors shrink-0 self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Submit New Blog</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-sm">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center">
          <Spinner size="md" />
          <p className="text-xs text-[#666666] mt-2">Loading your blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-[#f4f4f4] border border-[#dddddd] rounded p-8">
          <p className="text-base font-semibold text-[#222222] mb-1">
            You haven't submitted any blogs yet.
          </p>
          <p className="text-sm text-[#666666] mb-6">
            Share your knowledge with the developer community today!
          </p>
          <Link
            to="/submit-blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Write Your First Blog</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => {
            const dateStr = blog.createdAt
              ? format(parseISO(blog.createdAt), 'MMM dd, yyyy')
              : 'Recently';

            const isApproved = blog.status === 'approved' || blog.status === 'published';

            return (
              <div
                key={blog._id || blog.id}
                className="bg-white border border-[#dddddd] rounded p-5 shadow-sm hover:border-[#cccccc] transition-colors flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    {renderStatusBadge(blog.status)}
                    {blog.category && (
                      <span className="text-xs text-[#666666] font-medium">
                        {blog.category.name}
                      </span>
                    )}
                    <span className="text-xs text-[#888888]">
                      • Submitted on {dateStr}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-lg text-[#222222] line-clamp-1 mb-1.5">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}

                  {blog.status === 'pending' && (
                    <p className="text-xs text-[#888888] mt-2 italic">
                      Waiting for admin review.
                    </p>
                  )}
                  {blog.status === 'rejected' && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      This blog was not approved by the admin.
                    </p>
                  )}
                </div>

                {isApproved && (
                  <div className="self-end sm:self-center shrink-0">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#2563eb] text-[#2563eb] hover:bg-[#eff6ff] transition-colors"
                    >
                      <span>View Live</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;

