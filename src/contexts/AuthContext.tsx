import type { ReactNode } from "react";
import { AuthContext } from "./AuthContextInstance";
import { useState } from "react";

export type { AuthContextType } from "./AuthContextInstance";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(
    () => localStorage.getItem("user") || null,
  );
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || null,
  );

  const login = (user: string, token?: string | null) => {
    setUser(user);
    localStorage.setItem("user", user);
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
