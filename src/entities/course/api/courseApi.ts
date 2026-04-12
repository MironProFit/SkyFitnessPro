// src/entities/course/api/courseApi.ts
import { ENDPOINTS } from '@/shared/api/types';
import { TokenStorage } from '@/shared/lib/tokenStorage';
import type { Course } from '@/entities/course/model/types';

const BASE_URL = `${ENDPOINTS.API.URL}${ENDPOINTS.API.BASE}`;

const handleResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    data = text as unknown as T;
  }
  if (!response.ok) {
    const error: any = new Error('API error');
    error.response = { status: response.status, data };
    throw error;
  }
  return data;
};

// Универсальная функция для fetch-запросов
const request = async (url: string, options: RequestInit = {}) => {
  const token = TokenStorage.getAccessToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Добавляем токен, если он есть и запрос не публичный
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Не добавляем Content-Type для совместимости с бэкендом
  return fetch(url, { ...options, headers });
};

export const courseApi = {
  // Получение всех курсов
  getCourses: (): Promise<Course[]> =>
    request(`${BASE_URL}${ENDPOINTS.COURSES.LIST}`, { skipAuth: true })
      .then((res) => handleResponse<Course[]>(res)),

  // Публичный запрос по ID
  getCourse: (id: string): Promise<Course> =>
    request(`${BASE_URL}${ENDPOINTS.COURSES.BY_ID(id)}`, { skipAuth: true })
      .then((res) => handleResponse<Course>(res)),
};