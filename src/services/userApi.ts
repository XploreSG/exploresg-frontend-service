/**
 * User Profile API Service
 * Handles user profile operations including driver details
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
  const jwtToken = localStorage.getItem("jwtToken");

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
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Update user profile with driver details
 * This is called during booking flow to save driver information
 */
export const updateUserProfile = async (
  profileData: UpdateProfileRequest,
): Promise<UserProfileResponse> => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
      method: "PUT",
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
