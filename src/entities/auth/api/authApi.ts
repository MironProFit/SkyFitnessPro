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
  //Авторизация пользователя
  login: (data: LoginDto): Promise<LoginResponse> =>
    fetchWithoutContentType<LoginResponse>(ENDPOINTS.AUTH.LOGIN, { method: 'POST', body: data }),

  //Регистрация пользователя
  register: (data: RegisterDto): Promise<RegisterResponse> =>
    fetchWithoutContentType<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: data,
    }),

  //Обновление токена
  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    fetchWithoutContentType<RefreshResponse>(ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: { refreshToken },
    }),
};
