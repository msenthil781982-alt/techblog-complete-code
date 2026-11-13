import mongoose from 'mongoose';
import { ensureUniqueSlug } from '../utils/slugHelper.js';
import calculateReadingTime from '../utils/readingTime.js';

const { Schema, model } = mongoose;

const featuredImageSchema = new Schema(
  {
    url: { type: String, default: '' },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'Meta title should be 70 characters or less'],
      default: '',
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description should be 160 characters or less'],
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
    canonicalUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title must be 200 characters or less'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content: {
      type: String,
      required: [true, 'Post content is required'],
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt must be 300 characters or less'],
      default: '',
    },

    featuredImage: {
      type: featuredImageSchema,
      default: () => ({}),
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'scheduled', 'pending', 'approved', 'rejected'],
        message: 'Status must be draft, published, scheduled, pending, approved, or rejected',
      },
      default: 'draft',
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    scheduledAt: {
      type: Date,
      default: null,
      validate: {
        validator: function (val) {
          if (this.status !== 'scheduled') return true;
          return val && val > new Date();
        },
        message: 'Scheduled date must be a future date/time',
      },
    },

    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

postSchema.pre('save', async function (next) {
  if (!this.slug || (this.isModified('title') && this.isNew)) {
    this.slug = await ensureUniqueSlug(this.title, this.constructor, this._id);
  } else if (this.isModified('slug')) {
    this.slug = await ensureUniqueSlug(this.slug, this.constructor, this._id);
  }

  if (!this.excerpt && this.content) {
    const plainText = this.content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    this.excerpt = plainText.substring(0, 160).trim();
    if (plainText.length > 160) this.excerpt += '…';
  }

  if (this.isModified('content')) {
    this.readingTime = calculateReadingTime(this.content);
  }

  if (this.isModified('status') && (this.status === 'published' || this.status === 'approved') && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.isModified('status') && this.status !== 'scheduled') {
    this.scheduledAt = null;
  }

  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 70);
  }
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }
  if (!this.seo.ogImage && this.featuredImage?.url) {
    this.seo.ogImage = this.featuredImage.url;
  }

  next();
});

postSchema.virtual('url').get(function () {
  return `/blog/${this.slug}`;
});

postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1, publishedAt: -1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ isFeatured: 1, status: 1 });
postSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
postSchema.index({ status: 1, scheduledAt: 1 });
postSchema.index({ author: 1, title: 1 });

postSchema.statics.incrementViews = function (slug) {
  return this.findOneAndUpdate(
    { slug, status: { $in: ['approved', 'published'] } },
    { $inc: { views: 1 } },
    { new: true }
  );
};

postSchema.statics.getRelated = function (post, limit = 3) {
  return this.find({
    _id: { $ne: post._id },
    status: { $in: ['approved', 'published'] },
    category: post.category,
  })
    .select('title slug excerpt featuredImage readingTime publishedAt category')
    .populate('category', 'name slug color')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

const Post = model('Post', postSchema);

export default Post;
