
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techblog_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/refresh')
      ) {
        return Promise.reject(new Error(serverMessage));
      }

      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem('techblog_access_token', newAccessToken);
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('techblog_access_token');
        localStorage.removeItem('techblog_user');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    return Promise.reject(new Error(serverMessage));
  }
);

export default api;
