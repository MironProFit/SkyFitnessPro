import { ROUTES } from '@/shared/config/routes';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/entities/user/api/userApi';

interface AppContextType {
  openModalAuth: boolean;
  toggleModalAuth: () => void;
  openModalProfile: boolean;
  setOpenModalProfile: (value: boolean) => void;
  toggleModalProfile: () => void;
  isAppLoading: boolean;
  setIsAppLoading: (value: boolean) => void;
  error: string | null;
  setError: (value: string | null) => void;
  addCourseForUser: (courseId: string) => Promise<void>;
  removeCourseForUser: (courseId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const isAuthRoute = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;
    setOpenModalAuth(isAuthRoute);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          //Реализация запроса профиля
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsAppLoading(false);
      }
    };
    checkAuth();
  }, []);

  const addCourseForUser = async (courseId: string) => {
    try {
      await userApi.addCourse(courseId);
      //Инвалидируем кэш, чтобы данные обновились
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('✅ Course added:', courseId);
    } catch (err) {
      console.error('❌ Failed to add course:', err);
      throw err;
    }
  };

  const removeCourseForUser = async (courseId: string) => {
    try {
      await userApi.removeCourse(courseId);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('✅ Course removed:', courseId);
    } catch (err) {
      console.error('❌ Failed to remove course:', err);
      throw err;
    }
  };

  const toggleModalAuth = () => {
    setOpenModalAuth((prev) => !prev);
    const isAuthRoute = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;
    if (isAuthRoute) {
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  const toggleModalProfile = () => setOpenModalProfile((prev) => !prev);

  const value = {
    openModalAuth,
    toggleModalAuth,
    openModalProfile,
    setOpenModalProfile,
    toggleModalProfile,
    isAppLoading,
    setIsAppLoading,
    error,
    setError,
    addCourseForUser,
    removeCourseForUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
