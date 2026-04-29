import { ENDPOINTS } from '@/shared/api/types';
import { TokenStorage } from '@/shared/lib/tokenStorage';
import { authApi } from '@/entities/auth/api/authApi';

type FetchOptions = {
  method: 'POST' | 'DELETE' | 'PUT';
  body?: unknown;
};

export const fetchWithoutContentType = async <T>(
  endpoint: string,
  { method, body }: FetchOptions
): Promise<T> => {
  const baseUrl = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`;
  const url = `${baseUrl}${endpoint}`;

  //Подготовка тела: Blob без типа → браузер не добавляет Content-Type
  let fetchBody: BodyInit | undefined;
  if (body !== undefined) {
    const jsonString = JSON.stringify(body);
    fetchBody = new Blob([jsonString], { type: '' });
  }

  //Функция для выполнения запроса с текущим токеном
  const executeRequest = async (token: string | null) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    //Удаленоcredentials: 'include' — это вызывало ошибку CORS с '*'
    const response = await fetch(url, {
      method,
      body: fetchBody,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      //credentials: 'include', удалено из-за ошибки
    });

    const text = await response.text();

    if (!response.ok) {
      const error: any = new Error(`API error: ${response.status}`);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: text,
      };
      throw error;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  };

  //Первый запрос с текущим токеном
  let token = TokenStorage.getAccessToken();
  try {
    return await executeRequest(token);
  } catch (error: any) {
    //Если получили 401 — пробуем рефрешнуть токен
    if (error.response?.status === 401) {
      try {
        const refreshToken = TokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        //Рефрешим токен через authApi
        const { accessToken, refreshToken: newRefreshToken } = await authApi.refresh(refreshToken);

        //Сохраняем новые токены
        if (newRefreshToken) {
          TokenStorage.setTokens(accessToken, newRefreshToken);
        } else {
          TokenStorage.updateAccessToken(accessToken);
        }

        //Повторяем запрос с новым токеном
        return await executeRequest(accessToken);
      } catch (refreshError) {
        //Если рефреш не удался — очищаем токены и пробрасываем ошибку
        console.error('Token refresh failed:', refreshError);
        TokenStorage.clear();
        window.location.href = '/login';
        throw refreshError;
      }
    }
    //Если ошибка не 401 — пробрасываем как есть
    throw error;
  }
};
