import mongoose from 'mongoose';
import { generateSlug } from '../utils/slugHelper.js';

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Category name must be 100 characters or less'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be 500 characters or less'],
      default: '',
    },

    icon: {
      type: String,
      trim: true,
      default: '📁',
    },

    color: {
      type: String,
      trim: true,
      default: 'blue',
      enum: {
        values: [
          'blue', 'purple', 'cyan', 'orange', 'red', 'indigo', 'green', 'yellow', 'pink', 'gray',
        ],
        message: '{VALUE} is not a supported category color',
      },
    },

    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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

categorySchema.virtual('url').get(function () {
  return `/blog?category=${this.slug}`;
});

categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.slug ? generateSlug(this.slug) : generateSlug(this.name);
  }
  next();
});

categorySchema.index({ name: 'text' });

categorySchema.statics.incrementPostCount = function (categoryId) {
  return this.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } });
};

categorySchema.statics.decrementPostCount = function (categoryId) {
  return this.findByIdAndUpdate(categoryId, { $inc: { postCount: -1 } });
};

const Category = model('Category', categorySchema);

export default Category;
