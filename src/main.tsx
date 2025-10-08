import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { FleetProvider } from "./contexts/FleetContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <FleetProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </FleetProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
