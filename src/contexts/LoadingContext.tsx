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
  // timer for delaying the show so very-fast loads don't flash the overlay
  const showDelayRef = useRef<number | null>(null);
  // safety timeout to avoid stuck loader
  const safetyTimeoutRef = useRef<number | null>(null);
  const SHOW_DELAY = 120; // ms — don't show loader unless loading lasts longer than this

  const show = useCallback(() => {
    // clear any pending safety timeout
    if (safetyTimeoutRef.current) {
      window.clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    // if already scheduled to show or already showing, noop
    if (showDelayRef.current || isLoading) return;

    // delay showing the overlay so very-short loads don't flash it
    showDelayRef.current = window.setTimeout(() => {
      setIsLoading(true);
      showDelayRef.current = null;
    }, SHOW_DELAY) as unknown as number;
  }, [isLoading]);

  const hide = useCallback(() => {
    // if a show is scheduled but hasn't fired yet, cancel it and never show
    if (showDelayRef.current) {
      window.clearTimeout(showDelayRef.current);
      showDelayRef.current = null;
      return;
    }

    // hide immediately when requested
    setIsLoading(false);
  }, []);

  // safety: don't stay loading forever
  useEffect(() => {
    if (!isLoading) return;
    // safety: don't stay loading forever
    const id = window.setTimeout(() => setIsLoading(false), 5000);
    safetyTimeoutRef.current = id as unknown as number;
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
          // use delayed show — this will avoid flashing the loader for fast navigations
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
