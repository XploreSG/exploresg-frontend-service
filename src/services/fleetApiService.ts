/**
 * Fleet API Service
 * Service layer for fetching fleet data from backend
 *
 * USAGE EXAMPLE:
 *
 * In EagleViewPage.tsx, replace the CAR_DATA import with:
 *
 * import { fetchFleetData } from "../services/fleetApiService";
 *
 * Then in the useEffect, replace:
 *   const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);
 *
 * With:
 *   const fleetData = await fetchFleetData();
 *   const simulator = new MockFleetSimulator(fleetData, undefined, 2000);
 */

import type { CarData } from "./mockFleetService";

/**
 * Backend API base URL
 * Update this to match your backend endpoint
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Fetch fleet vehicle data from backend
 * @returns Promise<CarData[]> Array of vehicle configuration data
 * @throws Error if the request fails
 */
export async function fetchFleetData(): Promise<CarData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fleet/vehicles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fleet data: ${response.statusText}`);
    }

    const data: CarData[] = await response.json();

    // Validate the data structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid fleet data: expected non-empty array");
    }

    return data;
  } catch (error) {
    console.error("Error fetching fleet data:", error);
    throw error;
  }
}

/**
 * Fetch real-time vehicle locations from backend
 * Use this if your backend provides real-time GPS data
 * @returns Promise<Vehicle[]> Array of vehicles with current locations
 */
export async function fetchVehicleLocations() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fleet/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle locations: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicle locations:", error);
    throw error;
  }
}

/**
 * Example backend data structure your API should return:
 *
 * GET /api/fleet/vehicles
 * Response:
 * [
 *   {
 *     "file": "bmw-2.png",
 *     "name": "BMW 2 Series",
 *     "model": "218i Gran Coupé",
 *     "numberPlate": "SGF1234A",
 *     "status": "Available"
 *   },
 *   ...
 * ]
 *
 * Status must be one of: "Available" | "In Use" | "Maintenance"
 */
