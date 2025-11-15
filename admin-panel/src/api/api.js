import axios from 'axios';

// برای Production از relative path استفاده می‌کنیم
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Configs
export const getConfigs = () => api.get('/configs');
export const getConfig = (id) => api.get(`/configs/${id}`);
export const getConfigsByCategory = (categoryId) => api.get(`/configs/category/${categoryId}`);
export const createConfig = (data) => api.post('/configs', data);
export const updateConfig = (id, data) => api.put(`/configs/${id}`, data);
export const deleteConfig = (id) => api.delete(`/configs/${id}`);

export default api;

