// src/shared/lib/fetchWithoutContentType.ts
import { ENDPOINTS } from '@/shared/api/types';
import { TokenStorage } from '@/shared/lib/tokenStorage';

type FetchOptions = {
  method: 'POST' | 'DELETE' | 'PUT';
  body?: unknown;
};

/**
 * Выполняет fetch-запрос БЕЗ заголовка Content-Type: application/json
 * Используется для эндпоинтов, которые не принимают JSON-заголовок
 */
export const fetchWithoutContentType = async <T>(
  endpoint: string,
  { method, body }: FetchOptions
): Promise<T> => {
  //Собираем полный URL
  const baseUrl = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`;
  const url = `${baseUrl}${endpoint}`;

  //Тело запроса: преобразуем в Blob без типа
  // Это предотвращает автоматическое добавление заголовка Content-Type браузером
  let fetchBody: BodyInit | undefined;
  if (body !== undefined) {
    const jsonString = JSON.stringify(body);
    fetchBody = new Blob([jsonString], { type: '' });
  }

  //Заголовки: только Authorization, БЕЗ Content-Type!
  const token = TokenStorage.getAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    body: fetchBody,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });

  const text = await response.text();

  //Обработка ошибок
  if (!response.ok) {
    const error: any = new Error(`API error: ${response.status}`);
    error.response = {
      status: response.status,
      statusText: response.statusText,
      data: text,
    };
    throw error;
  }

  //Парсим ответ: пытаемся JSON, если не выходит — возвращаем текст
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};
