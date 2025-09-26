import React, { useState } from "react";
import GoogleSSOButton from "./GoogleSSOButton";

const GoogleSSOExamples: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState({
    basic: false,
    custom: false,
  });

  const handleGoogleSignIn = (type: string) => {
    console.log(`Starting Google OAuth for ${type}...`);
    setLoadingStates((prev) => ({ ...prev, [type]: true }));

    // Simulate loading state for demo
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [type]: false }));
      window.location.href = "http://localhost:8080/api/v1/auth/login";
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Google SSO Button Examples
        </h1>
        <p className="text-gray-600">
          Different sizes, variants, and usage patterns
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Basic Usage</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Default Button
            </h3>
            <GoogleSSOButton />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              With Custom Click Handler
            </h3>
            <GoogleSSOButton
              onClick={() => handleGoogleSignIn("custom")}
              loading={loadingStates.custom}
            />
          </div>
        </div>
      </section>

      {/* Different Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Different Sizes</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Small</h3>
            <GoogleSSOButton size="sm" />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Medium (Default)
            </h3>
            <GoogleSSOButton size="md" />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Large</h3>
            <GoogleSSOButton size="lg" />
          </div>
        </div>
      </section>

      {/* Different Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Different Variants
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Filled (Default)
            </h3>
            <GoogleSSOButton variant="filled" />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Outlined</h3>
            <GoogleSSOButton variant="outlined" />
          </div>
        </div>
      </section>

      {/* Full Width Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Full Width Examples
        </h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Large Full Width
            </h3>
            <GoogleSSOButton size="lg" className="w-full" />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Medium Full Width
            </h3>
            <GoogleSSOButton size="md" className="w-full" />
          </div>
        </div>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Different States
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Normal</h3>
            <GoogleSSOButton />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Loading</h3>
            <GoogleSSOButton loading={true} />
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Disabled</h3>
            <GoogleSSOButton disabled={true} />
          </div>
        </div>
      </section>

      {/* Integration Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Login Page Integration
        </h2>
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Welcome to ExploreSG
              </h3>
              <p className="text-gray-600">
                Sign in to discover amazing places
              </p>
            </div>
            <GoogleSSOButton size="lg" className="w-full" />
            <div className="mt-4 text-center text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoogleSSOExamples;
