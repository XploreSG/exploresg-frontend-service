import React, {
  createContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import type { ReactNode } from "react";

type LoadingContextValue = {
  show: () => void;
  hide: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextValue>({
  show: () => {},
  hide: () => {},
  isLoading: false,
});

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const minVisibleRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const show = useCallback(() => {
    if (safetyTimeoutRef.current) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    // ensure minimum visible duration when hiding
    minVisibleRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    const min = 250; // ms
    const shownAt = minVisibleRef.current ?? 0;
    const elapsed = Date.now() - shownAt;
    if (elapsed < min) {
      // delay hide so animation is visible
      const remaining = min - elapsed;
      safetyTimeoutRef.current = window.setTimeout(
        () => setIsLoading(false),
        remaining,
      ) as unknown as number;
    } else {
      setIsLoading(false);
    }
  }, []);

  // safety: don't stay loading forever
  useEffect(() => {
    if (!isLoading) return;
    const id = window.setTimeout(() => setIsLoading(false), 5000);
    return () => window.clearTimeout(id);
  }, [isLoading]);

  // Capture internal link clicks to show loader when the user navigates via anchors/links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // ignore external links and anchors with full URL to other origin
      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          show();
        }
      } catch {
        // malformed URL — ignore
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [show]);

  return (
    <LoadingContext.Provider value={{ show, hide, isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
