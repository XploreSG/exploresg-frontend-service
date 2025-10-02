import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContextInstance";
import type { UserInfo } from "./AuthContextInstance";
import { tokenStorage, type TokenPair } from "../api/tokenStorage";
import { fetchCurrentUser, refreshSession } from "../api/authService";

const USER_STORAGE_KEY = "exploresg.user";
const isBrowser = typeof window !== "undefined";

const loadStoredUser = (): UserInfo | null => {
  if (!isBrowser) return null;
  const stored = sessionStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserInfo;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(() => loadStoredUser());
  const [tokenPair, setTokenPair] = useState<TokenPair | null>(() =>
    tokenStorage.get(),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    if (!user) {
      sessionStorage.removeItem(USER_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const unsubscribe = tokenStorage.subscribe((next) => {
      setTokenPair(next);
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokenPair(null);
    tokenStorage.clear();
  }, []);

  useEffect(() => {
    if (!tokenPair || user) return;

    let active = true;
    const hydrateUser = async () => {
      try {
        setIsLoading(true);
        const profile = await fetchCurrentUser(tokenPair.accessToken);
        if (active) {
          setUser(profile);
        }
      } catch (error) {
        console.warn("Failed to hydrate user session", error);
        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    hydrateUser();

    return () => {
      active = false;
    };
  }, [tokenPair, user, logout]);

  const login = useCallback(
    (nextUser: UserInfo, nextTokenPair?: TokenPair | null) => {
      setUser(nextUser);
      if (nextTokenPair) {
        tokenStorage.set(nextTokenPair);
        setTokenPair(nextTokenPair);
      } else {
        tokenStorage.clear();
        setTokenPair(null);
      }
    },
  []);

  const refreshTokens = useCallback(async () => {
    const current = tokenStorage.get();
    if (!current) return null;
    if (tokenStorage.isRefreshTokenExpired()) {
      logout();
      return null;
    }

    try {
      const refreshed = await refreshSession(current.refreshToken);
      tokenStorage.set(refreshed);
      setTokenPair(refreshed);
      return refreshed;
    } catch (error) {
      console.warn("Failed to refresh tokens from context", error);
      logout();
      return null;
    }
  }, [logout]);

  const contextValue = useMemo(
    () => ({
      user,
      tokenPair,
      accessToken: tokenPair?.accessToken ?? null,
      isLoading,
      login,
      logout,
      refreshTokens,
    }),
    [user, tokenPair, isLoading, login, logout, refreshTokens],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
