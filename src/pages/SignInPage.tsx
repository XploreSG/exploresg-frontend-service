import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import SignInForm from "../components/Auth/SignInForm";
import type { SignInFormData } from "../components/Auth/SignInForm";
import SocialLoginButtons from "../components/Auth/SocialLoginButtons";
import type { UserInfo } from "../contexts/AuthContextInstance";
import { createSessionWithGoogle } from "../api/authService";
import type { AuthSessionResponse } from "../api/authService";
import { decodeJwtPayload } from "../utils/jwt";
import { isAxiosError } from "axios";

interface GoogleJwtPayload {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (data: SignInFormData) => {
    console.debug("Form submit (local)", data);
    const placeholderUser: UserInfo = {
      userId: 0,
      email: data.email,
      givenName: "Local",
      familyName: "User",
    };
    login(placeholderUser, null);
    navigate("/yourday");
  };

  const handleGoogleSuccess = async (idToken: string | undefined) => {
    console.debug("handleGoogleSuccess called, idToken present:", !!idToken);
    if (!idToken) {
      console.debug("handleGoogleSuccess: no idToken, aborting");
      return;
    }

    const decoded = decodeJwtPayload<GoogleJwtPayload>(idToken);
    const fallbackEmail = decoded?.email ?? undefined;

    setLoading(true);
    setError(null);

    try {
      console.debug("Creating session with backend using idToken (masked)");
      const masked = `${idToken.slice(0, 8)}... (len=${idToken.length})`;
      console.debug("idToken (masked):", masked);
      const session: AuthSessionResponse =
        await createSessionWithGoogle(idToken);
      console.debug("createSessionWithGoogle response:", session);
      login(session.user, session.tokenPair);
      console.debug("login succeeded, navigating to /yourday");
      navigate("/yourday");
    } catch (err: unknown) {
      console.warn("createSessionWithGoogle failed", err);
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 404 || status === 409) {
          navigate("/signup", { state: { idToken, email: fallbackEmail } });
          return;
        }
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to authenticate with Google";
        setError(message);
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
