import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { getUserRole } from "../utils/jwtUtils";
import SignInForm from "../components/Auth/SignInForm";
import type { SignInFormData } from "../components/Auth/SignInForm";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import type { UserInfo } from "../contexts/AuthContextInstance";
import { API_ENDPOINTS } from "../config/api";
import axios from "axios";

// Define the shape of the response from the backend
interface AuthResponse {
  token: string;
  requiresProfileSetup: boolean;
  userInfo: UserInfo;
}

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: SignInFormData) => {
    console.debug("Form submit (local)", data);
    login(
      { userId: 0, email: data.email, givenName: "Local", familyName: "User" },
      null,
    );
    navigate("/yourday");
  };

  const handleGoogleSuccess = async (idToken: string | undefined) => {
    if (!idToken) {
      setError("Failed to get Google ID token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<AuthResponse>(
        API_ENDPOINTS.AUTH.GOOGLE,
        {},
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );

      const { token, requiresProfileSetup, userInfo } = response.data;

      if (!token || !userInfo) {
        throw new Error("Did not receive complete auth data from the backend.");
      }

      login(userInfo, token);

      if (requiresProfileSetup) {
        // If the backend asks for profile setup, always send user to signup flow first
        navigate("/signup", { state: { user: userInfo } });
      } else {
        // Determine role from token and redirect role-specific users
        const rawRole = getUserRole(token);
        const role = rawRole
          ? String(rawRole).replace("ROLE_", "").toUpperCase()
          : null;

        if (role === "ADMIN") {
          navigate("/admin/console");
        } else if (
          ["FLEET_MANAGER", "FLEET_ADMIN", "MANAGER"].includes(role || "")
        ) {
          // Fleet-related users land on the manager dashboard
          navigate("/manager/dashboard");
        } else {
          navigate("/yourday");
        }
      }
    } catch (err: unknown) {
      console.error("Authentication failed:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to authenticate.");
      } else {
        setError("An unknown authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.warn("Google login failed");
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Form */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="">
            <h1 className="flex w-full justify-center pb-6 text-6xl font-light text-gray-900">
              <span className="pr-3 text-gray-500">Discover. </span>
              <span className="font-semibold text-red-600"> Explore</span>
            </h1>
            <p className="mt-2 flex w-full justify-center text-lg text-gray-600">
              Your premier guide to Singapore
            </p>
          </div>

          {/* Social Login */}
          <SocialLoginButtons
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleError={handleGoogleError}
          />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email Form */}
          <SignInForm onSubmit={handleFormSubmit} />

          {/* Error & Loading Feedback */}
          <div className="h-10">
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
                {error}
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg
                  className="h-5 w-5 animate-spin text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing in...</span>
              </div>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a
              href="/terms"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Panel - Video Background */}
      <div className="relative hidden h-screen w-1/2 overflow-hidden lg:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="/assets/exploresg-backdrop-jewel.jpg"
        >
          <source src="/assets/banner-video.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img
            src="/assets/exploresg-backdrop-jewel.jpg"
            alt="Jewel Changi Airport"
            className="h-full w-full object-cover"
          />
        </video>

        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Branding or tagline on video */}
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-light tracking-wide">Experience</h2>
          <h2 className="text-6xl font-bold">Singapore</h2>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
