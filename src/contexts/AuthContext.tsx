// AuthProvider.tsx
import type { ReactNode } from "react";
import { useState } from "react";
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

  const login = (user: UserInfo, token?: string | null) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    if (token) {
      setToken(token);
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
