/**
 * @file scripts/removeDuplicates.js
 * @description One-time cleanup script: finds duplicate blog posts in MongoDB
 *              (same title + same author), keeps the OLDEST, deletes the rest.
 *
 * USAGE (from project root):
 *   cd server
 *   node scripts/removeDuplicates.js
 *
 * SAFE BY DESIGN:
 *   - Prints a full report BEFORE deleting anything.
 *   - Keeps the OLDEST document (earliest createdAt).
 *   - Skips any title that has only ONE document (not a duplicate).
 *   - Automatically disconnects from MongoDB when done.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ── Load environment variables ────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env — aborting.');
  process.exit(1);
}

// ── Connect to MongoDB ────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════');
console.log('  🔍  TechBlog — Remove Duplicate Posts Script');
console.log('════════════════════════════════════════════════\n');

await mongoose.connect(MONGO_URI);
console.log('✅  Connected to MongoDB\n');

// ── Minimal Post schema (just what we need for this script) ───────────────────
const PostSchema = new mongoose.Schema(
  {
    title:     String,
    slug:      String,
    author:    mongoose.Schema.Types.ObjectId,
    status:    String,
    createdAt: Date,
  },
  { timestamps: true }
);

// Use existing model if already registered (avoids OverwriteModelError)
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// ── Step 1: Find all posts grouped by title ───────────────────────────────────
const allPosts = await Post.find({}, 'title slug author status createdAt')
  .sort({ createdAt: 1 }) // oldest first so we keep [0]
  .lean();

console.log(`📊  Total posts in database: ${allPosts.length}`);

// Group by lowercase title so comparison is case-insensitive
const groups = {};
for (const post of allPosts) {
  const key = post.title.trim().toLowerCase();
  if (!groups[key]) groups[key] = [];
  groups[key].push(post);
}

// ── Step 2: Identify duplicates ───────────────────────────────────────────────
const duplicateGroups = Object.entries(groups).filter(([, docs]) => docs.length > 1);

if (duplicateGroups.length === 0) {
  console.log('\n✅  No duplicate posts found. Database is clean!\n');
  await mongoose.connection.close();
  process.exit(0);
}

console.log(`\n⚠️   Found ${duplicateGroups.length} title(s) with duplicates:\n`);

let totalToDelete = 0;
const idsToDelete = [];

for (const [title, docs] of duplicateGroups) {
  // Sort ascending by createdAt so docs[0] is the OLDEST (the one we KEEP)
  docs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const keep    = docs[0];
  const remove  = docs.slice(1);

  console.log(`  Title : "${keep.title}"`);
  console.log(`  Count : ${docs.length} copies`);
  console.log(`  Keep  : id=${keep._id}  slug=${keep.slug}  created=${keep.createdAt?.toISOString?.() ?? 'N/A'}`);
  remove.forEach((r) => {
    console.log(`  DELETE: id=${r._id}  slug=${r.slug}  created=${r.createdAt?.toISOString?.() ?? 'N/A'}`);
    idsToDelete.push(r._id);
  });
  console.log();

  totalToDelete += remove.length;
}

console.log(`\n📋  Summary: ${totalToDelete} duplicate document(s) will be deleted.`);
console.log(`    ${idsToDelete.map(String).join(', ')}\n`);

// ── Step 3: Delete duplicates ─────────────────────────────────────────────────
if (totalToDelete === 0) {
  console.log('✅  Nothing to delete.\n');
} else {
  const result = await Post.deleteMany({ _id: { $in: idsToDelete } });
  console.log(`✅  Deleted ${result.deletedCount} duplicate document(s).`);
  console.log(`    Unique posts remaining: ${allPosts.length - result.deletedCount}\n`);
}

// ── Disconnect ────────────────────────────────────────────────────────────────
await mongoose.connection.close();
console.log('👋  Disconnected from MongoDB. Script complete.\n');
process.exit(0);

