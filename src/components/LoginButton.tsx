import React from "react";
import { useAuth } from "../hooks/useAuth";
import GoogleSSOButton from "./GoogleSSOButton";

const LoginButton: React.FC = () => {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <GoogleSSOButton loading={true} className="w-full" size="lg" />
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

  return <GoogleSSOButton onClick={login} className="w-full" size="lg" />;
};

export default LoginButton;
