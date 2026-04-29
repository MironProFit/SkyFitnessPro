import { AuthModal } from '@/widgets/auth-widget/AuthModal';
import { useApp } from '@/context/AppContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

export default function AuthPage() {
  const { openModalAuth, toggleModalAuth } = useApp();
  const location = useLocation();

  // Если открыли как отдельную страницу (прямой переход на /login),гарантируем, что модалка открыта

  useEffect(() => {
    const isDirectPageAccess =
      location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

    if (isDirectPageAccess && !openModalAuth) {
      toggleModalAuth();
    }
  }, [location.pathname, openModalAuth, toggleModalAuth]);

  return <AuthModal />;
}
