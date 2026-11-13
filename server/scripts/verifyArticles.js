import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Post from '../src/models/Post.js';
import Category from '../src/models/Category.js';
import User from '../src/models/User.js';

const verify = async () => {
  await connectDB();

  console.log('\n--- VERIFICATION OF DATABASE ARTICLES ---');
  const total = await Post.countDocuments();
  console.log(`Total posts in MongoDB: ${total}`);

  const slugs = [
    'how-ai-is-transforming-software-development-from-code-generation-to-autonomous-engineering',
    'modern-web-development-trends-next-gen-frameworks-edge-computing-and-micro-frontends',
    'essential-cybersecurity-practices-in-2026-proactive-defense-in-an-ai-driven-threat-landscape',
    'the-future-of-cloud-technology-serverless-evolution-multi-cloud-orchestration-and-green-computing',
    'top-programming-skills-every-developer-should-learn-building-resilient-systems-in-modern-tech',
  ];

  console.log('\nChecking the 5 new articles:');
  for (const s of slugs) {
    const post = await Post.findOne({ slug: s }).populate('category', 'name slug').populate('author', 'name');
    if (post) {
      console.log(`  [FOUND] "${post.title}"`);
      console.log(`          Category: ${post.category?.name} | Author: ${post.author?.name} | Views: ${post.views}`);
    } else {
      console.log(`  [MISSING] slug: ${s}`);
    }
  }

  // Check duplicate titles
  const allPosts = await Post.find({}, 'title').lean();
  const counts = {};
  allPosts.forEach(p => {
    const t = p.title.toLowerCase().trim();
    counts[t] = (counts[t] || 0) + 1;
  });
  const duplicates = Object.entries(counts).filter(([, c]) => c > 1);
  console.log(`\nDuplicate titles count: ${duplicates.length}`);

  // Check category counts
  const categories = await Category.find({}, 'name postCount').lean();
  console.log('\nCategory breakdown:');
  categories.forEach(c => console.log(`  - ${c.name}: ${c.postCount} posts`));

  // Check pagination calculation
  const totalLive = await Post.countDocuments({ status: { $in: ['approved', 'published'] } });
  const limit = 9;
  const pages = Math.ceil(totalLive / limit);
  console.log(`\nPagination Verification:`);
  console.log(`  Total live articles: ${totalLive}`);
  console.log(`  Items per page: ${limit}`);
  console.log(`  Total pages: ${pages}`);

  // Test Category Filter
  const aiCat = await Category.findOne({ slug: 'artificial-intelligence-machine-learning' });
  const aiPosts = await Post.countDocuments({ category: aiCat._id, status: { $in: ['approved', 'published'] } });
  console.log(`\nCategory filter test (AI): ${aiPosts} articles found`);

  // Test Search Filter
  const searchResults = await Post.countDocuments({
    status: { $in: ['approved', 'published'] },
    $or: [
      { title: { $regex: 'Cybersecurity', $options: 'i' } },
      { excerpt: { $regex: 'Cybersecurity', $options: 'i' } },
    ],
  });
  console.log(`Search filter test ("Cybersecurity"): ${searchResults} articles found`);

  await mongoose.connection.close();
  console.log('\n--- VERIFICATION FINISHED ---');
  process.exit(0);
};

verify();
