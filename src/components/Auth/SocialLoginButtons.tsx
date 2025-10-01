import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

type Props = {
  onGoogleSuccess: (credential: string | undefined) => void;
  onGoogleError?: () => void;
};

const SocialLoginButtons: React.FC<Props> = ({
  onGoogleSuccess,
  onGoogleError,
}) => {
  return (
    <div className="flex justify-center gap-4">
      <div className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-2">
        <GoogleLogin
          onSuccess={(credentialResponse: CredentialResponse) => {
            const idToken = credentialResponse?.credential;
            onGoogleSuccess(idToken ?? undefined);
          }}
          onError={() => {
            onGoogleError?.();
          }}
        />
      </div>

      <button
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:bg-gray-50"
        disabled
        aria-disabled
        title="GitHub login not implemented"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.853 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">GitHub</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
