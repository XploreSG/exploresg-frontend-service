/**
 * Booking API Service
 * Handles all booking-related API calls including reservation and payment
 */

import { API_ENDPOINTS } from "../config/api";

// ==================== Types ====================

export interface CreateBookingRequest {
  publicModelId: string; // UUID from fleet API (matches fleet service naming)
  startDate: string; // ISO format: "2025-11-01T10:00:00Z" (no milliseconds)
  endDate: string; // ISO format: "2025-11-05T18:00:00Z" (no milliseconds)
  pickupLocation: string;
  returnLocation: string;
  driverDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    // NOTE: Backend does NOT expect dateOfBirth or licenseExpiryDate
  };
  // NOTE: Backend does NOT expect selectedAddOns or selectedCDW
}

export interface CreateBookingResponse {
  bookingId: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED";
  reservationExpiresAt: string; // ISO timestamp
  totalAmount: number;
  currency: string;
}

export interface ProcessPaymentRequest {
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "MOCK";
  cardDetails?: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardholderName?: string;
  };
}

export interface ProcessPaymentResponse {
  bookingId: string;
  status: "PENDING_CONFIRMATION" | "CONFIRMED" | "FAILED";
  paymentId: string;
  message: string;
}

export interface BookingDetailsResponse {
  bookingId: string;
  status: string;
  carModel: {
    publicId: string;
    model: string;
    manufacturer: string;
    imageUrl: string;
  };
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalAmount: number;
  currency: string;
  driverDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

// ==================== API Functions ====================

/**
 * Create a new booking and reserve the vehicle
 * This locks the vehicle for 30 seconds before payment
 */
export const createBooking = async (
  bookingData: CreateBookingRequest,
): Promise<CreateBookingResponse> => {
  const jwtToken = localStorage.getItem("token"); // Changed from "jwtToken" to "token"

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await fetch(API_ENDPOINTS.BOOKING.CREATE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw {
        status: response.status,
        data: errorData,
      };
    }

    return await response.json();
  } catch (error: unknown) {
    const apiError = error as { status?: number; data?: ApiError };
    if (apiError.status) {
      throw apiError; // Re-throw API errors with status
    }
    throw {
      status: 0,
      data: {
        error: "NETWORK_ERROR",
        message:
          "Unable to connect to server. Please check your internet connection.",
      },
    };
  }
};

/**
 * Process payment for an existing booking
 * Must be called within 30 seconds of booking creation
 */
export const processPayment = async (
  bookingId: string,
  paymentData: ProcessPaymentRequest,
): Promise<ProcessPaymentResponse> => {
  const jwtToken = localStorage.getItem("token"); // Changed from "jwtToken" to "token"

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.BOOKING.CREATE}/${bookingId}/pay`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      },
    );

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw {
        status: response.status,
        data: errorData,
      };
    }

    return await response.json();
  } catch (error: unknown) {
    const apiError = error as { status?: number; data?: ApiError };
    if (apiError.status) {
      throw apiError; // Re-throw API errors with status
    }
    throw {
      status: 0,
      data: {
        error: "NETWORK_ERROR",
        message:
          "Unable to connect to server. Please check your internet connection.",
      },
    };
  }
};

/**
 * Get booking details by ID
 */
export const getBookingDetails = async (
  bookingId: string,
): Promise<BookingDetailsResponse> => {
  const jwtToken = localStorage.getItem("token"); // Changed from "jwtToken" to "token"

  if (!jwtToken) {
    throw new Error("Authentication required. Please log in.");
  }

  try {
    const response = await fetch(API_ENDPOINTS.BOOKING.DETAILS(bookingId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw {
        status: response.status,
        data: errorData,
      };
    }

    return await response.json();
  } catch (error: unknown) {
    const apiError = error as { status?: number; data?: ApiError };
    if (apiError.status) {
      throw apiError;
    }
    throw {
      status: 0,
      data: {
        error: "NETWORK_ERROR",
        message:
          "Unable to connect to server. Please check your internet connection.",
      },
    };
  }
};

/**
 * Handle API errors with user-friendly messages
 */
export const handleBookingApiError = (
  error: unknown,
  navigate: (path: string) => void,
): string => {
  const apiError = error as { status?: number; data?: ApiError };
  if (apiError.status) {
    const { status, data } = apiError;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        navigate("/login");
        return "Session expired. Please log in again.";

      case 409:
        // No vehicles available
        return (
          data?.message ||
          "Sorry, this vehicle is no longer available. Please select another vehicle."
        );

      case 410:
        // Reservation expired
        return (
          data?.message || "Your reservation has expired. Please try again."
        );

      case 402:
        // Payment declined
        return (
          data?.message ||
          "Payment declined. Please try a different payment method."
        );

      case 400:
        // Bad request - validation errors
        if (data?.fieldErrors) {
          const fieldErrors = Object.entries(data.fieldErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(", ");
          return `Validation error: ${fieldErrors}`;
        }
        return data?.message || "Invalid request. Please check your details.";

      default:
        return (
          data?.message || "An unexpected error occurred. Please try again."
        );
    }
  }

  return "Unable to connect to server. Please check your internet connection.";
};
