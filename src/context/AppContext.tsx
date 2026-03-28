import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // await validateToken(token); // ✅ Раскомментируйте если есть валидация
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsAppLoading(false); // ✅ Загрузка завершена
      }
    };
    checkAuth();
  }, []);

  const toggleModalAuth = () => setOpenModalAuth((prev) => !prev);
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
