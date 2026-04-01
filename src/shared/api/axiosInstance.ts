// shared/api/axiosInstance.ts

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

// ─────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR: добавляем токен
// ─────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Пропускаем авторизацию для публичных запросов
    if (config.skipAuth || isPublicPath(config.url)) {
      return config;
    }

    const token = TokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR: обработка ошибок и рефреш токена
// ─────────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  // ✅ ВОЗВРАЩАЕМ ВЕСЬ ОТВЕТ (AxiosResponse) — типы сохраняются!
  (response: AxiosResponse) => {
    if (response.config.customSuccessMessage) {
      toast.success(response.config.customSuccessMessage);
    }
    return response; // ← Не response.data!
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    const status = error.response?.status;

    // ─────────────────────────────────────────────────────
    // 🔴 401: Токен истёк → пытаемся получить новый
    // ─────────────────────────────────────────────────────
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ─────────────────────────────────────────────────
      // Сценарий А: Рефреш УЖЕ идёт → добавляем в очередь
      // ─────────────────────────────────────────────────
      if (RefreshManager.isRefrashInProgress) {
        return new Promise((resolve, reject) => {
          RefreshManager.enqueue((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            apiClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      // ─────────────────────────────────────────────────
      // Сценарий Б: Рефреш НЕ идёт → запускаем его
      // ─────────────────────────────────────────────────
      RefreshManager.setRefrashingStatus(true);

      try {
        const refreshToken = TokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('Нет доступного обновления токена');
        }

        // 📡 Запрос на обновление токена
        const { data } = await axios.post<{
          accessToken: string;
          refreshToken?: string;
        }>(
          `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}${ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken: newRefreshToken } = data;

        // 💾 Сохраняем новые токены
        if (newRefreshToken) {
          TokenStorage.setTokens(accessToken, newRefreshToken);
        } else {
          TokenStorage.updateAccessToken(accessToken);
        }

        // ✅ Уведомляем ВСЕ запросы в очереди
        RefreshManager.resolveQueue(accessToken);
        RefreshManager.setRefrashingStatus(false);

        // 🔄 Повторяем ОРИГИНАЛЬНЫЙ запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // ❌ РЕФРЕШ НЕ УДАЛСЯ → полный логаут

        console.error('Ошибка рефреша токена', refreshError);

        TokenStorage.clear();
        RefreshManager.rejectQueue();
        RefreshManager.setRefrashingStatus(false);

        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // ─────────────────────────────────────────────────────
    // 🟡 Обработка остальных ошибок (не 401)
    // ─────────────────────────────────────────────────────
    const message = (error.response?.data as any)?.message || 'Произошла ошибка';
    const skipToast = originalRequest?.skipErrorToast;

    if (!skipToast) {
      switch (status) {
        case 400:
          toast.error(message);
          break;
        case 403:
          toast.error('🔒 Доступ запрещён');
          break;
        case 404:
          toast.error('📭 Ресурс не найден');
          break;
        case 500:
        case 502:
        case 503:
          toast.error('🔧 Ошибка сервера. Попробуйте позже.');
          break;
        default:
          if (!error.response) {
            toast.error('🌐 Нет соединения с сервером');
          }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
