import axios from 'axios';

// تغییر این آدرس به آدرس سرور شما
// برای Emulator از 10.0.2.2 استفاده کنید
// برای گوشی واقعی، IP کامپیوتر خود را وارد کنید (ipconfig)
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getConfigs = async () => {
  try {
    const response = await api.get('/configs');
    return response.data.configs;
  } catch (error) {
    console.error('Error fetching configs:', error);
    throw error;
  }
};

export const getConfigsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/configs/category/${categoryId}`);
    return response.data.configs;
  } catch (error) {
    console.error('Error fetching configs by category:', error);
    throw error;
  }
};

export default api;

