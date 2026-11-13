
import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiClock, FiCalendar, FiEye, FiArrowLeft, FiTag } from 'react-icons/fi';

import SEOHead from '../../components/ui/SEOHead';
import Spinner from '../../components/ui/Spinner';
import SocialShare from '../../components/ui/SocialShare';
import TableOfContents from '../../components/ui/TableOfContents';
import AuthorBio from '../../components/blog/AuthorBio';
import PostNavigation from '../../components/blog/PostNavigation';
import RelatedPosts from '../../components/blog/RelatedPosts';

import { usePost } from '../../hooks/usePosts';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const contentRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { data, isLoading, isError, error } = usePost(slug);

  const post = data?.post;
  const relatedPosts = data?.relatedPosts || [];
  const navigation = data?.navigation || { previous: null, next: null };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-content mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mb-4">
          ⚠️
        </div>
        <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">
          Unable to Load Article
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
          {error?.message || 'This article could not be found or has not yet been published.'}
        </p>
        <Link to="/blog" className="btn-primary">
          ← Return to All Articles
        </Link>
      </div>
    );
  }

  const publishedDate = post.publishedAt
    ? format(parseISO(post.publishedAt), 'MMMM dd, yyyy')
    : 'Recently';

  return (
    <>
      <SEOHead
        title={post.seo?.metaTitle || post.title}
        description={post.seo?.metaDescription || post.excerpt}
        image={post.seo?.ogImage || post.featuredImage?.url}
        url={`/blog/${post.slug}`}
        article={post}
      />

      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-[#2563eb] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="py-8 sm:py-12">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#2563eb] transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>
          </div>

          <header className="max-w-4xl mb-8 sm:mb-12">

            {post.category && (
              <div className="mb-4">
                <Link
                  to={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f4f4f4] text-[#222222] border border-[#dddddd] hover:bg-[#e5e5e5] transition-colors"
                >
                  <span>{post.category.icon || '📁'}</span>
                  <span>{post.category.name}</span>
                </Link>
              </div>
            )}

            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-sans mb-8">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100 text-xs sm:text-sm text-gray-500">

              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-sm border border-neutral-200">
                      {post.author.initials || 'AU'}
                    </div>
                  )}
                  <div>
                    <span className="font-heading font-semibold text-gray-900 block">
                      {post.author.name}
                    </span>
                    <span className="text-gray-400 text-xs">Author & Contributor</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <span>{publishedDate}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="inline-flex items-center gap-1">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <span>{post.readingTime || 1} min read</span>
                </span>
                {post.views > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="inline-flex items-center gap-1">
                      <FiEye className="w-4 h-4 text-gray-400" />
                      <span>{post.views.toLocaleString()} views</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </header>

          {post.featuredImage?.url && (
            <div className="mb-12 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 shadow-sm max-w-5xl">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.altText || post.title}
                className="w-full h-auto max-h-[540px] object-cover object-center"
              />
              {post.featuredImage.caption && (
                <p className="p-3 text-center text-xs text-gray-500 italic bg-slate-50/60 border-t border-gray-100">
                  {post.featuredImage.caption}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 order-2 lg:order-1">

              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-gray-500 block mb-3">
                  Share this story
                </span>
                <SocialShare title={post.title} url={window.location.href} />
              </div>

              <TableOfContents contentRef={contentRef} />
            </aside>

            <div className="lg:col-span-8 order-1 lg:order-2">

              <div
                ref={contentRef}
                className="prose-custom max-w-none text-base sm:text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 inline-flex items-center gap-1 mr-1">
                      <FiTag className="w-3.5 h-3.5" />
                      <span>Tags:</span>
                    </span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id || tag.slug}
                        to={`/blog?tag=${tag.slug}`}
                        className="text-xs font-medium px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <AuthorBio author={post.author} />

              <PostNavigation previous={navigation.previous} next={navigation.next} />
            </div>
          </div>

          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
