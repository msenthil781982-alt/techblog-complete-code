
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { generateSlug } from '../utils/slugHelper.js';

export const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;

    const filter = {};
    if (!includeInactive || req.user?.role !== 'admin') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .sort({ name: 1 })
      .lean();

    return sendSuccess(res, { categories }, 'Categories fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    return sendSuccess(res, { category }, 'Category fetched successfully');
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;

    const slug = generateSlug(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      throw new ApiError(`Category with slug "${slug}" already exists`, 409);
    }

    const category = new Category({
      name,
      slug,
      description,
      color,
      icon,
    });

    await category.save();

    return sendSuccess(res, { category: category.toJSON() }, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    if (name && name !== category.name) {
      category.name = name;
      category.slug = generateSlug(name);

      const collision = await Category.findOne({ slug: category.slug, _id: { $ne: id } });
      if (collision) {
        throw new ApiError(`Category with name "${name}" already exists`, 409);
      }
    }

    if (description !== undefined) category.description = description;
    if (color !== undefined) category.color = color;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return sendSuccess(res, { category: category.toJSON() }, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    const postsCount = await Post.countDocuments({ category: id });
    if (postsCount > 0) {
      throw new ApiError(
        `Cannot delete category "${category.name}" because ${postsCount} post(s) are assigned to it. Reassign or delete them first.`,
        400
      );
    }

    await Category.findByIdAndDelete(id);

    return sendSuccess(res, null, `Category "${category.name}" deleted successfully`);
  } catch (err) {
    next(err);
  }
};

export const resyncCategoryCounts = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const updates = categories.map(async (cat) => {
      const count = await Post.countDocuments({
        category: cat._id,
        status: { $in: ['approved', 'published'] },
      });
      return Category.findByIdAndUpdate(cat._id, { postCount: count });
    });

    await Promise.all(updates);

    return sendSuccess(res, null, 'Category post counts synchronized successfully');
  } catch (err) {
    next(err);
  }
};
