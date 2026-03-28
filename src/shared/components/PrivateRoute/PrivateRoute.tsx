import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Пока идет проверка токена (загрузка), показываем индикатор или ничего
  if (isLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;
  }

  // Если не авторизован — редиректим на страницу логина, запоминая, откуда пришли
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Если все ок — рендерим защищенный контент
  return <>{children}</>;
};
