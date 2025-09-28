import { createContext } from "react";

export interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (user: string, token?: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
