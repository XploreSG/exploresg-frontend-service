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
  userInfo: UserInfo; // This now contains the full user profile
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
      // Step 1: Exchange the Google token for our custom token and full user profile
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

      // Step 2: Set the FULL user object and token in the global AuthContext
      login(userInfo, token);

      // Step 3: Navigate to the correct page based on the backend's response
      if (requiresProfileSetup) {
        // Pass the full user info to the signup page for pre-filling
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
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="bg-zoom-animate absolute inset-0 -z-20 bg-cover bg-center brightness-90"
        style={{
          backgroundImage: "url('/assets/exploresg-backdrop-jewel.jpg')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-blue-300/10"
        aria-hidden="true"
      />

      {/* Foreground */}
      <div className="w-full max-w-md rounded-xl border border-white/30 bg-white/60 p-8 shadow-lg backdrop-blur-2xl">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-red-600">ExploreSG</h1>
          <h2 className="mt-4 mb-2 text-center text-xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <SignInForm onSubmit={handleFormSubmit} />

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-sm text-gray-400">Or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <div className="flex flex-col items-center gap-4">
          {loading && <div className="text-sm text-gray-600">Signing in…</div>}
          <SocialLoginButtons
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
