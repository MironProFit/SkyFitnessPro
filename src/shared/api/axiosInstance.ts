import axios, { AxiosError } from 'axios';
import { ENDPOINTS } from '../config/api.endpoints';
import toast from 'react-hot-toast';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
  }
}

export const apiClient = axios.create({
  baseURL: `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.customSuccessMessage) {
      toast.success(response.config.customSuccessMessage);
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || 'Произошла ошибка';

    if (status === 400) {
      toast.error(message);
    }

    if (status === 401) {
      toast.error('Сессия истекла. Войдите снова.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (status === 403) {
      toast.error('Доступ запрещён');
    }

    if (status === 404) {
      toast.error('Ресурс не найден');
    }

    if (status === 500 || status === 502 || status === 503) {
      toast.error('Ошибка сервера. Попробуйте позже.');
    }

    if (!error.response) {
      toast.error('Нет соединения с сервером');
    }

    return Promise.reject(error);
  }
);
