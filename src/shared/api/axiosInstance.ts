import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import toast from 'react-hot-toast';
import { ENDPOINTS } from './types';
import { isPublicPath } from './helpers';
import { TokenStorage } from '../lib/tokenStorage';
import { RefreshManager } from '../lib/refreshManager';

export const apiClient = axios.create({
  baseURL: `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Интерсептор запросов
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.skipAuth || isPublicPath(config.url)) {
    return config;
  }
  const token = TokenStorage.getAccessToken;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer${token}`;
  }
  return config;
});

//Интерсептор ответов
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.customSuccessMessage) {
      toast.success(response.config.customSuccessMessage);
    }
    return response;
  },

  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || 'Произошла ошибка';

    if (status === 400) {
      toast.error(message);
    }
    //401: Токен истёк → пытаемся получить новый
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Сценарий А: Рефреш УЖЕ идёт → добавляем в очередь
      if (RefreshManager.isRefrashInProgress) {
        return new Promise((resolve, reject) => {
          RefreshManager.enqueue((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              apiClient(originalRequest).then(resolve).catch(reject);
            }
          });
        });
      }
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
