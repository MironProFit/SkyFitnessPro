import { createContext, useContext, useState, type ReactNode } from 'react';

interface AppContextType {
  openModalAuth: boolean;
  toggleModalAuth: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [openModalAuth, setOpenModalAuth] = useState(false);
   const toggleModalAuth = () => {
    setOpenModalAuth((prev) => !prev);
  };

  const value = {
    openModalAuth,
    toggleModalAuth,
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
