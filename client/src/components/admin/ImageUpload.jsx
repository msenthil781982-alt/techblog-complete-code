
import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiTrash2, FiImage } from 'react-icons/fi';
import postService from '../../services/postService';
import toast from 'react-hot-toast';

const ImageUpload = ({ value = '', onChange, label = 'Featured Banner Image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const data = await postService.uploadImage(formData);
      if (data?.url) {
        onChange(data.url);
        toast.success('Image uploaded and optimized!');
      }
    } catch (err) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-slate-50 group max-w-lg">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-48 object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-semibold hover:bg-gray-100 transition-colors shadow-sm"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
              title="Remove image"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors max-w-lg ${
            dragOver
              ? 'border-brand-500 bg-brand-50/50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/60'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs font-medium text-gray-600">
                Optimizing & uploading image...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                <FiUploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-0.5">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-gray-400">
                WebP, PNG, JPG, AVIF or GIF (up to 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={(e) => handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
