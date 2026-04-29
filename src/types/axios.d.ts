// src/types/axios.d.ts
import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
    skipAuth?: boolean;
    // 🔹 Добавляем недостающие поля, которые используются в axiosInstance
    skipContentType?: boolean;
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    // 🔹 Важно: делаем _retry опциональным (?), чтобы не было ошибок при создании конфига
    _retry?: boolean;
  }
}
