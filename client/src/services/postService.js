
import api from './api';

export const postService = {
  async getPosts(params = {}) {
    const res = await api.get('/posts', { params });
    return res.data?.data;
  },

  async getPostBySlug(slug) {
    const res = await api.get(`/posts/${slug}`);
    return res.data?.data;
  },

  async getFeaturedPosts() {
    const res = await api.get('/posts/featured');
    return res.data?.data?.posts || [];
  },

  async getTrendingPosts() {
    const res = await api.get('/posts/trending');
    return res.data?.data?.posts || [];
  },

  async getCategories() {
    const res = await api.get('/categories');
    return res.data?.data?.categories || [];
  },

  async getCategoryBySlug(slug) {
    const res = await api.get(`/categories/${slug}`);
    return res.data?.data?.category;
  },

  async getAdminPosts(params = {}) {
    const res = await api.get('/posts/admin/list', { params });
    return res.data?.data;
  },

  async getMyBlogs() {
    const res = await api.get('/posts/my-blogs');
    return res.data?.data?.posts || [];
  },

  async updatePostStatus(id, status) {
    const res = await api.patch(`/posts/${id}/status`, { status });
    return res.data?.data?.post;
  },

  async createPost(postData) {
    const res = await api.post('/posts', postData);
    return res.data?.data?.post;
  },

  async updatePost(id, postData) {
    const res = await api.put(`/posts/${id}`, postData);
    return res.data?.data?.post;
  },

  async deletePost(id) {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  async uploadImage(formData) {
    const res = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data;
  },
};

export default postService;
