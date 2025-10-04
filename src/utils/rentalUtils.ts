// Utility functions for rental car operations

import type { DisplayCarData, OperatorCarModelData } from "../types/rental";
import { getOperatorInfo } from "../types/rental";

/**
 * Transforms backend car model data into display format for UI components
 */
export function transformCarModelData(
  data: OperatorCarModelData[],
): DisplayCarData[] {
  return data.map((item) => {
    const op = getOperatorInfo(item.operatorId, item.operatorName);
    return {
      id: `${item.operatorId}-${item.carModelId}`,
      operatorId: item.operatorId,
      operatorName: item.operatorName,
      model: item.model,
      manufacturer: item.manufacturer,
      seats: item.seats,
      luggage: item.luggage,
      transmission: item.transmission,
      imageUrl: item.imageUrl,
      category: item.category,
      price: Number(item.dailyPrice),
      operator: op.name,
      operatorStyling: op.styling,
      availableVehicleCount: item.availableVehicleCount,
    };
  });
}

/**
 * Sorts car data based on the specified criteria
 */
export function sortCarData(
  cars: DisplayCarData[],
  sortBy: string,
): DisplayCarData[] {
  const sorted = [...cars];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-az":
      return sorted.sort((a, b) => a.model.localeCompare(b.model));
    case "name-za":
      return sorted.sort((a, b) => b.model.localeCompare(a.model));
    case "seats-high":
      return sorted.sort((a, b) => b.seats - a.seats);
    case "seats-low":
      return sorted.sort((a, b) => a.seats - b.seats);
    default:
      return sorted;
  }
}

/**
 * Filters car data based on the provided criteria
 */
export function filterCarData(
  cars: DisplayCarData[],
  filters: {
    priceRange: [number, number];
    vehicleType: string;
    minSeats: string;
    transmission: string;
    selectedOperator: string;
  },
): DisplayCarData[] {
  let filtered = [...cars];

  // Filter by price range
  filtered = filtered.filter(
    (car) =>
      car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1],
  );

  // Filter by vehicle type/category
  if (filters.vehicleType !== "all") {
    filtered = filtered.filter((car) => car.category === filters.vehicleType);
  }

  // Filter by minimum seats
  if (filters.minSeats !== "all") {
    filtered = filtered.filter(
      (car) => car.seats >= parseInt(filters.minSeats),
    );
  }

  // Filter by transmission
  if (filters.transmission !== "all") {
    filtered = filtered.filter(
      (car) => car.transmission === filters.transmission,
    );
  }

  // Filter by operator
  if (filters.selectedOperator !== "all") {
    filtered = filtered.filter(
      (car) => car.operatorId === parseInt(filters.selectedOperator),
    );
  }

  return filtered;
}

/**
 * Gets unique categories from car data
 */
export function getUniqueCategories(cars: DisplayCarData[]): string[] {
  const categories = [...new Set(cars.map((car) => car.category))];
  return categories.sort();
}

/**
 * Gets unique seat counts from car data
 */
export function getUniqueSeats(cars: DisplayCarData[]): number[] {
  const seats = [...new Set(cars.map((car) => car.seats))];
  return seats.sort((a, b) => a - b);
}

/**
 * Formats category name for display
 */
export function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts API transmission format to component format
 */
export function normalizeTransmission(
  transmission: string,
): "automatic" | "manual" {
  return transmission.toLowerCase() === "automatic" ? "automatic" : "manual";
}

/**
 * Formats a booking time and location for display
 */
export function formatBookingTimeLocation(
  time: string,
  location: string,
): string {
  return `${time} @ ${location}`;
}

/**
 * Formats a price for display with currency
 */
export function formatPrice(price: number, currency: string = "S$"): string {
  return `${currency}${price}`;
}

/**
 * Formats a booking reference for display
 */
export function formatBookingRef(ref: string): string {
  return ref.startsWith("#") ? ref : `#${ref}`;
}
