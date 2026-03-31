import { apiClient } from '@/shared/api/axiosInstance';
import { ENDPOINTS, type AuthResponse, type LoginDto, type RegisterDto } from '@/shared/api/types';

export const authApi = {
  //Логирование
  login: (data: LoginDto) =>
    apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data, {
      skipAuth: true,
    }),

  //Регистрация
  register: (data: RegisterDto) =>
    apiClient.post(ENDPOINTS.AUTH.REGISTER, data, {
      skipAuth: true,
    }),

  //Обновление токена
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, { refreshToken }, { skipAuth: true }),

  //Выход
  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
};
