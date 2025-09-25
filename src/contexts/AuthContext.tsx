import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../services/authService";
import { AuthContext } from "./AuthContextDefinition";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for token on app start and after OAuth redirect
  useEffect(() => {
    const checkAuth = async () => {
      // Check URL for token (after OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        authService.setToken(urlToken);
        setToken(urlToken);
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } else {
        // Check localStorage for existing token
        const storedToken = authService.getToken();
        setToken(storedToken);
      }

      // If we have a token, get user info
      if (urlToken || authService.getToken()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to get user:", error);
          authService.removeToken();
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    authService.startGoogleLogin();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
