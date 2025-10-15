import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { API_CONFIG, API_ENDPOINTS } from "../../config/api";
import axios from "axios"; // <-- Import axios

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
  const { user, token } = useAuth(); // <-- Get user and custom token from context

  // Pre-fill form data from the AuthContext or location.state as a fallback
  const [formData, setFormData] = useState<SignupDetails>({
    firstName: user?.givenName || location.state?.user?.givenName || "",
    lastName: user?.familyName || location.state?.user?.familyName || "",
    email: user?.email || location.state?.user?.email || "",
    phone: "",
    dateOfBirth: "",
    drivingLicenseNumber: "",
    passportNumber: "",
    preferredLanguage: "English",
    countryOfResidence: "Singapore",
    role: "USER",
  });

  const [errors, setErrors] = useState<Partial<SignupDetails>>({});

  // This effect ensures the form stays populated even after a page refresh
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.givenName || prev.firstName,
        lastName: user.familyName || prev.lastName,
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof SignupDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    // The custom token from our AuthContext is now the source of truth for authorization
    if (!token) {
      alert("Authentication token not found. Please sign in again.");
      navigate("/login");
      return;
    }

    const payload = {
      givenName: formData.firstName,
      familyName: formData.lastName,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      drivingLicenseNumber: formData.drivingLicenseNumber,
      passportNumber: formData.passportNumber || null,
      preferredLanguage: formData.preferredLanguage,
      countryOfResidence: formData.countryOfResidence,
      requestedRole: formData.role, // Backend expects 'requestedRole' on this DTO
    };

    try {
      // Submit the form using axios and the custom JWT
      await axios.post(API_ENDPOINTS.USER.SIGNUP, payload, {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`, // <-- Use the custom application token
        },
      });

      if (onSubmit) onSubmit(formData);
      navigate("/yourday"); // Navigate to the main dashboard on success
    } catch (err: unknown) {
      console.error("Signup failed:", err);
      if (axios.isAxiosError(err)) {
        const apiError =
          err.response?.data?.message || "An error occurred during signup.";
        alert(apiError);
        setErrors({ ...errors, email: apiError });
      } else {
        alert("A network error occurred during signup.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
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
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (from Google)
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          {/* Phone + DOB */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="e.g., +65 9123 4567"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
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

          {/* Role Selection - COMMENTED OUT: Users can only sign up as USER role.
              Fleet Managers and Admins must be authorized by backend. */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Sign up as *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                handleInputChange(
                  "role",
                  e.target.value as SignupDetails["role"],
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="USER">User</option>
              <option value="FLEET_MANAGER">Fleet Manager</option>
              <option value="MANAGER">Manager</option>
              <option value="SUPPORT">Support</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Complete Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
