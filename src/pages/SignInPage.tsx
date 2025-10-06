import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
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
        navigate("/signup", { state: { user: userInfo } });
      } else {
        navigate("/yourday");
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
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full items-center justify-center bg-white px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-6 text-5xl leading-tight font-light text-gray-900">
              Discover.
              <br />
              <span className="font-semibold">Explore.</span>
            </h1>
            <p className="text-lg text-gray-600">Your guide to Singapore</p>
          </div>

          {/* Social Login */}
          <div className="mb-6">
            <SocialLoginButtons
              onGoogleSuccess={handleGoogleSuccess}
              onGoogleError={handleGoogleError}
            />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">OR</span>
            </div>
          </div>

          {/* Email Form */}
          <SignInForm onSubmit={handleFormSubmit} />

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Signing in...
            </div>
          )}

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel - Video Background */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/4">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="inset-0 h-full w-full object-cover"
          poster="/assets/singapore-flyer-poster.jpg"
        >
          <source src="/assets/banner-video.mp4" type="video/mp4" />
          <source src="/assets/singapore-flyer-loop.webm" type="video/webm" />
          {/* Fallback image if video fails to load */}
          <img
            src="/assets/exploresg-backdrop-jewel.jpg"
            alt="Singapore Flyer"
            className="h-full w-full object-cover"
          />
        </video>

        {/* Subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10" />

        {/* Optional: Branding or tagline on video */}
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-3xl font-light">Experience</h2>
          <h2 className="text-5xl font-bold">Singapore</h2>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
