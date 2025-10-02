import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "./config";
import { refreshSession } from "./authService";
import { tokenStorage, type TokenPair } from "./tokenStorage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<TokenPair | null> | null = null;

const attachAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token: string,
) => {
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  config.headers = headers;
};

const performRefresh = async (): Promise<TokenPair | null> => {
  const existing = tokenStorage.get();
  const refreshToken = existing?.refreshToken;
  if (!refreshToken) return null;
  try {
    const tokenPair = await refreshSession(refreshToken);
    tokenStorage.set(tokenPair);
    return tokenPair;
  } catch (error) {
    console.warn("Failed to refresh session", error);
    tokenStorage.clear();
    return null;
  }
};

apiClient.interceptors.request.use(async (config) => {
  const tokens = tokenStorage.get();
  if (!tokens) return config;

  if (tokenStorage.isAccessTokenExpired()) {
    if (tokenStorage.isRefreshTokenExpired()) {
      tokenStorage.clear();
      return config;
    }

    refreshPromise = refreshPromise ?? performRefresh();
    const refreshed = await refreshPromise;
    refreshPromise = null;

    if (refreshed) {
      attachAuthorizationHeader(config, refreshed.accessToken);
      return config;
    }

    return config;
  }

  attachAuthorizationHeader(config, tokens.accessToken);
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (tokenStorage.isRefreshTokenExpired()) {
        tokenStorage.clear();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      refreshPromise = refreshPromise ?? performRefresh();
      const refreshed = await refreshPromise;
      refreshPromise = null;

      if (refreshed) {
        attachAuthorizationHeader(originalRequest, refreshed.accessToken);
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export { apiClient };
