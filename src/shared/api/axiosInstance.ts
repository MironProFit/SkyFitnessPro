import axios from 'axios';

const API_URL = 'https://api.skyfitnesspro.example.com'; // аменить на реальный URL из документации

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// нтерцептор для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \Bearer \\;
  }
  return config;
});

export default apiClient;