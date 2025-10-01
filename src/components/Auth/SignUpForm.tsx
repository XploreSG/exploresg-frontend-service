import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SignupDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  drivingLicenseNumber: string;
  passportNumber?: string;
  preferredLanguage: string;
  countryOfResidence: string;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  });

  const [errors, setErrors] = useState<Partial<SignupDetails>>({});

  useEffect(() => {
    if (googleEmail) {
      setFormData((prev) => ({ ...prev, email: googleEmail }));
    }
  }, [googleEmail]);

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

    const payload = {
      givenName: formData.firstName,
      familyName: formData.lastName,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      drivingLicenseNumber: formData.drivingLicenseNumber,
      passportNumber: formData.passportNumber,
      preferredLanguage: formData.preferredLanguage,
      countryOfResidence: formData.countryOfResidence,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(googleIdToken && { Authorization: `Bearer ${googleIdToken}` }),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/yourday");
      } else {
        const error = await response.json();
        alert(error.message || "Signup error.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error during signup.");
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
              Email (Google)
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Complete Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
