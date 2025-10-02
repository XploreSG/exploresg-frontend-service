const base64UrlDecode = (segment: string): string => {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(padded);
  }

  if (typeof globalThis !== "undefined") {
    const maybeAtob = (globalThis as { atob?: (value: string) => string }).atob;
    if (maybeAtob) {
      return maybeAtob(padded);
    }
  }

  throw new Error("No base64 decoder is available in this environment");
};

export const decodeJwtPayload = <T>(token: string): T | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const decoded = base64UrlDecode(parts[1]);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn("Failed to decode JWT payload", error);
    return null;
  }
};
