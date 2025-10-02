import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Debug: log the Google client id at app startup (masked)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
if (GOOGLE_CLIENT_ID) {
  try {
    console.debug(
      "VITE_GOOGLE_CLIENT_ID (masked):",
      GOOGLE_CLIENT_ID.slice(0, 8) + "...",
    );
  } catch {
    /* ignore */
  }
} else {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
