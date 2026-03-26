import axios from 'axios';
import { ENDPOINTS } from '../config/api.endpoints';

export const apiClient = axios.create({
  baseURL: `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// нтерцептор для добавления токена
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = ;
//   }
//   return config;
// });

// export default apiClient;
