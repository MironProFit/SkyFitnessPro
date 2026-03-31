import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
    skipAuth?: boolean;
  }
  
  export interface InternalAxiosRequestConfig {
    _retry: boolean;
    skipErrorToast?: boolean;
    customSuccessMessage?: string;
    skipAuth?: boolean;
  }
}
