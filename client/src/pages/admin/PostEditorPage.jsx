
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiCheck, FiArrowLeft, FiClock, FiStar, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

import postService from '../../services/postService';
import { useCategories } from '../../hooks/useCategories';
import ImageUpload from '../../components/admin/ImageUpload';
import RichTextEditor from '../../components/admin/RichTextEditor';
import Spinner from '../../components/ui/Spinner';

const PostEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { data: categories = [] } = useCategories();

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInProgress = useRef(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft',
    scheduledAt: '',
    isFeatured: false,
    featuredImage: {
      url: '',
      altText: '',
      caption: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (!isEditMode) return;

    const loadPost = async () => {
      try {
        const res = await postService.getAdminPosts({ limit: 100 });
        const existing = res?.posts?.find((p) => p.id === id || p._id === id);

        if (existing) {
          const detail = await postService.getPostBySlug(existing.slug);
          const p = detail.post;

          setFormData({
            title: p.title || '',
            slug: p.slug || '',
            content: p.content || '',
            excerpt: p.excerpt || '',
            category: p.category?.id || p.category?._id || '',
            tags: p.tags?.map((t) => t.name).join(', ') || '',
            status: p.status || 'draft',
            scheduledAt: p.scheduledAt ? new Date(p.scheduledAt).toISOString().slice(0, 16) : '',
            isFeatured: Boolean(p.isFeatured),
            featuredImage: {
              url: p.featuredImage?.url || '',
              altText: p.featuredImage?.altText || '',
              caption: p.featuredImage?.caption || '',
            },
            seo: {
              metaTitle: p.seo?.metaTitle || '',
              metaDescription: p.seo?.metaDescription || '',
            },
          });
        }
      } catch (err) {
        toast.error('Failed to load post for editing.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, isEditMode]);

  useEffect(() => {
    if (!isEditMode && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0].id || categories[0]._id }));
    }
  }, [categories, isEditMode, formData.category]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (targetStatus = null) => {
    if (submitInProgress.current || isSubmitting) return;

    if (!formData.title.trim()) {
      toast.error('Article title is required.');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Article content cannot be empty.');
      return;
    }

    if (!formData.category) {
      toast.error('Please assign a category.');
      return;
    }

    const finalStatus = targetStatus || formData.status;

    if (finalStatus === 'scheduled') {
      if (!formData.scheduledAt) {
        toast.error('Please specify a scheduled publication date.');
        return;
      }
      if (new Date(formData.scheduledAt) <= new Date()) {
        toast.error('Scheduled publication date must be in the future.');
        return;
      }
    }

    setIsSubmitting(true);
    submitInProgress.current = true;

    const payload = {
      ...formData,
      status: finalStatus,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEditMode) {
        await postService.updatePost(id, payload);
        toast.success('Article updated successfully!');
      } else {
        await postService.createPost(payload);
        toast.success(
          finalStatus === 'published'
            ? 'Article published to live blog!'
            : (finalStatus === 'scheduled' ? 'Article scheduled!' : 'Draft saved.')
        );
      }
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
      submitInProgress.current = false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 mt-2">Loading post editor...</p>
      </div>
    );
  }

  const previewTitle = formData.seo.metaTitle || formData.title || 'Untitled Article';
  const previewDesc = formData.seo.metaDescription || formData.excerpt || 'Article summary description...';

  return (
    <div className="space-y-6 pb-12">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight">
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditMode ? `Editing: "${formData.title}"` : 'Draft, format, and publish your technical article'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(formData.status === 'scheduled' ? 'scheduled' : 'published')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <FiCheck className="w-4 h-4" />
            <span>
              {formData.status === 'scheduled'
                ? 'Schedule Publication'
                : (isEditMode ? 'Save & Publish' : 'Publish Article')}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-8 space-y-6">

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label htmlFor="postTitle" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Article Title *
              </label>
              <input
                id="postTitle"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Modern Architecture Patterns in Distributed Systems"
                className="w-full px-4 py-2.5 text-base font-heading font-semibold text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400/20 focus:border-neutral-400"
              />
            </div>

            <div>
              <label htmlFor="postExcerpt" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Short Excerpt / Summary
              </label>
              <textarea
                id="postExcerpt"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Brief summary for cards and search results (auto-generated if left empty)..."
                className="w-full px-4 py-2 text-xs text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400/20 focus:border-neutral-400"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
              Article Body Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => handleChange('content', html)}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100">
              Publishing Options
            </h3>

            <div>
              <label htmlFor="postStatus" className="block text-xs font-semibold text-gray-700 mb-1">
                Publication Status
              </label>
              <select
                id="postStatus"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Live)</option>
                <option value="scheduled">Scheduled (Future)</option>
              </select>
            </div>

            {formData.status === 'scheduled' && (
              <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5">
                <label htmlFor="scheduledAt" className="block text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>Target Publish Date & Time</span>
                </label>
                <input
                  id="scheduledAt"
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => handleChange('scheduledAt', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 text-neutral-600 rounded border-gray-300 focus:ring-neutral-400"
                />
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <FiStar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Feature in Homepage Hero Spotlight</span>
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100">
              Taxonomy
            </h3>

            <div>
              <label htmlFor="postCategory" className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="postCategory"
                required
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.icon || '📁'} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="postTags" className="block text-xs font-semibold text-gray-700 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                id="postTags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="Microservices, Docker, React, AWS"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Separate keywords with commas. Tags will be auto-created.
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <ImageUpload
              value={formData.featuredImage.url}
              onChange={(url) => handleNestedChange('featuredImage', 'url', url)}
              label="Featured Image Banner"
            />

            {formData.featuredImage.url && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label htmlFor="imgAlt" className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Image Alt Text (Accessibility & SEO)
                  </label>
                  <input
                    id="imgAlt"
                    type="text"
                    value={formData.featuredImage.altText}
                    onChange={(e) => handleNestedChange('featuredImage', 'altText', e.target.value)}
                    placeholder="Describe image content..."
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="imgCaption" className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Image Caption (Optional)
                  </label>
                  <input
                    id="imgCaption"
                    type="text"
                    value={formData.featuredImage.caption}
                    onChange={(e) => handleNestedChange('featuredImage', 'caption', e.target.value)}
                    placeholder="Photo credits or summary..."
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <FiSearch className="w-3.5 h-3.5 text-neutral-600" />
              <span>Search Engine Optimization</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="metaTitle" className="block text-xs font-semibold text-gray-700">
                  Meta Title
                </label>
                <span className="text-[10px] text-gray-400">
                  {formData.seo.metaTitle.length}/70
                </span>
              </div>
              <input
                id="metaTitle"
                type="text"
                maxLength={70}
                value={formData.seo.metaTitle}
                onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                placeholder="Custom title tag for Google results..."
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="metaDesc" className="block text-xs font-semibold text-gray-700">
                  Meta Description
                </label>
                <span className="text-[10px] text-gray-400">
                  {formData.seo.metaDescription.length}/160
                </span>
              </div>
              <textarea
                id="metaDesc"
                rows={2}
                maxLength={160}
                value={formData.seo.metaDescription}
                onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                placeholder="Snippet for search engine listings..."
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Google Result Preview
              </span>
              <span className="text-[11px] text-[#202124] block truncate">
                https://techblog.com › blog › {formData.slug || 'article-slug'}
              </span>
              <span className="text-sm font-medium text-[#1a0dab] block line-clamp-1 hover:underline cursor-pointer">
                {previewTitle} | TechBlog
              </span>
              <span className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {previewDesc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditorPage;
