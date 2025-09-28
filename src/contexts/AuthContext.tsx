import type { ReactNode } from "react";
import { AuthContext } from "./AuthContextInstance";
import { useState } from "react";

export type { AuthContextType } from "./AuthContextInstance";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(
    () => localStorage.getItem("user") || null,
  );

  const login = (user: string) => {
    setUser(user);
    localStorage.setItem("user", user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
