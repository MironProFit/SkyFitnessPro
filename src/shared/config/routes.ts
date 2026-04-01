// Центральное хранилище всех путей приложения
export const ROUTES = {
  // Авторизация
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',

  // Основное приложение
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,

  // Профиль
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_SETTINGS: '/profile/settings',

  // Тренировки
  WORKOUT: '/workout',
  WORKOUT_DETAIL: (id: string) => `/workout/${id}`,
  PROGRESS: '/progress',

  // Системные страницы
  NOT_FOUND: '*',
  SERVER_ERROR: '/error',
} as const;

// Тип для ключей роутов
export type RouteKey = keyof typeof ROUTES;

// Тип для значений роутов
export type RoutePath = (typeof ROUTES)[RouteKey];

// Список публичных роутов (не требуют авторизации)
export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.NOT_FOUND,
  ROUTES.SERVER_ERROR,
];

// Список защищенных роутов
export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.HOME,
  ROUTES.COURSES,
  ROUTES.PROFILE,
  ROUTES.PROFILE_EDIT,
  ROUTES.PROFILE_SETTINGS,
  ROUTES.WORKOUT,
  ROUTES.PROGRESS,
];

// Проверка: является ли путь публичным
export const isPublicRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.includes(pathname as RoutePath)) {
    return true;
  }
  // Проверка динамических путей
  const dynamicPublicPatterns = [/^\/courses\/[^/]+$/];
  return dynamicPublicPatterns.some((pattern) => pattern.test(pathname));
};

// Проверка: требует ли путь авторизации
export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
};

// Получение пути по ключу (для динамических роутов)
export const getRoutePath = (key: RouteKey, params?: Record<string, string>): string => {
  const route = ROUTES[key];
  if (typeof route === 'function') {
    return route(params?.id || '');
  }
  return route;
};

// Редирект после авторизации
export const REDIRECT_AFTER_AUTH = ROUTES.COURSES;

// Редирект после логаута
export const REDIRECT_AFTER_LOGOUT = ROUTES.LOGIN;
