// src/entities/auth/api/authApi.ts
import { ENDPOINTS } from '@/shared/api/types';
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
} from '@/shared/api/types';
import { fetchWithoutContentType } from '@/shared/lib/fetchWithoutContentType';

export const authApi = {
  /**
   * Авторизация пользователя
   * POST /auth/login
   * Body: { email, password }
   * Response: { token }
   */
  login: (data: LoginDto): Promise<LoginResponse> =>
    fetchWithoutContentType<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { method: 'POST', body: data }),

  /**
   * Регистрация пользователя
   * POST /auth/register
   * Body: { email, password }
   * Response: { message }
   */
  register: (data: RegisterDto): Promise<RegisterResponse> =>
    fetchWithoutContentType<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: data,
    }),

  /**
   * Обновление токена
   * POST /auth/refresh
   * Body: { refreshToken }
   * Response: { accessToken, refreshToken? }
   */
  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    fetchWithoutContentType<RefreshResponse>(ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: { refreshToken },
    }),
};
