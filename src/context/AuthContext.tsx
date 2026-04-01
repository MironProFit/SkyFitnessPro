import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Здесь можно сделать запрос к API для валидации токена
          // const userData = await api.get('/me');
          // setUser(userData);

          // Пока заглушка: если токен есть, считаем пользователя авторизованным
          setUser({
            id: '1',
            name: 'Miron',
            email: 'miron@example.com',
            token,
          });
        }
      } catch (error) {
        console.error('Auth check failed', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Логин
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fakeToken = 'fake-jwt-token-12345';
      localStorage.setItem('token', fakeToken);

      setUser({
        id: '1',
        name: 'Miron',
        email,
        token: fakeToken,
      });
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Регистрация
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fakeToken = 'fake-jwt-token-67890';
      localStorage.setItem('token', fakeToken);

      setUser({
        id: '2',
        name,
        email,
        token: fakeToken,
      });
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Логаут
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: false,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для удобного использования
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
