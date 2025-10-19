/**
 * API Configuration
 * Centralized configuration for all API endpoints and external services.
 * Supports both build-time (Vite) and runtime (Docker-injected env.js) environments.
 */

import { getEnvVar } from "./runtimeEnv";

// -----------------------------------------
// ✅ Required Environment Variables Validation
// -----------------------------------------
const requiredEnvVars = {
  API_BASE_URL: getEnvVar("API_BASE_URL"),
  FLEET_API_BASE_URL: getEnvVar("FLEET_API_BASE_URL"),
  BOOKING_API_BASE_URL: getEnvVar("BOOKING_API_BASE_URL"),
  GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
} as const;

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`,
  );
  console.error("For local dev: Set VITE_${VAR_NAME} in .env.development");
  console.error(
    "For production: Set ${VAR_NAME} in .env.production (no VITE_ prefix)",
  );
}

// -----------------------------------------
// ✅ Core URLs
// -----------------------------------------
export const API_BASE_URL = getEnvVar("API_BASE_URL", "http://localhost:8080");
export const FLEET_API_BASE_URL = getEnvVar(
  "FLEET_API_BASE_URL",
  "http://localhost:8081",
);
export const BOOKING_API_BASE_URL = getEnvVar(
  "BOOKING_API_BASE_URL",
  "http://localhost:8082",
);

// -----------------------------------------
// ✅ Third-Party Config
// -----------------------------------------
export const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
export const MAPBOX_TOKEN = getEnvVar("MAPBOX_TOKEN");

// -----------------------------------------
// ✅ Environment Settings
// -----------------------------------------
export const APP_ENV = getEnvVar("APP_ENV", "development");
export const IS_PRODUCTION = APP_ENV === "production";
export const IS_DEVELOPMENT = APP_ENV === "development";
export const DEBUG_ENABLED = getEnvVar("DEBUG", "false") === "true";

// -----------------------------------------
// ✅ API Endpoint Definitions
// -----------------------------------------
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/v1/auth/google`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  },

  USER: {
    SIGNUP: `${API_BASE_URL}/api/v1/signup`,
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
  },

  FLEET: {
    MODELS: `${FLEET_API_BASE_URL}/api/v1/fleet/models`,
    VEHICLES: `${FLEET_API_BASE_URL}/api/v1/fleet/vehicles`,
  },

  BOOKING: {
    CREATE: `${BOOKING_API_BASE_URL}/api/v1/bookings`,
    DETAILS: (id: string) => `${BOOKING_API_BASE_URL}/api/v1/bookings/${id}`,
    PAY: (id: string) => `${BOOKING_API_BASE_URL}/api/v1/bookings/${id}/pay`,
  },

  TEST: `${API_BASE_URL}/test`,
} as const;

// -----------------------------------------
// ✅ API Client Configuration
// -----------------------------------------
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if using cookies for auth
} as const;

// -----------------------------------------
// ✅ Development Logging
// -----------------------------------------
if (IS_DEVELOPMENT && DEBUG_ENABLED) {
  console.log("API Configuration Loaded:", {
    API_BASE_URL,
    FLEET_API_BASE_URL,
    BOOKING_API_BASE_URL,
    APP_ENV,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? "Set" : "Missing",
    MAPBOX_TOKEN: MAPBOX_TOKEN ? "Set" : "Missing",
  });
}

// -----------------------------------------
// ✅ Validation Function
// -----------------------------------------
export function validateApiConfig(): boolean {
  const isValid = missingVars.length === 0;
  if (!isValid && IS_PRODUCTION) {
    throw new Error(
      `Production deployment failed: Missing environment variables: ${missingVars.join(", ")}`,
    );
  }
  return isValid;
}
