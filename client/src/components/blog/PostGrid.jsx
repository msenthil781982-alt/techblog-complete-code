
import React from 'react';
import PostCard from './PostCard';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
    <div className="aspect-[16/9] bg-gray-200" />
    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-full h-6 bg-gray-200 rounded" />
        <div className="w-3/4 h-6 bg-gray-200 rounded" />
        <div className="w-full h-4 bg-gray-100 rounded" />
        <div className="w-5/6 h-4 bg-gray-100 rounded" />
      </div>
      <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gray-200" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const PostGrid = ({ posts = [], isLoading = false, emptyMessage = 'No articles found matching your criteria.' }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-6 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mb-4">
          🔍
        </div>
        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1">
          No articles discovered
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {posts.map((post) => (
        <PostCard key={post._id || post.id} post={post} />
      ))}
    </div>
  );
};

export default PostGrid;
