import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import SignInForm from "../components/Auth/SignInForm";
import type { SignInFormData } from "../components/Auth/SignInForm";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import type { UserInfo } from "../contexts/AuthContextInstance"; // type-only import
import axios from "axios";

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temporary email/password form handler (not used in Google SSO flow)
  const handleFormSubmit = (data: SignInFormData) => {
    console.debug("Form submit (local)", data);
    login(
      { userId: 0, email: data.email, givenName: "Local", familyName: "User" },
      null,
    );
    navigate("/yourday");
  };

  const handleGoogleSuccess = async (idToken: string | undefined) => {
    console.debug("Google ID Token:", idToken);
    if (!idToken) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Check if user exists
      const checkResp = await axios.get("http://localhost:8080/api/v1/check", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const exists = !!checkResp.data?.exists;
      const email = checkResp.data?.email;

      if (!exists) {
        // Redirect to signup page with Google token & email
        navigate("/signup", { state: { idToken, email } });
        return;
      }

      // 2. Fetch full user details from backend
      const meResp = await axios.get<UserInfo>(
        "http://localhost:8080/api/v1/me",
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );

      console.debug("User details from /me", meResp.data);

      // 3. Store user + token in context
      login(meResp.data, idToken);

      // 4. Navigate to dashboard
      navigate("/yourday");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to authenticate with Google",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown authentication error");
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
