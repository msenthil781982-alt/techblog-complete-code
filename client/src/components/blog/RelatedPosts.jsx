
import React from 'react';
import PostCard from './PostCard';

const RelatedPosts = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="my-14 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight">
            Related Articles
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Continue exploring more perspectives in this topic
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <PostCard key={post._id || post.id || post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
