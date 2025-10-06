// AuthProvider.tsx
import type { ReactNode } from "react";
import { useState, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContextInstance";
import type { UserInfo } from "./AuthContextInstance"; // <-- type-only import

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || null,
  );

  const login = useCallback((user: UserInfo, token?: string | null) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
