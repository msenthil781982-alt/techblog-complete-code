
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiUpload, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';
import toast from 'react-hot-toast';

const SubmitBlogPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState('');

  const submitInProgress = useRef(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await postService.getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setCategory(cats[0]._id || cats[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      const data = await postService.uploadImage(formData);
      setImageUrl(data.url);
      toast.success('Image uploaded successfully', { id: 'upload' });
    } catch (err) {
      toast.error('Image upload failed. You can paste an image URL instead.', { id: 'upload' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitInProgress.current || isSubmitting) return;

    if (!title.trim()) {
      setError('Please provide a title for your blog.');
      return;
    }

    if (!content.trim()) {
      setError('Please write some content for your blog.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    submitInProgress.current = true;

    try {
      await postService.createPost({
        title: title.trim(),
        content: content.trim(),
        category: category || undefined,
        featuredImage: imageUrl.trim() ? { url: imageUrl.trim() } : undefined,
        status: 'pending',
      });

      setSubmittedSuccess(true);
      toast.success('Your blog has been submitted and is waiting for admin approval.');
    } catch (err) {
      setError(err.message || 'Failed to submit blog. Please try again.');
    } finally {
      setIsSubmitting(false);
      submitInProgress.current = false;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading font-bold text-2xl text-[#222222] mb-3">
          Login Required to Submit a Blog
        </h2>
        <p className="text-sm text-[#666666] mb-6">
          Please log in or create an account to submit your blog for admin review.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/admin/login"
            className="px-5 py-2.5 rounded bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            Login / Register
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded border border-[#dddddd] bg-[#f4f4f4] text-[#222222] text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  if (submittedSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <FiCheckCircle className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-[#222222] mb-3">
          Blog Submitted Successfully!
        </h2>
        <div className="p-4 bg-[#f4f4f4] border border-[#dddddd] rounded text-sm text-[#222222] mb-6 font-medium">
          Your blog has been submitted and is waiting for admin approval.
        </div>
        <p className="text-xs text-[#666666] mb-6">
          Once the admin approves your blog, it will automatically appear live on the website.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/my-blogs"
            className="px-5 py-2.5 rounded bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            View My Blogs
          </Link>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setContent('');
              setImageUrl('');
              setSubmittedSuccess(false);
            }}
            className="px-5 py-2.5 rounded border border-[#dddddd] bg-white text-[#222222] text-sm font-semibold hover:bg-[#f4f4f4] transition-colors"
          >
            Submit Another Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#2563eb] transition-colors mb-3"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#222222]">
          Submit a New Blog Post
        </h1>
        <p className="text-sm text-[#666666] mt-1">
          Share your technical knowledge. All submissions are reviewed by the admin before being published.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-sm">
          <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#dddddd] rounded p-6 sm:p-8 space-y-5 shadow-sm">

        <div>
          <label htmlFor="blogTitle" className="block text-xs font-semibold uppercase tracking-wider text-[#222222] mb-1.5">
            Blog Title *
          </label>
          <input
            id="blogTitle"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Understanding Distributed Systems in Practice"
            className="w-full px-3.5 py-2.5 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <div>
          <label htmlFor="blogCategory" className="block text-xs font-semibold uppercase tracking-wider text-[#222222] mb-1.5">
            Category
          </label>
          <select
            id="blogCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb] bg-white"
          >
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.icon || '📁'} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#222222] mb-1.5">
            Blog Image (Optional)
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
              className="w-full px-3 py-2 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb]"
            />
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#dddddd] bg-[#f4f4f4] hover:bg-[#e5e5e5] rounded text-[#222222] transition-colors">
                <FiUpload className="w-3.5 h-3.5" />
                <span>Upload from Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <span className="text-xs text-green-600 font-medium truncate max-w-xs">
                  Image attached
                </span>
              )}
            </div>
            {imageUrl && (
              <div className="mt-2 w-full max-h-48 overflow-hidden rounded border border-[#dddddd]">
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="blogContent" className="block text-xs font-semibold uppercase tracking-wider text-[#222222] mb-1.5">
            Blog Content *
          </label>
          <textarea
            id="blogContent"
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            className="w-full px-3.5 py-2.5 text-sm text-[#222222] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb] font-sans leading-relaxed"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-[#666666]">
            Status will be set to <strong className="text-[#222222]">Pending</strong> for admin review.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitBlogPage;

