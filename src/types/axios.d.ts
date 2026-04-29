import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
    skipAuth?: boolean;
    skipContentType?: boolean;
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
  }
}
