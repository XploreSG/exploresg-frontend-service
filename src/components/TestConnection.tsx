import React, { useState } from "react";
import { authService } from "../services/authService";

const TestConnection: React.FC = () => {
  const [health, setHealth] = useState<{
    status: string;
    timestamp?: string;
    [key: string]: unknown;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const healthData = await authService.checkHealth();
      setHealth(healthData);
      console.log("Backend connected:", healthData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Backend connection failed";
      setError(errorMessage);
      console.error("Backend connection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Backend Connection Test
      </h3>

      <button
        onClick={testConnection}
        disabled={isLoading}
        className="mb-4 w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? "Testing..." : "Test Backend Connection"}
      </button>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p className="font-semibold">Connection Failed:</p>
          <p>{error}</p>
        </div>
      )}

      {health && (
        <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          <p className="mb-2 flex items-center font-semibold">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            ✅ Backend Connected Successfully
          </p>
          <div className="mb-2 rounded bg-green-50 p-2">
            <div className="mb-1 text-xs text-green-600">
              Backend URL: http://localhost:8080
            </div>
            <div className="mb-1 text-xs text-green-600">
              Endpoint: /api/v1/auth/health
            </div>
            <div className="text-xs text-green-600">
              Response Time: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <pre className="overflow-auto rounded bg-green-50 p-2 text-sm">
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
