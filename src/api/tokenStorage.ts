export interface TokenPair {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

type Listener = (tokenPair: TokenPair | null) => void;

const STORAGE_KEY = "exploresg.tokenPair";
const isBrowser = typeof window !== "undefined";
let cachedTokenPair: TokenPair | null = null;
const listeners = new Set<Listener>();

const safeParse = (value: string | null): TokenPair | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as TokenPair;
  } catch (error) {
    console.warn("Failed to parse stored TokenPair", error);
    return null;
  }
};

const notify = (tokenPair: TokenPair | null) => {
  listeners.forEach((listener) => listener(tokenPair));
};

const loadFromStorage = (): TokenPair | null => {
  if (!isBrowser) return null;
  if (cachedTokenPair) return cachedTokenPair;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  cachedTokenPair = safeParse(stored);
  return cachedTokenPair;
};

const persistToStorage = (tokenPair: TokenPair | null) => {
  if (!isBrowser) return;
  if (!tokenPair) {
    sessionStorage.removeItem(STORAGE_KEY);
    cachedTokenPair = null;
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokenPair));
    cachedTokenPair = tokenPair;
  }
  notify(tokenPair);
};

const isExpired = (isoTimestamp: string, skewSeconds = 30): boolean => {
  const expiry = Date.parse(isoTimestamp);
  if (Number.isNaN(expiry)) return true;
  const now = Date.now();
  return now >= expiry - skewSeconds * 1000;
};

export const tokenStorage = {
  get: (): TokenPair | null => loadFromStorage(),
  set: (tokenPair: TokenPair) => persistToStorage(tokenPair),
  clear: () => persistToStorage(null),
  updateAccessToken(accessToken: string, accessTokenExpiresAt: string) {
    const existing = loadFromStorage();
    if (!existing) return;
    persistToStorage({ ...existing, accessToken, accessTokenExpiresAt });
  },
  isAccessTokenExpired(): boolean {
    const pair = loadFromStorage();
    if (!pair) return true;
    return isExpired(pair.accessTokenExpiresAt);
  },
  isRefreshTokenExpired(): boolean {
    const pair = loadFromStorage();
    if (!pair) return true;
    return isExpired(pair.refreshTokenExpiresAt, 0);
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
