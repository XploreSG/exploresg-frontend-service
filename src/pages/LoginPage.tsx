import React from "react";
import GoogleSSOButton from "../components/GoogleSSOButton";

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome to ExploreSG
          </h1>
          <p className="text-gray-600">
            Sign in to discover amazing places in Singapore
          </p>
        </div>

        {/* Google SSO Button */}
        <div className="space-y-6">
          <GoogleSSOButton size="lg" className="w-full" />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
