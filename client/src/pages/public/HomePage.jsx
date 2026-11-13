
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

import SEOHead from '../../components/ui/SEOHead';
import FeaturedPost from '../../components/blog/FeaturedPost';
import PostGrid from '../../components/blog/PostGrid';
import CategoryFilter from '../../components/blog/CategoryFilter';
import Sidebar from '../../components/layout/Sidebar';

import { usePosts, useFeaturedPosts, useTrendingPosts } from '../../hooks/usePosts';
import { useCategories } from '../../hooks/useCategories';

const HomePage = () => {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedPosts();
  const { data: postsData, isLoading: postsLoading } = usePosts({ page: 1, limit: 6, sort: 'latest' });
  const { data: trendingPosts = [] } = useTrendingPosts();
  const { data: categories = [] } = useCategories();

  const topFeaturedPost =
    (featuredData && featuredData.length > 0)
      ? featuredData[0]
      : (postsData?.posts && postsData.posts.length > 0 ? postsData.posts[0] : null);

  const featuredId = topFeaturedPost?._id?.toString() || topFeaturedPost?.id?.toString() || null;
  const latestPosts = postsData?.posts?.filter((p) => {
    if (!featuredId) return true;
    const postId = p._id?.toString() || p.id?.toString() || '';
    return postId !== featuredId;
  }) || [];

  return (
    <>
      <SEOHead
        title="Technology Insights & Engineering Architecture"
        description="Explore deep dives into Software Engineering, AI, Cloud Infrastructure, Mobile Development, and Cybersecurity."
      />

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {!featuredLoading && topFeaturedPost && (
          <FeaturedPost post={topFeaturedPost} />
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-500">
              Browse Topics
            </h2>
            <Link
              to="/blog"
              className="text-xs font-semibold text-[#2563eb] hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryFilter categories={categories} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight">
                Latest Insights & Deep Dives
              </h2>
              <span className="text-xs font-medium text-gray-400">
                Updated continuously
              </span>
            </div>

            <PostGrid
              posts={latestPosts}
              isLoading={postsLoading}
              emptyMessage="No articles have been published yet. Seed data or publish in the Admin Console!"
            />

            {latestPosts.length > 0 && (
              <div className="mt-10 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded border border-[#dddddd] bg-[#f4f4f4] hover:bg-[#e5e5e5] text-[#222222] text-sm font-semibold transition-all group"
                >
                  <FiBookOpen className="w-4 h-4 text-[#2563eb]" />
                  <span>Browse All Articles & Categories</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <Sidebar categories={categories} trendingPosts={trendingPosts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
