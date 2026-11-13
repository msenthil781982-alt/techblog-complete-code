import Post from '../models/Post.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';

const resolveTagIds = async (tagsInput) => {
  if (!tagsInput) return [];

  let tagNames = [];
  if (Array.isArray(tagsInput)) {
    tagNames = tagsInput;
  } else if (typeof tagsInput === 'string') {
    tagNames = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
  }

  return Promise.all(
    tagNames.map(async (nameOrId) => {
      if (/^[0-9a-fA-F]{24}$/.test(nameOrId)) {
        return nameOrId;
      }
      const tag = await Tag.findOrCreate(nameOrId);
      return tag._id;
    })
  );
};

export const getPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      tag,
      search,
      featured,
      sort = 'latest',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = { status: { $in: ['approved', 'published'] } };

    if (category) {
      if (/^[0-9a-fA-F]{24}$/.test(category)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          return sendSuccess(res, { posts: [], pagination: { total: 0, page: pageNum, pages: 0, hasMore: false } });
        }
      }
    }

    if (tag) {
      if (/^[0-9a-fA-F]{24}$/.test(tag)) {
        query.tags = tag;
      } else {
        const tagDoc = await Tag.findOne({ slug: tag });
        if (tagDoc) {
          query.tags = tagDoc._id;
        } else {
          return sendSuccess(res, { posts: [], pagination: { total: 0, page: pageNum, pages: 0, hasMore: false } });
        }
      }
    }

    if (featured === 'true' || featured === true) {
      query.isFeatured = true;
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { excerpt: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    let sortObj = { publishedAt: -1 };
    if (sort === 'popular') {
      sortObj = { views: -1, publishedAt: -1 };
    } else if (sort === 'oldest') {
      sortObj = { publishedAt: 1 };
    }

    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .select('title slug excerpt featuredImage readingTime publishedAt views isFeatured category author tags')
        .populate('author', 'name avatar initials')
        .populate('category', 'name slug color icon')
        .populate('tags', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const pages = Math.ceil(total / limitNum);

    return sendSuccess(
      res,
      {
        posts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages,
          hasMore: pageNum < pages,
        },
      },
      'Posts retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};

export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: { $in: ['approved', 'published'] }, isFeatured: true })
      .select('title slug excerpt featuredImage readingTime publishedAt views category author')
      .populate('author', 'name avatar initials')
      .populate('category', 'name slug color icon')
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();

    return sendSuccess(res, { posts }, 'Featured posts retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getTrendingPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: { $in: ['approved', 'published'] } })
      .select('title slug featuredImage readingTime publishedAt views category author')
      .populate('author', 'name avatar initials')
      .populate('category', 'name slug color icon')
      .sort({ views: -1, publishedAt: -1 })
      .limit(5)
      .lean();

    return sendSuccess(res, { posts }, 'Trending posts retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate('author', 'name avatar bio social initials')
      .populate('category', 'name slug color icon description')
      .populate('tags', 'name slug');

    if (!post) {
      throw new ApiError('Article not found', 404);
    }

    const isLive = ['approved', 'published'].includes(post.status);
    if (!isLive) {
      const canView = req.user && (req.user.role === 'admin' || post.author._id.equals(req.user._id));
      if (!canView) {
        throw new ApiError('Article not found or not yet approved', 404);
      }
    } else {
      Post.incrementViews(slug).exec();
    }

    const relatedPosts = await Post.getRelated(post, 3);

    const [prevPost, nextPost] = await Promise.all([
      Post.findOne({
        status: { $in: ['approved', 'published'] },
        publishedAt: { $lt: post.publishedAt || new Date() },
      })
        .select('title slug featuredImage')
        .sort({ publishedAt: -1 })
        .lean(),

      Post.findOne({
        status: { $in: ['approved', 'published'] },
        publishedAt: { $gt: post.publishedAt || new Date(0) },
      })
        .select('title slug featuredImage')
        .sort({ publishedAt: 1 })
        .lean(),
    ]);

    return sendSuccess(
      res,
      {
        post: post.toJSON(),
        relatedPosts,
        navigation: {
          previous: prevPost || null,
          next: nextPost || null,
        },
      },
      'Post retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};

export const getAdminPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status, search, category } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (req.user.role !== 'admin') {
      query.author = req.user._id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const [total, posts, metrics] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .select('title slug status publishedAt scheduledAt views isFeatured category author createdAt updatedAt')
        .populate('author', 'name avatar initials')
        .populate('category', 'name slug color')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Post.aggregate([
        ...(req.user.role !== 'admin' ? [{ $match: { author: req.user._id } }] : []),
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalViews: { $sum: '$views' },
          },
        },
      ]),
    ]);

    const stats = {
      total: 0,
      published: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
      scheduled: 0,
      totalViews: 0,
    };

    metrics.forEach((m) => {
      stats.total += m.count;
      stats.totalViews += m.totalViews || 0;
      if (m._id === 'published') stats.published = m.count;
      if (m._id === 'approved') stats.approved = m.count;
      if (m._id === 'pending') stats.pending = m.count;
      if (m._id === 'rejected') stats.rejected = m.count;
      if (m._id === 'draft') stats.draft = m.count;
      if (m._id === 'scheduled') stats.scheduled = m.count;
    });

    const pages = Math.ceil(total / limitNum);

    return sendSuccess(
      res,
      {
        posts,
        stats,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages,
          hasMore: pageNum < pages,
        },
      },
      'Admin posts retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      scheduledAt,
      isFeatured = false,
      seo,
    } = req.body;

    const existingPost = await Post.findOne({
      title: { $regex: `^${title.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      author: req.user._id,
    });

    if (existingPost) {
      throw new ApiError(
        `You already have a blog post titled "${existingPost.title}". Please edit the existing post instead of creating a duplicate.`,
        409
      );
    }

    let postStatus = 'pending';
    if (req.user.role === 'admin' && status) {
      postStatus = status;
    }

    let categoryId = category;
    if (!categoryId) {
      const defaultCategory = await Category.findOne();
      if (!defaultCategory) {
        throw new ApiError('No category available. Please contact administrator.', 400);
      }
      categoryId = defaultCategory._id;
    } else {
      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        throw new ApiError('Selected category does not exist', 400);
      }
    }

    const tagIds = await resolveTagIds(tags);

    const post = new Post({
      title,
      content,
      excerpt,
      category: categoryId,
      tags: tagIds,
      featuredImage: featuredImage || {},
      status: postStatus,
      scheduledAt: postStatus === 'scheduled' ? new Date(scheduledAt) : null,
      isFeatured: req.user.role === 'admin' ? Boolean(isFeatured) : false,
      seo: seo || {},
      author: req.user._id,
    });

    await post.save();

    if (postStatus === 'published' || postStatus === 'approved') {
      await Promise.all([
        Category.incrementPostCount(categoryId),
        Tag.incrementPostCount(tagIds),
      ]);
    }

    const message = postStatus === 'pending'
      ? 'Your blog has been submitted and is waiting for admin approval.'
      : 'Post created successfully';

    return sendSuccess(res, { post: post.toJSON() }, message, 201);
  } catch (err) {
    next(err);
  }
};

export const getMyBlogs = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .select('title slug excerpt featuredImage status publishedAt createdAt category')
      .populate('category', 'name slug color icon')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, { posts }, 'My blogs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updatePostStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new ApiError('Status must be approved, rejected, or pending', 400);
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError('Post not found', 404);
    }

    const oldStatus = post.status;
    post.status = status;

    if (status === 'approved' && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    if (oldStatus !== 'approved' && oldStatus !== 'published' && status === 'approved') {
      if (post.category) {
        await Category.incrementPostCount(post.category);
      }
    } else if ((oldStatus === 'approved' || oldStatus === 'published') && status === 'rejected') {
      if (post.category) {
        await Category.decrementPostCount(post.category);
      }
    }

    const message = status === 'approved' ? 'Blog accepted and published' : 'Blog rejected';
    return sendSuccess(res, { post: post.toJSON() }, message);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError('Post not found', 404);
    }

    if (req.user.role !== 'admin' && !post.author.equals(req.user._id)) {
      throw new ApiError('You do not have permission to edit this post', 403);
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      scheduledAt,
      isFeatured,
      seo,
    } = req.body;

    const oldStatus = post.status;
    const oldCategory = post.category.toString();
    const oldTags = post.tags.map((t) => t.toString());

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;
    if (seo !== undefined) post.seo = { ...post.seo, ...seo };

    if (category && category !== oldCategory) {
      const newCategoryDoc = await Category.findById(category);
      if (!newCategoryDoc) {
        throw new ApiError('Selected category does not exist', 400);
      }
      post.category = category;
    }

    let newTagIds = oldTags;
    if (tags !== undefined) {
      newTagIds = await resolveTagIds(tags);
      post.tags = newTagIds;
    }

    if (status) {
      post.status = status;
      if (status === 'scheduled') {
        post.scheduledAt = new Date(scheduledAt);
      } else {
        post.scheduledAt = null;
      }
    }

    await post.save();

    if (oldStatus !== 'published' && post.status === 'published') {
      await Promise.all([
        Category.incrementPostCount(post.category),
        Tag.incrementPostCount(post.tags),
      ]);
    } else if (oldStatus === 'published' && post.status !== 'published') {
      await Promise.all([
        Category.decrementPostCount(oldCategory),
        Tag.decrementPostCount(oldTags),
      ]);
    } else if (oldStatus === 'published' && post.status === 'published' && oldCategory !== post.category.toString()) {
      await Promise.all([
        Category.decrementPostCount(oldCategory),
        Category.incrementPostCount(post.category),
      ]);
    }

    return sendSuccess(res, { post: post.toJSON() }, 'Post updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      throw new ApiError('Post not found', 404);
    }

    if (req.user.role !== 'admin' && !post.author.equals(req.user._id)) {
      throw new ApiError('You do not have permission to delete this post', 403);
    }

    await Post.findByIdAndDelete(id);

    if (post.status === 'published') {
      await Promise.all([
        Category.decrementPostCount(post.category),
        Tag.decrementPostCount(post.tags),
      ]);
    }

    return sendSuccess(res, null, 'Post deleted successfully');
  } catch (err) {
    next(err);
  }
};
