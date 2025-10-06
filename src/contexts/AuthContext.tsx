// AuthProvider.tsx
import type { ReactNode } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { decodeJWT } from "../utils/jwtUtils";
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

  // When token changes, try to decode and merge user info from token
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = decodeJWT(token);
      if (!decoded) return;

      // build a partial user object from token fields if available
      const tokenUser: Partial<UserInfo> = {};

      if (decoded.userId !== undefined) {
        const id = decoded.userId;
        tokenUser.userId =
          typeof id === "string" || typeof id === "number" ? id : String(id);
      }
      if (decoded.sub && !tokenUser.email)
        tokenUser.email = String(decoded.sub);
      if (decoded.email && !tokenUser.email)
        tokenUser.email = String(decoded.email);
      if (decoded.givenName) tokenUser.givenName = String(decoded.givenName);
      if (decoded.familyName) tokenUser.familyName = String(decoded.familyName);
      if (decoded.picture) tokenUser.picture = String(decoded.picture);

      // Merge with existing user state
      setUser((prev) => {
        const merged = {
          // Start with an empty template if no prev
          userId: prev?.userId ?? tokenUser.userId ?? "",
          email: prev?.email ?? tokenUser.email ?? "",
          givenName: prev?.givenName ?? tokenUser.givenName ?? "",
          familyName: prev?.familyName ?? tokenUser.familyName ?? "",
          picture: prev?.picture ?? tokenUser.picture,
          // preserve other optional fields if present on prev
          phone: prev?.phone,
          dateOfBirth: prev?.dateOfBirth,
          drivingLicenseNumber: prev?.drivingLicenseNumber,
          passportNumber: prev?.passportNumber,
          preferredLanguage: prev?.preferredLanguage,
          countryOfResidence: prev?.countryOfResidence,
        } as UserInfo;

        try {
          localStorage.setItem("user", JSON.stringify(merged));
        } catch {
          // ignore storage errors
        }

        return merged;
      });
    } catch {
      // ignore decode errors
    }
  }, [token]);

  const login = useCallback((user: UserInfo, token?: string | null) => {
    const finalUser = { ...user };

    if (token) {
      try {
        const decoded = decodeJWT(token);
        if (decoded && decoded.userId) {
          finalUser.userId = decoded.userId;
        }
      } catch {
        // Ignore decode errors, proceed with the user object as is
      }
      setToken(token);
      localStorage.setItem("token", token);
    }

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      }
      if (event.key === "token") {
        setToken(localStorage.getItem("token"));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
