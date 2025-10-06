import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { APP_ENV } from "../config/api";
import { getUserRole } from "../utils/jwtUtils";

export const RoleBanner = () => {
  const { token, user } = useAuth();
  const role = getUserRole(token);
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");

  // Debug logging
  const debugInfo = {
    hasToken: !!token,
    tokenLength: token?.length,
    hasUser: !!user,
    role,
    tokenStart: token?.substring(0, 20) + "...",
  };
  console.log("RoleBanner Debug:", debugInfo);

  const handleCopyToken = async () => {
    if (!token) return;

    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(token);
      setCopyStatus("copied");
      console.log("🔍 Full Token Debug Info:");
      console.log("Token:", token);
      console.log("User Object:", user);
      console.log("Decoded Role:", role);

      // Reset status after 2 seconds
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy token:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const getButtonText = () => {
    switch (copyStatus) {
      case "copying":
        return "📋 Copying...";
      case "copied":
        return "✅ Copied!";
      case "error":
        return "❌ Error";
      default:
        return "📋 Copy Token";
    }
  };

  const getButtonClass = () => {
    const baseClass =
      "flex-none rounded-full px-3.5 py-1 text-sm font-semibold text-white shadow-xs transition-colors";
    switch (copyStatus) {
      case "copied":
        return `${baseClass} bg-green-500/20 hover:bg-green-500/30`;
      case "error":
        return `${baseClass} bg-red-500/20 hover:bg-red-500/30`;
      default:
        return `${baseClass} bg-white/10 hover:bg-white/15`;
    }
  };

  // FOR TESTING - Always show banner to debug
  // Remove this section and uncomment below when ready for production
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-white px-6 py-2.5 text-red-500 shadow-2xl after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6">
          <strong className="font-semibold">
            [{APP_ENV.toUpperCase()}] 🔍 JWT Debug Mode
          </strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r="1" cx="1" cy="1" />
          </svg>
          {/* Token: {token ? `✅ Present (${token.length} chars)` : "❌ Missing"} | */}
          Token: {token ? `✅ Present` : "❌ Missing"} | Role:{" "}
          {role ? `🎭 ${role}` : "🔍 Not found"} | User:{" "}
          {user ? `👤 ${user.email || "Logged in"}` : "👤 Not logged in"}
        </p>
        {token && (
          <button
            onClick={handleCopyToken}
            disabled={copyStatus === "copying"}
            className={getButtonClass()}
            title="Copy JWT token to clipboard and log debug info"
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );

  // PRODUCTION CODE - Uncomment when ready
  /*
  // Don't show banner if user is not authenticated
  if (!token) {
    return null;
  }

  // For testing - show banner with fallback role if no role is found
  if (!role) {
    return (
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-yellow-600/90 text-yellow-100 px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm/6">
            <strong className="font-semibold">No Role Found</strong>
            <svg
              viewBox="0 0 2 2"
              aria-hidden="true"
              className="mx-2 inline size-0.5 fill-current"
            >
              <circle r="1" cx="1" cy="1" />
            </svg>
            Token detected but no role information available
          </p>
        </div>
      </div>
    );
  }
  */

  const isUser = role?.toLowerCase() === "user";

  const bannerStyles = isUser
    ? "bg-indigo-600/90 text-indigo-100"
    : "bg-red-600/90 text-red-100";

  const roleText = isUser ? "User" : role || "Unknown";

  return (
    <div
      className={`relative isolate flex items-center gap-x-6 overflow-hidden ${bannerStyles} px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5`}
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className={`aspect-[577/310] w-[36.0625rem] ${isUser ? "bg-gradient-to-r from-indigo-400/30 to-indigo-800/30" : "bg-gradient-to-r from-red-400/30 to-red-800/30"} opacity-60`}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className={`aspect-[577/310] w-[36.0625rem] ${isUser ? "bg-gradient-to-r from-indigo-400/30 to-indigo-800/30" : "bg-gradient-to-r from-red-400/30 to-red-800/30"} opacity-60`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6">
          <strong className="font-semibold">Current Role: {roleText}</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r="1" cx="1" cy="1" />
          </svg>
          {isUser
            ? "You have standard user access to the platform"
            : "You have elevated access privileges"}
        </p>
      </div>
    </div>
  );
};
