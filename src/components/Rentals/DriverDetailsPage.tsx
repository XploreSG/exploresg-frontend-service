import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/bookingContextCore";
import BookingProgress from "./BookingProgress";
import RentalCardSummary from "./RentalCardSummary";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";
import {
  getUserProfile,
  updateUserProfile,
  profileToDriverDetails,
  hasCompleteDriverDetails,
} from "../../services/userApi";

// Using types from BookingContext
import type { DriverDetails as DriverDetailsType } from "../../contexts/bookingContextCore";

const DriverDetailsPage: React.FC = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const {
    selectedCar,
    bookingDates,
    setDriverDetails: saveDriverDetails,
  } = useBooking();

  const [driverDetails, setDriverDetails] = useState<DriverDetailsType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    licenseCountry: "Singapore",
    address: "",
    city: "",
    postalCode: "",
    country: "Singapore",
    emergencyContactName: "",
    emergencyContactPhone: "",
    drivingExperience: "3+",
  });

  const [errors, setErrors] = useState<Partial<DriverDetailsType>>({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true); // Default to saving profile
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await getUserProfile();

        // Check if user has complete driver details
        if (hasCompleteDriverDetails(profile)) {
          // Pre-fill form with existing profile data
          const driverData = profileToDriverDetails(profile);
          setDriverDetails(driverData);
          setProfileMessage({
            type: "success",
            text: "Your saved information has been loaded. You can update it if needed.",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        // Continue with empty form - user might be booking for the first time
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (field: keyof DriverDetailsType, value: string) => {
    setDriverDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DriverDetailsType> = {};

    // Required field validation
    if (!driverDetails.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!driverDetails.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!driverDetails.email.trim()) newErrors.email = "Email is required";
    if (!driverDetails.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!driverDetails.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!driverDetails.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    if (!driverDetails.licenseExpiryDate)
      newErrors.licenseExpiryDate = "License expiry date is required";
    if (!driverDetails.address.trim())
      newErrors.address = "Address is required";
    if (!driverDetails.city.trim()) newErrors.city = "City is required";
    if (!driverDetails.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    // Email validation
    if (
      driverDetails.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverDetails.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation with specific formats
    if (driverDetails.phone) {
      const phone = driverDetails.phone.trim();

      // Singapore: +65 followed by 8 digits, or just 8 digits
      // Malaysia: +60 followed by 9-10 digits, or just 10-11 digits
      // International: + followed by country code and number
      const phonePatterns = [
        /^\+65[689]\d{7}$/, // Singapore mobile with country code
        /^[689]\d{7}$/, // Singapore mobile without country code
        /^\+60\d{9,10}$/, // Malaysia with country code
        /^0\d{9,10}$/, // Malaysia without country code (starts with 0)
        /^\+\d{1,3}\d{7,14}$/, // International format
        /^\d{8,15}$/, // General format (8-15 digits)
      ];

      const isValidPhone = phonePatterns.some((pattern) =>
        pattern.test(phone.replace(/[\s\-()]/g, "")),
      );

      if (!isValidPhone) {
        newErrors.phone =
          "Please enter a valid phone number (e.g., +65 9123 4567, 91234567, or +60 12 345 6789)";
      }
    }

    // Age validation (must be 21+)
    if (driverDetails.dateOfBirth) {
      const birthDate = new Date(driverDetails.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 21) {
        newErrors.dateOfBirth = "Driver must be at least 21 years old";
      }
    }

    // License expiry validation
    if (driverDetails.licenseExpiryDate) {
      const expiryDate = new Date(driverDetails.licenseExpiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.licenseExpiryDate =
          "License must be valid for at least 6 months";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Save driver details to BookingContext for this booking
      saveDriverDetails(driverDetails);

      // Save to user profile if checkbox is checked
      if (saveToProfile) {
        try {
          setIsSavingProfile(true);
          await updateUserProfile({
            firstName: driverDetails.firstName,
            lastName: driverDetails.lastName,
            phone: driverDetails.phone,
            dateOfBirth: driverDetails.dateOfBirth,
            drivingLicenseNumber: driverDetails.licenseNumber,
            licenseIssueDate: driverDetails.licenseIssueDate,
            licenseExpiryDate: driverDetails.licenseExpiryDate,
            licenseCountry: driverDetails.licenseCountry,
            address: driverDetails.address,
            city: driverDetails.city,
            postalCode: driverDetails.postalCode,
            country: driverDetails.country,
            emergencyContactName: driverDetails.emergencyContactName,
            emergencyContactPhone: driverDetails.emergencyContactPhone,
            drivingExperience: driverDetails.drivingExperience,
          });

          console.log("✅ Profile saved successfully for future bookings");
        } catch (error) {
          console.error("Failed to save profile:", error);
          // Don't block the flow - user can continue with booking
        } finally {
          setIsSavingProfile(false);
        }
      }

      // Navigate to review page
      navigate(`/booking/${carId}/review`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps - Step 3: Driver Details */}
      <BookingProgress currentStep={3} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Current Step Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 shadow-sm">
              <FaUser className="mr-3 h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-blue-700">
                Step 3: Enter driver information
              </span>
            </div>
          </div>

          {/* Full-Width Car Summary */}
          {selectedCar && bookingDates && (
            <div className="mb-8">
              <RentalCardSummary
                model={selectedCar.model}
                seats={selectedCar.seats}
                luggage={selectedCar.luggage}
                transmission={selectedCar.transmission}
                price={selectedCar.price}
                originalPrice={selectedCar.originalPrice}
                promoText={selectedCar.promoText}
                imageUrl={selectedCar.imageUrl}
                operator={selectedCar.operator}
                operatorStyling={selectedCar.operatorStyling}
                nights={bookingDates.nights}
                showPricing={true}
                className="mb-0"
              />
            </div>
          )}

          {/* Loading State */}
          {isLoadingProfile && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-700">
                  Loading your saved information...
                </p>
              </div>
            </div>
          )}

          {/* Profile Message Banner */}
          {profileMessage && (
            <div
              className={`mb-6 rounded-lg border p-4 ${
                profileMessage.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex items-start">
                <FaSave
                  className={`mt-0.5 mr-3 h-5 w-5 ${
                    profileMessage.type === "success"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    profileMessage.type === "success"
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {profileMessage.text}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center">
                <FaUser className="mr-3 h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={driverDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={driverDetails.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+65 9123 4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date of Birth * (Must be 21+)
                  </label>
                  <input
                    type="date"
                    value={driverDetails.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Driving Experience *
                  </label>
                  <select
                    value={driverDetails.drivingExperience}
                    onChange={(e) =>
                      handleInputChange("drivingExperience", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-2">1-2 years</option>
                    <option value="3+">3+ years</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    This affects your security deposit amount
                  </p>
                </div>
              </div>
            </div>

            {/* Driver License Information */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center">
                <FaIdCard className="mr-3 h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Driver License Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.licenseNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter license number"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    License Country *
                  </label>
                  <select
                    value={driverDetails.licenseCountry}
                    onChange={(e) =>
                      handleInputChange("licenseCountry", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="International">
                      International Driving Permit
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    License Issue Date *
                  </label>
                  <input
                    type="date"
                    value={driverDetails.licenseIssueDate}
                    onChange={(e) =>
                      handleInputChange("licenseIssueDate", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.licenseIssueDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.licenseIssueDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.licenseIssueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={driverDetails.licenseExpiryDate}
                    onChange={(e) =>
                      handleInputChange("licenseExpiryDate", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.licenseExpiryDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.licenseExpiryDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.licenseExpiryDate}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    License must be valid for at least 6 months from pickup date
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-3 h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Address Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter street address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={driverDetails.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    className={`w-full rounded-lg border px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter postal code"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <select
                    value={driverDetails.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center">
                <FaPhone className="mr-3 h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Emergency Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={driverDetails.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={driverDetails.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="+65 9123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Save Profile Option */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="saveProfile"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="saveProfile"
                    className="flex items-center font-semibold text-blue-900"
                  >
                    <FaSave className="mr-2 h-4 w-4" />
                    Save my information for future bookings
                  </label>
                  <p className="mt-1 text-sm text-blue-700">
                    Your information will be securely saved to your profile and
                    automatically filled in next time you book a vehicle. You
                    can update it anytime from your profile settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                  . I confirm that all information provided is accurate and
                  complete.
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/booking/${carId}/addons`)}
                className="flex-1 rounded-lg border border-gray-300 px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                disabled={isSavingProfile}
              >
                Back to Add-ons
              </button>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  "Continue to Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsPage;
