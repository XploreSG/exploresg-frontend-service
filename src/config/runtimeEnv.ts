/**
 * Runtime Environment Configuration
 * Handles both runtime (Docker-injected window._env_) and build-time (Vite) environments.
 */

// Safe runtime environment accessor. Reads window._env_ injected at container start.
interface EnvWindow extends Window {
  _env_?: Record<string, string>;
}

/**
 * Low-level function to get runtime environment variable from window._env_
 */
export function getRuntimeEnv(key: string): string | undefined {
  if (typeof window !== "undefined") {
    const w = window as EnvWindow;
    return w._env_ && w._env_[key] ? w._env_[key] : undefined;
  }
  return undefined;
}

/**
 * Universal environment variable getter with fallback chain:
 * 1. Runtime-injected env (from window._env_)
 * 2. Build-time Vite env (from import.meta.env)
 * 3. Default fallback value
 *
 * @param key - Environment variable key (without VITE_ prefix)
 * @param fallback - Default value if not found in any source
 * @returns The resolved environment variable value
 */
export function getEnvVar(key: string, fallback = ""): string {
  // 1. Runtime-injected env (from window._env_)
  const runtimeValue = getRuntimeEnv(key);
  if (runtimeValue) return runtimeValue;

  // 2. Build-time Vite env (from import.meta.env)
  const viteKey = `VITE_${key}`;
  const viteValue = (import.meta.env as Record<string, string | undefined>)[
    viteKey
  ];
  if (viteValue) return viteValue;

  // 3. Default fallback
  return fallback;
}

/**
 * Legacy function - use getEnvVar() instead
 * @deprecated
 */
export function getGoogleClientId(): string {
  return getEnvVar("GOOGLE_CLIENT_ID");
}

/**
 * Get all resolved environment variables using the unified getEnvVar function
 */
export function getResolvedEnv() {
  const resolved = {
    API_BASE_URL: getEnvVar("API_BASE_URL"),
    FLEET_API_BASE_URL: getEnvVar("FLEET_API_BASE_URL"),
    GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
    MAPBOX_TOKEN: getEnvVar("MAPBOX_TOKEN"),
    APP_ENV: getEnvVar("APP_ENV"),
    DEBUG: getEnvVar("DEBUG"),
  };
  return resolved;
}
