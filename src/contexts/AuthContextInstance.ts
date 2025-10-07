// AuthContextInstance.ts
import { createContext } from "react";

export interface UserInfo {
  // userId can be numeric or a string UUID depending on backend
  userId: number | string;
  email: string;
  givenName: string;
  familyName: string;
  picture?: string;
  phone?: string;
  dateOfBirth?: string;
  drivingLicenseNumber?: string;
  passportNumber?: string;
  preferredLanguage?: string;
  countryOfResidence?: string;
}

export type AppRole =
  | "USER"
  | "SUPPORT"
  | "ADMIN"
  | "FLEET_MANAGER"
  | "MANAGER";

export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  login: (user: UserInfo, token?: string | null) => void;
  logout: () => void;
  primaryRole: string;
  hasRole: (requiredRoles: string | string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
