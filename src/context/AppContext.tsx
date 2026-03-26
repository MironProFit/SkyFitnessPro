import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface AppContextType {
  openModalAuth: boolean;
  toggleModalAuth: () => void;
  openModalProfile: boolean;
  setOpenModalProfile: (value: boolean) => void;
  toggleModalProfile: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleModalAuth = () => {
    setOpenModalAuth((prev) => !prev);
  };
  const [openModalProfile, setOpenModalProfile] = useState(false);
  useEffect(() => {
    setOpenModalProfile(false);
  }, []);
  const toggleModalProfile = () => {
    setOpenModalProfile((prev) => !prev);
  };

  const value = {
    openModalAuth,
    toggleModalAuth,

    openModalProfile,
    setOpenModalProfile,
    toggleModalProfile,

    isLoading,
    setIsLoading,

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
