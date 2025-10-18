// Shared interfaces for rental car data and components

// Backend response type for operator car model data
export interface OperatorCarModelData {
  operatorId: number | string; // Now supports both UUID (from backend) and numeric ID
  operatorName: string;
  carModelId: number;
  publicId?: string; // UUID from backend for API calls (legacy field)
  publicModelId?: string; // UUID from backend for API calls (current field name)
  model: string;
  manufacturer: string;
  seats: number;
  luggage: number;
  transmission: string;
  imageUrl: string;
  category: string;
  fuelType: string;
  modelYear: number;
  dailyPrice: number;
  availableVehicleCount: number;
}

// Operator styling configuration
export interface OperatorStyling {
  brand: string;
  background: string;
}

// Display type for UI components
export interface DisplayCarData {
  id: string; // Unique combination of operatorId-carModelId (for frontend use)
  carModelPublicId?: string; // Backend UUID for API calls
  operatorId: number;
  operatorName: string;
  model: string;
  manufacturer: string;
  seats: number;
  luggage: number;
  transmission: string;
  imageUrl: string;
  category: string;
  price: number;
  operator: string;
  operatorStyling: OperatorStyling;
  availableVehicleCount: number;
}

// Base car details interface for components
export interface BaseCarDetails {
  model: string;
  seats: number;
  luggage: number;
  transmission: "automatic" | "manual";
  imageUrl: string;
  operator: string;
  operatorStyling: OperatorStyling;
}

// Extended car details with pricing information
export interface CarDetailsWithPricing extends BaseCarDetails {
  price: number;
  originalPrice?: number;
  promoText?: string;
  carId?: string; // Frontend ID or backend publicId (UUID)
  carModelPublicId?: string; // Backend UUID for API calls
}

// Operator information
export interface OperatorInfo {
  id: number;
  name: string;
}

// Direct UUID to Operator configuration
// Maps backend UUIDs directly to operator names and styling
export const OPERATOR_CONFIG: Record<
  string,
  { name: string; id: number; styling: OperatorStyling }
> = {
  "28dac4bd-e11a-4240-9602-c23fa8d8c510": {
    name: "Sixt",
    id: 101,
    styling: {
      brand: "text-orange-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-orange-800/70",
    },
  },
  "92f04715-b828-4fc0-9013-81c3b468fcf1": {
    name: "Hertz",
    id: 102,
    styling: {
      brand: "text-yellow-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-yellow-900/60",
    },
  },
  "ca9fd637-1c01-4ff8-9245-a0d41c910475": {
    name: "Lylo",
    id: 103,
    styling: {
      brand: "text-blue-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-blue-900/80",
    },
  },
  "1c6a4a97-0608-41d4-b20d-e6cb023af975": {
    name: "Budget",
    id: 104,
    styling: {
      brand: "text-red-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-red-900/80",
    },
  },
  "ddb04738-d252-4dcb-8d69-ecab0aee8072": {
    name: "Avis",
    id: 105,
    styling: {
      brand: "text-indigo-600 bg-indigo-200",
      background: "bg-black bg-blend-overlay bg-indigo-900/80",
    },
  },
};

// Legacy: Operator configuration with names (kept for backward compatibility)
export const OPERATOR_NAMES: Record<number, string> = {
  101: "Sixt",
  102: "Hertz",
  103: "Lylo",
  104: "Budget",
  105: "Avis",
  106: "Enterprise",
};

export const OPERATOR_STYLES: Record<number, OperatorStyling> = {
  101: {
    brand: "text-orange-600 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-orange-800/70",
  },
  102: {
    brand: "text-yellow-600 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-yellow-900/60",
  },
  103: {
    brand: "text-blue-600 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-blue-900/80",
  },
  104: {
    brand: "text-red-600 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-red-900/80",
  },
  105: {
    brand: "text-indigo-600 bg-indigo-200",
    background: "bg-black bg-blend-overlay bg-indigo-900/80",
  },
  106: {
    brand: "text-teal-700 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-teal-900/80",
  },
};

// Utility function to get operator information from UUID or numeric ID
export function getOperatorInfo(
  operatorId: number | string,
  fallbackName?: string,
) {
  // If it's a UUID string, look it up in OPERATOR_CONFIG
  if (typeof operatorId === "string" && operatorId.includes("-")) {
    const config = OPERATOR_CONFIG[operatorId];
    if (config) {
      return {
        id: config.id,
        name: config.name,
        styling: config.styling,
      };
    }
  }

  // If it's a numeric ID, use legacy OPERATOR_NAMES and OPERATOR_STYLES
  const numericId =
    typeof operatorId === "number" ? operatorId : parseInt(operatorId);
  if (!isNaN(numericId)) {
    return {
      id: numericId,
      name: OPERATOR_NAMES[numericId] || fallbackName || String(operatorId),
      styling: OPERATOR_STYLES[numericId] || {
        brand: "text-blue-600 bg-gray-200",
        background: "bg-black bg-blend-overlay bg-blue-900/80",
      },
    };
  }

  // Fallback for unknown operators
  console.warn(`Unknown operator ID: ${operatorId}`);
  return {
    id: 0,
    name: fallbackName || String(operatorId),
    styling: {
      brand: "text-blue-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-blue-900/80",
    },
  };
}

// Utility function to get operator name from userId (for FLEET_MANAGER users)
export function getOperatorNameFromUserId(
  userId: string | undefined,
): string | null {
  if (!userId) return null;

  const config = OPERATOR_CONFIG[userId];
  return config ? config.name : null;
}

// Utility function to get full operator info (including styling) from userId
export function getOperatorInfoFromUserId(
  userId: string | undefined,
): { name: string; id: number; styling: OperatorStyling } | null {
  if (!userId) return null;

  const config = OPERATOR_CONFIG[userId];
  return config || null;
}

// Filter types
export interface FilterState {
  sortBy: string;
  vehicleType: string;
  transmission: string;
  minSeats: string;
  priceRange: [number, number];
  selectedOperator: string;
}

// Default filter state
export const DEFAULT_FILTER_STATE: FilterState = {
  sortBy: "price-low",
  vehicleType: "all",
  transmission: "all",
  minSeats: "all",
  priceRange: [0, 1000],
  selectedOperator: "all",
};

// Booking information interface
export interface BookingInfo {
  bookingRef: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  price: number;
  carDetails: BaseCarDetails;
}
