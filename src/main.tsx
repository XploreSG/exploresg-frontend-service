import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { FleetProvider } from "./contexts/FleetContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { CollectionProvider } from "./contexts/CollectionContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getEnvVar, getResolvedEnv } from "./config/runtimeEnv";

// Log resolved env (mask sensitive tokens)
try {
  const env = getResolvedEnv();
  const mask = (s: string, showStart = 6, showEnd = 4) =>
    s && s.length > showStart + showEnd
      ? `${s.slice(0, showStart)}...${s.slice(-showEnd)}`
      : s;

  // Make the logged object non-sensitive
  const safe = {
    API_BASE_URL: env.API_BASE_URL || "(empty)",
    FLEET_API_BASE_URL: env.FLEET_API_BASE_URL || "(empty)",
    GOOGLE_CLIENT_ID: mask(env.GOOGLE_CLIENT_ID, 8, 8),
    MAPBOX_TOKEN: mask(env.MAPBOX_TOKEN, 6, 6),
    APP_ENV: env.APP_ENV,
    DEBUG: env.DEBUG,
  };
  console.info("Resolved environment (masked):", safe);
} catch (e) {
  console.warn("Could not read resolved environment", e);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={getEnvVar("GOOGLE_CLIENT_ID")}>
      <AuthProvider>
        <FleetProvider>
          <LoadingProvider>
            <CollectionProvider>
              <App />
            </CollectionProvider>
          </LoadingProvider>
        </FleetProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
