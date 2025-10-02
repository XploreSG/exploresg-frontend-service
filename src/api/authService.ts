import axios from "axios";
import type { UserInfo } from "../contexts/AuthContextInstance";
import { API_BASE_URL } from "./config";
import type { TokenPair } from "./tokenStorage";

export interface AuthSessionResponse {
  user: UserInfo;
  tokenPair: TokenPair;
}

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const createSessionWithGoogle = async (
  idToken: string,
): Promise<AuthSessionResponse> => {
  // Debug: log that we're about to call the backend (mask the idToken)
  try {
    const masked = `${idToken.slice(0, 8)}... (len=${idToken.length})`;
    console.debug(
      "createSessionWithGoogle: calling /api/v1/auth/session with idToken (masked):",
      masked,
    );
  } catch {
    console.debug(
      "createSessionWithGoogle: calling /api/v1/auth/session (failed to mask token)",
    );
  }

  const response = await authClient.post<AuthSessionResponse>(
    "/api/v1/auth/session",
    {},
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.debug("createSessionWithGoogle: response status", response.status);
  return response.data;
};

export const refreshSession = async (
  refreshToken?: string | null,
): Promise<TokenPair> => {
  const response = await authClient.post<TokenPair>(
    "/api/v1/auth/refresh",
    refreshToken ? { refreshToken } : {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const fetchCurrentUser = async (
  accessToken: string,
): Promise<UserInfo> => {
  const response = await authClient.get<UserInfo>("/api/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  return response.data;
};
