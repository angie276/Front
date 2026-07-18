import api from './api.js';

export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};
