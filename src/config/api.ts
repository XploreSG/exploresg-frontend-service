/**
 * API Configuration
 * Centralized configuration for all API endpoints and external services
 */

// Environment Variables Validation
const requiredEnvVars = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
} as const;

// Check for missing required variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`,
  );
  console.error(
    "Please create a .env.local file based on .env.example and set all required variables",
  );
}

// API Base URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const FLEET_API_BASE_URL =
  import.meta.env.VITE_FLEET_API_BASE_URL || "http://localhost:8081";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/v1/auth/google`,
    LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  },

  // User endpoints
  USER: {
    SIGNUP: `${API_BASE_URL}/api/v1/signup`,
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
  },

  // Fleet/Rental endpoints
  FLEET: {
    MODELS: `${FLEET_API_BASE_URL}/api/v1/fleet/models`,
    VEHICLES: `${FLEET_API_BASE_URL}/api/v1/fleet/vehicles`,
  },

  // Booking endpoints
  BOOKING: {
    CREATE: `${API_BASE_URL}/api/v1/bookings`,
    DETAILS: (id: string) => `${API_BASE_URL}/api/v1/bookings/${id}`,
  },

  // Test endpoint
  TEST: `${API_BASE_URL}/test`,
} as const;

// Third-Party Service Configurations
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

// Environment Configuration
export const APP_ENV = import.meta.env.VITE_APP_ENV || "development";
export const IS_PRODUCTION = APP_ENV === "production";
export const IS_DEVELOPMENT = APP_ENV === "development";
export const DEBUG_ENABLED = import.meta.env.VITE_DEBUG === "true";

// API Client Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if using cookies for auth
} as const;

// Development Logging
if (IS_DEVELOPMENT && DEBUG_ENABLED) {
  console.log("API Configuration Loaded:", {
    API_BASE_URL,
    FLEET_API_BASE_URL,
    APP_ENV,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID ? "Set" : "Missing",
    MAPBOX_TOKEN: MAPBOX_TOKEN ? "Set" : "Missing",
  });
}

// Validation Function
export function validateApiConfig(): boolean {
  const isValid = missingVars.length === 0;

  if (!isValid && IS_PRODUCTION) {
    throw new Error(
      `Production deployment failed: Missing environment variables: ${missingVars.join(", ")}`,
    );
  }

  return isValid;
}
