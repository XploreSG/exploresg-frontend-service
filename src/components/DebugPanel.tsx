import React from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

interface DebugInfo {
  timestamp: string;
  message: string;
  data?: Record<string, unknown>;
}

const DebugPanel: React.FC = () => {
  const { user, token, isLoading } = useAuth();
  const [debugLogs, setDebugLogs] = React.useState<DebugInfo[]>([]);

  const addDebugLog = React.useCallback(
    (message: string, data?: Record<string, unknown>) => {
      const newLog: DebugInfo = {
        timestamp: new Date().toLocaleTimeString(),
        message,
        data,
      };
      setDebugLogs((prev) => [newLog, ...prev].slice(0, 10)); // Keep only last 10 logs
    },
    [],
  );

  React.useEffect(() => {
    // Log auth state changes
    if (!isLoading) {
      if (token) {
        addDebugLog("✅ JWT Token found", { tokenLength: token.length });
      } else {
        addDebugLog("❌ No JWT Token found");
      }

      if (user) {
        addDebugLog("✅ User authenticated successfully", {
          userId: user.id,
          email: user.email,
          role: user.role,
        });
      } else if (token) {
        addDebugLog("⚠️ Token exists but no user data");
      }
    }
  }, [user, token, isLoading, addDebugLog]);

  React.useEffect(() => {
    // Check for URL token on mount
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      addDebugLog("🔄 OAuth redirect detected", {
        tokenReceived: true,
        tokenLength: urlToken.length,
      });
    }

    // Check localStorage token
    const storedToken = authService.getToken();
    if (storedToken) {
      addDebugLog("💾 Token found in localStorage", {
        tokenLength: storedToken.length,
      });
    }
  }, [addDebugLog]);

  if (debugLogs.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-4 max-w-md rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="mb-3 flex items-center font-semibold text-green-800">
        <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
        Debug Information
      </h3>

      <div className="max-h-40 space-y-2 overflow-y-auto">
        {debugLogs.map((log, index) => (
          <div
            key={index}
            className="rounded border border-green-300 bg-green-100 p-2 text-xs"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-green-700">{log.message}</span>
              <span className="text-xs text-green-600">{log.timestamp}</span>
            </div>

            {log.data && (
              <pre className="overflow-x-auto rounded bg-green-50 p-1 text-xs text-green-600">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setDebugLogs([])}
        className="mt-3 text-xs text-green-700 underline hover:text-green-900"
      >
        Clear Debug Logs
      </button>
    </div>
  );
};

export default DebugPanel;
