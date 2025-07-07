
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'admin123'; // Em produção, isso viria de uma variável de ambiente
const ADMIN_SESSION_KEY = 'admin_authenticated';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está autenticado na sessão
    const authenticated = sessionStorage.getItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(authenticated === 'true');
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
