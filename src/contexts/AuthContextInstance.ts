import { createContext } from "react";
import type { TokenPair } from "../api/tokenStorage";

export interface UserInfo {
  userId: number;
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

export interface AuthContextType {
  user: UserInfo | null;
  tokenPair: TokenPair | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (user: UserInfo, tokenPair?: TokenPair | null) => void;
  logout: () => void;
  refreshTokens: () => Promise<TokenPair | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
