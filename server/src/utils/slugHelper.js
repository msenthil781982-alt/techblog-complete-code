import slugifyLib from 'slugify';

export const generateSlug = (text = '') => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const ensureUniqueSlug = async (title, Model, excludeId = null) => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
