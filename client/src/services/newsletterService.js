
import api from './api';

export const subscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/subscribe', { email });
  return response.data;
};

export const unsubscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/unsubscribe', { email });
  return response.data;
};

export default {
  subscribeNewsletter,
  unsubscribeNewsletter,
};

