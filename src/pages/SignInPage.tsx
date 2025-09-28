import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import SignInForm from "../components/Auth/SignInForm";
import type { SignInFormData } from "../components/Auth/SignInForm";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import axios from "axios";

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (data: SignInFormData) => {
    // Placeholder: replace with real auth call
    console.debug("Form submit", data);
    login(data.email, undefined);
    navigate("/yourday");
  };

  const handleGoogleSuccess = (idToken: string | undefined) => {
    console.debug("Google ID Token:", idToken);
    if (!idToken) {
      console.warn("No ID token received from Google");
      return;
    }

    // POST the ID token to backend for verification / session creation
    setLoading(true);
    setError(null);

    axios
      .post(
        "http://localhost:8080/api/auth/log-token",
        // no body needed, token sent in Authorization header
        null,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          // include credentials only when your backend uses cookies/sessions
          // withCredentials: true,
        },
      )
      .then((resp) => {
        // assume backend returns user info or success
        console.debug("Backend response", resp.data);
        // update client auth state with the idToken (or backend token if provided)
        const serverToken = resp.data?.token || idToken;
        login(resp.data?.user || "google-user", serverToken);
        navigate("/yourday");
      })
      .catch((err) => {
        console.error("Failed to send token to backend", err?.response || err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to authenticate",
        );
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleError = () => {
    console.warn("Google login failed");
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* Animated background image (no blur) */}
      <div
        className="bg-zoom-animate absolute inset-0 -z-20 bg-cover bg-center brightness-90 transition-all duration-1000"
        style={{
          backgroundImage: "url('/assets/exploresg-backdrop-jewel.jpg')",
        }}
        aria-hidden="true"
      />
      {/* Glass-like blue overlay */}
      <div
        className="absolute inset-0 -z-10 bg-blue-300/10"
        aria-hidden="true"
      />

      {/* Foreground: Glassmorphic Sign-in form */}
      <div className="w-full max-w-md rounded-xl border border-white/30 bg-white/60 p-8 shadow-lg backdrop-blur-2xl">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-red-600">ExploreSG</h1>
          <h2 className="mt-4 mb-2 text-center text-xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mb-8 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-medium text-[#6366f1] hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Start a 14-day free trial
            </a>
          </p>
        </div>

        <SignInForm onSubmit={handleFormSubmit} />

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
