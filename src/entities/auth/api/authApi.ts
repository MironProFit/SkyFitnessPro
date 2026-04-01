// entities/auth/api/authApi.ts
import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS, type AuthResponse, type LoginDto, type RegisterDto } from '@/shared/api/types';

export const authApi = {
  login: (data: LoginDto) =>
    apiClient
      .post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data, { skipAuth: true })
      .then((res) => res.data),

  register: (data: RegisterDto) =>
    apiClient
      .post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data, { skipAuth: true })
      .then((res) => res.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, { refreshToken }, { skipAuth: true })
      .then((res) => res.data),
};
