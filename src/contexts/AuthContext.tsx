import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

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
