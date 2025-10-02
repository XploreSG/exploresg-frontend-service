import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../../contexts/useAuth";
import { createSessionWithGoogle } from "../../api/authService";
import { API_BASE_URL } from "../../api/config";

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
  const location = useLocation();
  const { login } = useAuth();

  const googleIdToken: string | undefined = location.state?.idToken;
  const googleEmail: string | undefined = location.state?.email;

  const [formData, setFormData] = useState<SignupDetails>({
    firstName: "",
    lastName: "",
    email: googleEmail || "",
    phone: "",
    dateOfBirth: "",
    drivingLicenseNumber: "",
    passportNumber: "",
    preferredLanguage: "English",
    countryOfResidence: "Singapore",
    role: "USER",
  });

  const [errors, setErrors] = useState<Partial<SignupDetails>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (googleEmail) {
      setFormData((prev) => ({ ...prev, email: googleEmail }));
    }
  }, [googleEmail]);

  const capitalize = (value: string): string => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const toUpperAlphanumeric = (value: string): string => {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  };

  const handleInputChange = (field: keyof SignupDetails, value: string) => {
    let sanitizedValue = value;

    if (field === "firstName" || field === "lastName") {
      sanitizedValue = capitalize(value.trim());
    }

    if (field === "drivingLicenseNumber" || field === "passportNumber") {
      sanitizedValue = toUpperAlphanumeric(value);
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupDetails> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.drivingLicenseNumber.trim())
      newErrors.drivingLicenseNumber = "Driving license number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitError(null);
    setSubmitting(true);

    const payload = {
      givenName: formData.firstName,
      familyName: formData.lastName,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      drivingLicenseNumber: formData.drivingLicenseNumber,
      passportNumber: formData.passportNumber,
      preferredLanguage: formData.preferredLanguage,
      countryOfResidence: formData.countryOfResidence,
      role: formData.role,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(googleIdToken && { Authorization: `Bearer ${googleIdToken}` }),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Signup error.");
      }

      if (googleIdToken) {
        try {
          const session = await createSessionWithGoogle(googleIdToken);
          login(session.user, session.tokenPair);
        } catch (sessionError) {
          if (isAxiosError(sessionError)) {
            console.warn("Signup succeeded but session creation failed", sessionError);
          } else {
            console.warn("Signup succeeded but encountered an error", sessionError);
          }
        }
      }

      if (onSubmit) onSubmit(formData);
      navigate("/yourday");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Signup error.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 py-12">
      <div className="w-full max-w-4xl rounded-xl bg-white p-10 shadow-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-gray-500">
            Help us tailor the ExploreSG experience to your preferences.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Personal */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>

          {/* License + Passport */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Driving License Number *
              </label>
              <input
                type="text"
                value={formData.drivingLicenseNumber}
                onChange={(e) =>
                  handleInputChange("drivingLicenseNumber", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
                required
              />
              {errors.drivingLicenseNumber && (
                <p className="text-sm text-red-500">
                  {errors.drivingLicenseNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passport Number (Optional)
              </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) =>
                  handleInputChange("passportNumber", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          </div>

          {/* Preferred Language + Country */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) =>
                  handleInputChange("preferredLanguage", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="English">English</option>
                <option value="Chinese">Chinese</option>
                <option value="Malay">Malay</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country of Residence
              </label>
              <select
                value={formData.countryOfResidence}
                onChange={(e) =>
                  handleInputChange("countryOfResidence", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              required
            >
              <option value="USER">User</option>
              <option value="SUPPORT">Support</option>
              <option value="ADMIN">Admin</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Complete Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
