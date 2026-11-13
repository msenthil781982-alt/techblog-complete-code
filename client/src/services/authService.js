
import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res.data?.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data?.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.data;
  },

  async refreshToken() {
    const res = await api.post('/auth/refresh');
    return res.data?.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('techblog_access_token');
      localStorage.removeItem('techblog_user');
    }
  },
};

export default authService;
