// src/shared/api/axiosInstance.ts
import { isPublicPath } from '@/shared/api/helpers';
import { ENDPOINTS } from '@/shared/api/types';
import { RefreshManager } from '@/shared/lib/refreshManager';
import { TokenStorage } from '@/shared/lib/tokenStorage';
import { authApi } from '@/entities/auth/api/authApi';
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const isDev = process.env.NODE_ENV === 'development';

export const apiClient = axios.create({
  baseURL: `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth || isPublicPath(config.url)) {
      return config;
    }

    const token = TokenStorage.getAccessToken();

    // Логирование для отладки
    if (isDev) {
      console.log('🔐 Вложение токена:', {
        hasToken: !!token,
        tokenPreview: token ? token.slice(0, 20) + '...' : null,
        url: config.url,
      });
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      if (isDev) {
        console.log('✅ Заголовок авторизации установлен');
      }
    } else if (!token && isDev) {
      console.warn('⚠️ Токен не найден, пропуск вложения заголовка авторизации');
    }

    if (isDev) {
      console.group('Запрос к API');
      console.log('URL:', config.url);
      console.log('Метод:', config.method?.toUpperCase());
      console.log('Параметры:', config.params);
      console.log('Тело:', config.data);
      console.log('Заголовки:', {
        ...config.headers,
        authorization: config.headers.authorization ? 'Bearer ***' : undefined,
      });
      console.groupEnd();
    }

    return config;
  },
  (error: AxiosError) => {
    if (isDev) {
      console.error('Ошибка при запросе:', error.message);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isDev) {
      console.group('Ответ API');
      console.log('URL:', response.config.url);
      console.log('Статус:', response.status);
      console.log('Данные:', response.data);
      console.groupEnd();
    }

    if (response.config.customSuccessMessage) {
      toast.success(response.config.customSuccessMessage);
    }
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (isDev) {
      console.group('Ошибка API');
      console.log('URL:', originalRequest.url);
      console.log('Статус:', status);
      console.log('Сообщение:', error.message);
      console.log('Ответ:', error.response?.data);
      console.groupEnd();
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (RefreshManager.isRefreshInProgress) {
        return new Promise((resolve, reject) => {
          RefreshManager.enqueue((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            apiClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      RefreshManager.setRefreshingStatus(true);

      try {
        const refreshToken = TokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('Нет доступного токена для обновления');
        }

        // 🔹 Используем authApi.refresh (на fetch) для обновления токена
        const { accessToken, refreshToken: newRefreshToken } = await authApi.refresh(refreshToken);

        if (newRefreshToken) {
          TokenStorage.setTokens(accessToken, newRefreshToken);
        } else {
          TokenStorage.updateAccessToken(accessToken);
        }

        RefreshManager.resolveQueue(accessToken);
        RefreshManager.setRefreshingStatus(false);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('Ошибка при обновлении токена:', refreshError);

        TokenStorage.clear();
        RefreshManager.rejectQueue();
        RefreshManager.setRefreshingStatus(false);

        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    const message = (error.response?.data as any)?.message || 'Произошла ошибка';
    const skipToast = originalRequest?.skipErrorToast;

    if (!skipToast) {
      switch (status) {
        case 400:
          toast.error(message);
          break;
        case 403:
          toast.error('Доступ запрещён');
          break;
        case 404:
          toast.error('Ресурс не найден');
          break;
        case 500:
        case 502:
        case 503:
          toast.error('Ошибка сервера. Попробуйте позже.');
          break;
        default:
          if (!error.response) {
            toast.error('Нет соединения с сервером');
          }
      }
    }

    return Promise.reject(error);
  }
);
