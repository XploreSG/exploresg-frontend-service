import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { API_CONFIG, API_ENDPOINTS } from "../../config/api";
import axios from "axios";

export interface SignupDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  drivingLicenseNumber: string;
  passportNumber?: string;
  preferredLanguage: string;
  countryOfResidence: string;
  role: "USER" | "SUPPORT" | "ADMIN" | "FLEET_MANAGER" | "MANAGER";
}

interface SignUpFormProps {
  onSubmit?: (data: SignupDetails) => void;
}

const SignupForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Minimal form data - only for callback compatibility
  const formData: SignupDetails = {
    firstName: user?.givenName || "",
    lastName: user?.familyName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    drivingLicenseNumber: "",
    passportNumber: "",
    preferredLanguage: "English",
    countryOfResidence: "Singapore",
    role: "USER",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!token) {
      setError("Authentication token not found. Please sign in again.");
      navigate("/login");
      return;
    }

    // ✨ Minimal signup: Send empty body to backend
    // Backend will create user profile from JWT (email from Google OAuth)
    // Driver details will be collected later during booking flow
    const payload = {};

    try {
      await axios.post(API_ENDPOINTS.USER.SIGNUP, payload, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (onSubmit) onSubmit(formData);
      navigate("/yourday");
    } catch (err: unknown) {
      console.error("Signup failed:", err);
      if (axios.isAxiosError(err)) {
        const apiError =
          err.response?.data?.message || "An error occurred during signup.";
        setError(apiError);
      } else {
        setError("A network error occurred during signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome to ExploreSG!
          </h1>
          <p className="text-gray-600">
            You're signed in as{" "}
            <span className="font-semibold text-blue-600">
              {user?.email || "user"}
            </span>
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            🎉 Your account is almost ready! Click below to complete your signup
            and start exploring amazing rental cars in Singapore.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Note: Additional details like driver license will be collected when
            you make your first booking.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting up your account...
              </span>
            ) : (
              "Complete Signup & Start Exploring"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          By completing signup, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
