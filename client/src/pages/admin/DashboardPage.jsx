
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiTrash2,
  FiExternalLink,
  FiPlus,
  FiSearch,
  FiCheck,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';
import postService from '../../services/postService';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
    scheduled: 0,
    totalViews: 0,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const fetchPendingRequests = async () => {
    setIsPendingLoading(true);
    try {
      const data = await postService.getAdminPosts({ status: 'pending', limit: 50 });
      setPendingPosts(data?.posts || []);
    } catch (err) {
      console.error('Failed to load pending blogs', err);
    } finally {
      setIsPendingLoading(false);
    }
  };

  const fetchAdminPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postService.getAdminPosts({
        page,
        limit: 10,
        status: statusFilter,
        search: searchTerm,
      });

      if (data) {
        setPosts(data.posts || []);
        if (data.stats) setStats(data.stats);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch dashboard posts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadPending = async () => {
      setIsPendingLoading(true);
      try {
        const data = await postService.getAdminPosts({ status: 'pending', limit: 50 });
        if (!ignore) {
          setPendingPosts(data?.posts || []);
        }
      } catch (err) {
        if (!ignore) console.error('Failed to load pending blogs', err);
      } finally {
        if (!ignore) setIsPendingLoading(false);
      }
    };
    loadPending();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadCatalog = async () => {
      setIsLoading(true);
      try {
        const data = await postService.getAdminPosts({
          page,
          limit: 10,
          status: statusFilter,
          search: searchTerm,
        });

        if (!ignore && data) {
          setPosts(data.posts || []);
          if (data.stats) setStats(data.stats);
          if (data.pagination) setPagination(data.pagination);
        }
      } catch (err) {
        if (!ignore) toast.error(err.message || 'Failed to fetch dashboard posts.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    loadCatalog();
    return () => {
      ignore = true;
    };
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAdminPosts();
  };

  const handleAccept = async (id, title) => {
    setActionInProgress(id);
    try {
      await postService.updatePostStatus(id, 'approved');
      toast.success(`"${title}" has been accepted and published!`);
      await Promise.all([fetchPendingRequests(), fetchAdminPosts()]);
    } catch (err) {
      toast.error(err.message || 'Failed to approve blog.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id, title) => {
    setActionInProgress(id);
    try {
      await postService.updatePostStatus(id, 'rejected');
      toast.success(`"${title}" has been rejected.`);
      await Promise.all([fetchPendingRequests(), fetchAdminPosts()]);
    } catch (err) {
      toast.error(err.message || 'Failed to reject blog.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await postService.deletePost(id);
      toast.success('Post deleted successfully.');
      fetchAdminPosts();
      fetchPendingRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to delete post.');
    }
  };

  const statusBadges = {
    approved:  'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
    published: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
    pending:   'bg-[#f4f4f4] text-[#666666] border-[#dddddd]',
    rejected:  'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
    draft:     'bg-[#f4f4f4] text-[#666666] border-[#dddddd]',
    scheduled: 'bg-[#f4f4f4] text-[#666666] border-[#dddddd]',
  };

  return (
    <div className="space-y-8 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dddddd]">
        <div>
          <h1 className="font-heading font-bold text-2xl text-[#222222] tracking-tight">
            Admin Content Dashboard
          </h1>
          <p className="text-sm text-[#666666] mt-0.5">
            Review user submissions, manage articles, and monitor publication metrics
          </p>
        </div>

        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      <div className="bg-white border border-[#dddddd] rounded p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#dddddd]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <h2 className="font-heading font-bold text-lg text-[#222222]">
              Pending Requests ({pendingPosts.length})
            </h2>
          </div>
          <span className="text-xs text-[#666666]">
            User submissions waiting for your review
          </span>
        </div>

        {isPendingLoading ? (
          <div className="py-8 text-center">
            <Spinner size="md" />
            <p className="text-xs text-[#666666] mt-2">Checking pending submissions...</p>
          </div>
        ) : pendingPosts.length === 0 ? (
          <div className="py-8 text-center bg-[#f4f4f4] rounded border border-[#dddddd]">
            <p className="text-sm font-medium text-[#222222]">
              No pending blog requests to review.
            </p>
            <p className="text-xs text-[#666666] mt-1">
              New submissions from registered users will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPosts.map((blog) => {
              const dateStr = blog.createdAt
                ? format(parseISO(blog.createdAt), 'MMM dd, yyyy')
                : 'Recently';

              const contentPreview = blog.excerpt || blog.content?.replace(/<[^>]+>/g, ' ').slice(0, 180) || '';

              const isBusy = actionInProgress === (blog.id || blog._id);

              return (
                <div
                  key={blog._id || blog.id}
                  className="p-4 rounded border border-[#dddddd] bg-[#f4f4f4] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#222222] border border-[#dddddd]">
                        {blog.category?.name || 'General'}
                      </span>
                      <span className="text-xs font-medium text-[#222222]">
                        Author: <strong>{blog.author?.name || 'User'}</strong>
                      </span>
                      <span className="text-xs text-[#666666]">
                        • Submitted {dateStr}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-[#222222] mb-1">
                      {blog.title}
                    </h3>

                    {contentPreview && (
                      <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                        {contentPreview}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleAccept(blog.id || blog._id, blog.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors disabled:opacity-50"
                      title="Accept blog and publish to live website"
                    >
                      <FiCheck className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleReject(blog.id || blog._id, blog.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold border border-[#dddddd] bg-white hover:bg-[#e5e5e5] text-[#222222] transition-colors disabled:opacity-50"
                      title="Reject blog post"
                    >
                      <FiX className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded border border-[#dddddd] shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Total Stories
            </span>
            <FiFileText className="w-4 h-4 text-[#222222]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#222222]">
            {stats.total}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-[#dddddd] shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Approved / Live
            </span>
            <FiCheckCircle className="w-4 h-4 text-[#2563eb]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#2563eb]">
            {(stats.approved || 0) + (stats.published || 0)}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-[#dddddd] shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Pending Approval
            </span>
            <FiClock className="w-4 h-4 text-[#666666]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#222222]">
            {pendingPosts.length || stats.pending || 0}
          </span>
        </div>

        <div className="bg-white p-4 rounded border border-[#dddddd] shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
              Total Views
            </span>
            <FiEye className="w-4 h-4 text-[#666666]" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#222222]">
            {stats.totalViews.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">

        <div className="p-4 border-b border-[#dddddd] flex flex-col md:flex-row md:items-center justify-between gap-3">

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Articles' },
              { id: 'approved', label: 'Approved' },
              { id: 'pending', label: 'Pending' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'draft', label: 'Drafts' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-[#222222] text-white'
                    : 'text-[#666666] hover:bg-[#f4f4f4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] w-3.5 h-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f4f4f4] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
            />
          </form>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <Spinner size="md" />
            <p className="text-xs text-[#666666] mt-2">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-[#222222]">No articles found.</p>
            <p className="text-xs text-[#666666] mt-1">Try selecting a different status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f4f4f4] border-b border-[#dddddd] text-[#666666] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dddddd] text-[#222222]">
                {posts.map((post) => {
                  const dateStr = post.publishedAt
                    ? format(parseISO(post.publishedAt), 'MMM dd, yyyy')
                    : (post.createdAt ? format(parseISO(post.createdAt), 'MMM dd, yyyy') : 'Recently');

                  const isLive = post.status === 'approved' || post.status === 'published';

                  return (
                    <tr key={post._id || post.id} className="hover:bg-[#f9f9f9] transition-colors">

                      <td className="py-3 px-4 max-w-sm">
                        <Link
                          to={`/admin/posts/edit/${post.id || post._id}`}
                          className="font-semibold text-[#222222] hover:text-[#2563eb] block line-clamp-1 text-sm"
                        >
                          {post.title}
                        </Link>
                        {post.category && (
                          <span className="text-[11px] text-[#666666] font-medium">
                            {post.category.name}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border capitalize ${
                            statusBadges[post.status] || 'bg-[#f4f4f4] text-[#666666] border-[#dddddd]'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#666666] font-medium">
                        {post.author?.name || 'Unknown'}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#666666] font-medium">
                        {post.views?.toLocaleString() || 0}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#666666]">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">

                          {post.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAccept(post.id || post._id, post.title)}
                                className="px-2 py-1 rounded bg-[#2563eb] text-white text-[11px] font-semibold hover:bg-[#1d4ed8]"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(post.id || post._id, post.title)}
                                className="px-2 py-1 rounded border border-[#dddddd] bg-white text-[#222222] text-[11px] font-semibold hover:bg-[#f4f4f4]"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isLive && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-[#666666] hover:text-[#2563eb]"
                              title="View Live Article"
                            >
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(post.id || post._id, post.title)}
                            className="p-1 rounded text-[#666666] hover:text-red-600"
                            title="Delete Article"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 border-t border-[#dddddd] flex items-center justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
