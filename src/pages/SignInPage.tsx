import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { getUserRole } from "../utils/jwtUtils";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import InlineLogoLoader from "../components/InlineLogoLoader";
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
      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="">
            <h1
              className="flex w-full justify-center pb-4 font-light text-gray-900 sm:pb-6"
              style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}
            >
              <span className="pr-2 text-gray-500 sm:pr-3">Discover. </span>
              <span className="font-semibold text-red-600"> Explore</span>
            </h1>
            <p
              className="mt-2 flex w-full justify-center text-gray-600"
              style={{ fontSize: "clamp(0.9375rem, 2vw, 1.125rem)" }}
            >
              Your premier guide to Singapore
            </p>
          </div>

          {/* Social Login */}
          <SocialLoginButtons
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleError={handleGoogleError}
          />

          {/* Error & Loading Feedback */}
          <div className="min-h-[2.5rem]">
            {error && (
              <div
                className="rounded-md border border-red-300 bg-red-50 p-2.5 text-center text-red-700 sm:p-3"
                style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)" }}
              >
                {error}
              </div>
            )}
            {loading && (
              <div
                className="flex items-center justify-center space-x-2 text-gray-600"
                style={{ fontSize: "clamp(0.8125rem, 1.5vw, 0.875rem)" }}
              >
                <InlineLogoLoader size={20} />
                <span>Signing in...</span>
              </div>
            )}
          </div>

          {/* Footer Text */}
          <p
            className="text-center text-gray-500"
            style={{ fontSize: "clamp(0.6875rem, 1.5vw, 0.75rem)" }}
          >
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
        <div className="absolute bottom-6 left-6 text-white sm:bottom-10 sm:left-10">
          <h2
            className="font-light tracking-wide"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            Experience
          </h2>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
          >
            Singapore
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
