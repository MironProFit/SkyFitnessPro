import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '@/entities/auth/api/authApi';
import toast from 'react-hot-toast';
import { TokenStorage } from '@/shared/lib/tokenStorage';

export interface User {
  email: string;
  selectedCourses: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Инициализация: восстанавливаем пользователя из кэша при загрузке
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = TokenStorage.getAccessToken();
        const cachedEmail = TokenStorage.getCachedUserEmail();

        if (token && cachedEmail) {
          // Восстанавливаем пользователя из кэша
          setUser({ email: cachedEmail, selectedCourses: [] });
          console.log('👤 User restored from cache:', cachedEmail);
        } else if (!token) {
          // Токена нет — точно не авторизован
          setUser(null);
        }
        // Если токен есть, но кэша нет — пользователь не авторизован
      } catch (error) {
        console.error('Auth initialization failed:', error);
        TokenStorage.clear();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const response = await authApi.login({ email, password });

      if (response.token) {
        // Сохраняем токен И email в кэш
        TokenStorage.setTokens(response.token, response.token, email);

        // Создаём пользователя из данных формы
        setUser({ email, selectedCourses: [] });

        console.log('👤 User set from login:', { email });
        toast.success('Успешный вход!');
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Ошибка при входе';
      toast.error(message);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      await authApi.register({ email, password });
      const loginResponse = await authApi.login({ email, password });

      if (loginResponse.token) {
        // Сохраняем токен И email в кэш
        TokenStorage.setTokens(loginResponse.token, loginResponse.token, email);

        // Создаём пользователя из данных формы
        setUser({ email, selectedCourses: [] });

        toast.success('Регистрация прошла успешно!');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Ошибка при регистрации';
      toast.error(message);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    // Очищаем всё: токен, рефреш, кэш пользователя
    TokenStorage.clear();
    setUser(null);
    toast.success('Вы вышли из аккаунта');
  };

  // Функция для принудительного обновления 
  const refreshUser = async () => {
    // заглушка
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isInitializing,
    isAuthenticating,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
