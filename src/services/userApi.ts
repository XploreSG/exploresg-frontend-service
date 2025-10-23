/**
 * User Profile API Service
 * Handles user profile operations including driver details
 *
 * Backend API Pattern:
 * - POST /api/v1/signup with empty body {} - Initial signup (minimal)
 * - POST /api/v1/signup with driver details - Update profile during booking
 * - GET /api/v1/user/profile - Fetch current user profile
 */

import { API_ENDPOINTS } from "../config/api";

// ==================== Types ====================

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  drivingLicenseNumber: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseCountry?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  drivingExperience?: string;
  passportNumber?: string;
  preferredLanguage?: string;
  countryOfResidence?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  drivingLicenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseCountry?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  drivingExperience?: string;
  passportNumber?: string;
  preferredLanguage?: string;
  countryOfResidence?: string;
}

export interface UserProfileResponse extends UserProfileData {
  userId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== API Functions ====================

/**
 * Get current user's profile
 */
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const jwtToken = localStorage.getItem("token"); // Changed from "jwtToken" to "token"

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      if (response.status === 404 || response.status === 500) {
        // Profile not found - this is expected for new users with minimal signup
        throw new Error("PROFILE_NOT_FOUND");
      }
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    // Don't log "profile not found" errors as they're expected for new users
    if (error instanceof Error && error.message !== "PROFILE_NOT_FOUND") {
      console.error("Error fetching user profile:", error);
    }
    throw error;
  }
};

/**
 * Update user profile with driver details
 * This is called during booking flow to save driver information
 * Uses the SIGNUP endpoint as per backend API design (PATCH-style updates)
 */
export const updateUserProfile = async (
  profileData: UpdateProfileRequest,
): Promise<UserProfileResponse> => {
  const jwtToken = localStorage.getItem("token"); // Changed from "jwtToken" to "token"

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    // Backend uses /signup endpoint for profile updates (PATCH-style)
    const response = await fetch(API_ENDPOINTS.USER.SIGNUP, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Check if user has completed their driver details
 * Returns true if all required fields are filled
 */
export const hasCompleteDriverDetails = (
  profile: Partial<UserProfileResponse>,
): boolean => {
  const requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "dateOfBirth",
    "drivingLicenseNumber",
    "licenseExpiryDate",
    "address",
    "city",
    "postalCode",
  ];

  return requiredFields.every(
    (field) => profile[field as keyof UserProfileResponse],
  );
};

/**
 * Convert user profile to driver details format for booking
 */
export const profileToDriverDetails = (
  profile: UserProfileResponse,
): {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseCountry: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  drivingExperience: string;
} => {
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    dateOfBirth: profile.dateOfBirth || "",
    licenseNumber: profile.drivingLicenseNumber || "",
    licenseIssueDate: profile.licenseIssueDate || "",
    licenseExpiryDate: profile.licenseExpiryDate || "",
    licenseCountry: profile.licenseCountry || "Singapore",
    address: profile.address || "",
    city: profile.city || "",
    postalCode: profile.postalCode || "",
    country: profile.country || "Singapore",
    emergencyContactName: profile.emergencyContactName || "",
    emergencyContactPhone: profile.emergencyContactPhone || "",
    drivingExperience: profile.drivingExperience || "3+",
  };
};
