import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { APP_ENV, DEBUG_ENABLED } from "../config/api";
import { getUserRole } from "../utils/jwtUtils";

type CopyStatus = "idle" | "copying" | "copied" | "error";

export const RoleBanner: React.FC = () => {
  const { token, user } = useAuth();

  // compute role from token and memoize
  const role = useMemo(() => getUserRole(token), [token]);

  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyToken = async () => {
    if (!token) return;
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(token);
      setCopyStatus("copied");
    } catch (err) {
      console.error("Failed to copy token", err);
      setCopyStatus("error");
    } finally {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      // reset after 2s
      timeoutRef.current = window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const getButtonText = (s: CopyStatus) =>
    s === "copying"
      ? "📋 Copying..."
      : s === "copied"
        ? "✅ Copied!"
        : s === "error"
          ? "❌ Error"
          : "📋 Copy Token";

  const getButtonClass = (s: CopyStatus) => {
    const base =
      "flex-none rounded-full px-3.5 py-1 text-sm font-semibold text-white shadow-xs transition-colors";
    if (s === "copied") return `${base} bg-green-500/20 hover:bg-green-500/30`;
    if (s === "error") return `${base} bg-red-500/20 hover:bg-red-500/30`;
    return `${base} bg-white/10 hover:bg-white/15`;
  };

  // Only show debug banner in non-production when DEBUG_ENABLED is true, otherwise show only when token exists
  const showDebug = DEBUG_ENABLED || APP_ENV !== "production";
  if (!showDebug && !token) return null;

  const isUser = role?.toLowerCase() === "user";
  const bannerColor = isUser
    ? "bg-indigo-600/90 text-indigo-100"
    : "bg-red-600/90 text-red-100";

  return (
    <div
      className={`sticky top-0 z-40 isolate flex items-center gap-x-6 overflow-hidden ${bannerColor} px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5`}
      // expose banner height to CSS via a custom property so Navbar can sit below it
      style={{ "--role-banner-height": "3.5rem" } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6">
          <strong className="font-semibold">
            {showDebug ? `[${APP_ENV.toUpperCase()}] ` : "Current Role: "}
          </strong>
          {showDebug ? "JWT Debug Mode" : role || "Unknown"}
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r="1" cx="1" cy="1" />
          </svg>
          {showDebug ? (
            <>
              Token: {token ? `✅ Present` : "❌ Missing"} | Role:{" "}
              {role ? `🎭 ${role}` : "🔍 Not found"} | User:{" "}
              {user ? `👤 ${user.email || "Logged in"}` : "👤 Not logged in"}
            </>
          ) : (
            <>
              {isUser
                ? "You have standard user access to the platform"
                : "You have elevated access privileges"}
            </>
          )}
        </p>

        {token && (
          <button
            onClick={handleCopyToken}
            disabled={copyStatus === "copying"}
            className={getButtonClass(copyStatus)}
          >
            {getButtonText(copyStatus)}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleBanner;
