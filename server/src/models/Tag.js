import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugHelper.js';

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      unique: true,
      maxlength: [50, 'Tag name must be 50 characters or less'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    postCount: {
      type: Number,
      default: 0,
      min: 0,
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

tagSchema.virtual('url').get(function () {
  return `/blog?tag=${this.slug}`;
});

tagSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.slug ? generateSlug(this.slug) : generateSlug(this.name);
  }
  next();
});

tagSchema.index({ name: 'text' });
tagSchema.index({ postCount: -1 });

tagSchema.statics.findOrCreate = async function (name) {
  const trimmed = name.trim();
  const slug = generateSlug(trimmed);

  let tag = await this.findOne({ slug });
  if (!tag) {
    tag = await this.create({ name: trimmed, slug });
  }
  return tag;
};

tagSchema.statics.incrementPostCount = function (tagIds) {
  const ids = Array.isArray(tagIds) ? tagIds : [tagIds];
  return this.updateMany({ _id: { $in: ids } }, { $inc: { postCount: 1 } });
};

tagSchema.statics.decrementPostCount = function (tagIds) {
  const ids = Array.isArray(tagIds) ? tagIds : [tagIds];
  return this.updateMany({ _id: { $in: ids } }, { $inc: { postCount: -1 } });
};

const Tag = model('Tag', tagSchema);

export default Tag;
