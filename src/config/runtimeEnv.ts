// Safe runtime environment accessor. Reads window._env_ injected at container start.
interface EnvWindow extends Window {
  _env_?: Record<string, string>;
}

export function getRuntimeEnv(key: string): string | undefined {
  if (typeof window !== "undefined") {
    const w = window as EnvWindow;
    return w._env_ && w._env_[key] ? w._env_[key] : undefined;
  }
  return undefined;
}

export function getGoogleClientId(): string {
  // 1) Runtime-injected env
  const runtime = getRuntimeEnv("GOOGLE_CLIENT_ID");
  if (runtime) return runtime;

  // 2) Vite build-time fallback
  const vite = (import.meta.env as Record<string, string | undefined>)[
    "VITE_GOOGLE_CLIENT_ID"
  ];
  return vite ?? "";
}

export function getResolvedEnv() {
  const resolved = {
    API_BASE_URL:
      getRuntimeEnv("API_BASE_URL") ??
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
      "",
    FLEET_API_BASE_URL:
      getRuntimeEnv("FLEET_API_BASE_URL") ??
      (import.meta.env.VITE_FLEET_API_BASE_URL as string | undefined) ??
      "",
    GOOGLE_CLIENT_ID: getGoogleClientId(),
    MAPBOX_TOKEN:
      getRuntimeEnv("MAPBOX_TOKEN") ??
      (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ??
      "",
    APP_ENV:
      getRuntimeEnv("APP_ENV") ??
      (import.meta.env.VITE_APP_ENV as string | undefined) ??
      "",
    DEBUG:
      getRuntimeEnv("DEBUG") ??
      (import.meta.env.VITE_DEBUG as string | undefined) ??
      "",
  };
  return resolved;
}
