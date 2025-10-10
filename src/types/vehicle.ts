// Shared vehicle types used across pages and components
export type { ApiFleetItem } from "../contexts/FleetContext";

export type VehicleRow = {
  id: string;
  licensePlate: string;
  status: string;
  model?: string;
  manufacturer?: string;
  currentLocation?: string;
  imageUrl?: string;
  mileageKm?: number;
  dailyPrice?: number;
  availableFrom?: string | null;
  availableUntil?: string | null;
  maintenanceNote?: string | null;
  expectedReturnDate?: string | null;
  hasActiveBooking?: boolean;
};
