// AuthProvider.tsx
import type { ReactNode } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
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

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      }
      if (event.key === "token") {
        setToken(localStorage.getItem("token"));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
