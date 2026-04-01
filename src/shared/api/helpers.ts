import { ENDPOINTS } from './types';

// Публичные пути
export const PUBLIC_PATHS = [
  ENDPOINTS.AUTH.LOGIN,
  ENDPOINTS.AUTH.REGISTER,
  ENDPOINTS.AUTH.REFRESH,
  ENDPOINTS.COURSES.LIST,
];
//Проверяет является ли путь публичным
export const isPublicPath = (url: string | undefined) => {
  if (!url) return false;

  return PUBLIC_PATHS.some((path) => {
    if (path.includes(':')) {
      const pattern = path.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(url);
    }

    return url === path || url.startsWith(`${path}/`);
  });
};

//Обработка ошибок api

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Произошла неизвестная ошибка';
};
