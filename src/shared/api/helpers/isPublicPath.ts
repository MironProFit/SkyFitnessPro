import { ENDPOINTS } from '../types';

export const PUBLIC_PATHS: string[] = [
  ENDPOINTS.AUTH.LOGIN,
  ENDPOINTS.AUTH.REGISTER,
  ENDPOINTS.AUTH.REFRESH,
  ENDPOINTS.COURSES.LIST,
];

const EXACT_MATCH_PATHS: string[] = [ENDPOINTS.COURSES.LIST];

export const isPublicPath = (url: string | undefined): boolean => {
  if (!url) return false;

  return PUBLIC_PATHS.some((path) => {
    if (path.includes(':')) {
      const pattern = path.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(url);
    }

    if (EXACT_MATCH_PATHS.includes(path)) {
      return url === path;
    }

    return url === path || url.startsWith(`${path}/`);
  });
};
