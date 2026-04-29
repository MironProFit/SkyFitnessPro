// PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';
import { ROUTES } from '@/shared/config/routes';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  //  Исправлено: isInitializing вместо isLoading
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // Пока идёт проверка токена при загрузке приложения
  if (isInitializing) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;
  }

  // Если не авторизован — редирект на страницу авторизации
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
