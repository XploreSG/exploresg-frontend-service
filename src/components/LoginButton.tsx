import React from "react";
import { useAuth } from "../hooks/useAuth";

const LoginButton: React.FC = () => {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        {/* Authentication Success Debug Info */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="mb-2 flex items-center">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            <span className="font-semibold text-green-800">
              ✅ Authentication Successful
            </span>
          </div>
          <div className="rounded bg-green-100 p-2 text-xs text-green-700">
            <div>OAuth Flow: Backend (8080) → Google → JWT Token</div>
            <div>Token Storage: localStorage</div>
            <div>User Data: Fetched via /api/v1/auth/me</div>
            <div>Session: Active</div>
          </div>
        </div>

        {/* User Information Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center space-x-4">
            {user.pictureUrl && (
              <img
                src={user.pictureUrl}
                alt={user.name}
                className="h-12 w-12 rounded-full"
              />
            )}
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Welcome, {user.name}!
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm font-medium text-blue-600">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-800 shadow-md transition duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
};

export default LoginButton;
