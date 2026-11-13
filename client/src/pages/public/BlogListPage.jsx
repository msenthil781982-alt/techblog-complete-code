
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';

import SEOHead from '../../components/ui/SEOHead';
import SearchBar from '../../components/ui/SearchBar';
import CategoryFilter from '../../components/blog/CategoryFilter';
import PostGrid from '../../components/blog/PostGrid';
import Pagination from '../../components/ui/Pagination';

import { usePosts } from '../../hooks/usePosts';
import { useCategories } from '../../hooks/useCategories';

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 9;

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = usePosts({
    page,
    limit,
    category: categorySlug,
    search: searchQuery,
    sort,
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination || { total: 0, pages: 1 };

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, categorySlug, searchQuery, sort]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(categorySlug || searchQuery || (sort && sort !== 'latest'));

  let pageTitle = 'All Articles & Deep Dives';
  let pageDescription = 'Explore in-depth technical analysis, tutorials, and architecture best practices.';

  if (currentCategory) {
    pageTitle = `${currentCategory.icon || '📁'} ${currentCategory.name}`;
    pageDescription = currentCategory.description || `Articles and publications in ${currentCategory.name}.`;
  } else if (searchQuery) {
    pageTitle = `Search Results: "${searchQuery}"`;
    pageDescription = `Showing articles matching keyword "${searchQuery}".`;
  }

  return (
    <>
      <SEOHead
        title={currentCategory ? currentCategory.name : (searchQuery ? `Search: ${searchQuery}` : 'All Articles')}
        description={pageDescription}
        url={`/blog${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
      />

      <section className="bg-white border-b border-gray-100 py-10 sm:py-14">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-3">
              {pageTitle}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {pageDescription}
            </p>
          </div>

          <div className="mt-6 max-w-lg">
            <SearchBar
              defaultValue={searchQuery}
              onSearch={(term) => updateParams({ search: term })}
              placeholder="Search by topic, author, or keyword..."
            />
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <CategoryFilter
          categories={categories}
          activeSlug={categorySlug}
          onSelect={(slug) => updateParams({ category: slug })}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 text-sm">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <span>Showing</span>
            <span className="font-semibold text-gray-900">{pagination.total}</span>
            <span>articles</span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 ml-2 px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label htmlFor="sortSelect" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Sort By:
            </label>
            <select
              id="sortSelect"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              <option value="latest">Latest Published</option>
              <option value="popular">Most Popular (Views)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <PostGrid
          posts={posts}
          isLoading={isLoading}
          emptyMessage="No articles matched your filters. Try adjusting your search or category."
        />

        <Pagination
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={(newPage) => updateParams({ page: newPage })}
        />
      </div>
    </>
  );
};

export default BlogListPage;
