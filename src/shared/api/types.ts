export const ENDPOINTS = {
  API: {
    URL: 'https://wedev-api.sky.pro',
    BASE: '/api/fitness',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/users/me',
  },
  COURSES: {
    LIST: '/courses',
    BY_ID: (id: string) => `/courses/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },

} as const;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
};

export type User = { id: number; email: string; name?: string; avatar?: string };


