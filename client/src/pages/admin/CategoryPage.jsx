
import React, { useState } from 'react';
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const AVAILABLE_COLORS = [
  'blue', 'purple', 'cyan', 'orange', 'red', 'indigo', 'green', 'yellow', 'pink', 'gray'
];

const CategoryPage = () => {
  const { data: categories = [], isLoading, refetch } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: 'blue',
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: '📁', color: 'blue' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      icon: cat.icon || '📁',
      color: cat.color || 'blue',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id || editingCategory._id}`, formData);
        toast.success('Category updated successfully!');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      await api.delete(`/categories/${cat.id || cat._id}`);
      toast.success('Category deleted.');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Cannot delete category.');
    }
  };

  const handleResyncCounts = async () => {
    setIsSyncing(true);
    try {
      await api.post('/categories/resync-counts');
      toast.success('Category article counts synchronized!');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to resynchronize counts.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 tracking-tight">
            Categories & Taxonomy
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Organize article classifications, color tags, and review post counts
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleResyncCounts}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            title="Recalculate published post counts for all categories"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Resync Counts</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <Spinner size="md" />
          <p className="text-xs text-gray-500 mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-2xl">{cat.icon || '📁'}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {cat.postCount || 0} Articles
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-gray-900 mb-1">
                  {cat.name}
                </h3>
                <code className="text-[11px] text-gray-400 block mb-2 font-mono">
                  /blog?category={cat.slug}
                </code>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Color: <strong className="text-gray-700">{cat.color || 'blue'}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition-colors"
                    title="Edit category"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete category"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Distributed Systems"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🚀, 💻, 🤖..."
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white capitalize"
                  >
                    {AVAILABLE_COLORS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of articles covered in this category..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
