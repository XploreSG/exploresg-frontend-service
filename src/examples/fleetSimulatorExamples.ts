/**
 * Example: Different ways to initialize the Fleet Simulator
 *
 * This file shows various patterns for using the MockFleetSimulator
 * with different data sources.
 */

import MockFleetSimulator, { type CarData } from "../services/mockFleetService";
import { CAR_DATA } from "../data/fleetData";
import { fetchFleetData } from "../services/fleetApiService";

// =============================================================================
// EXAMPLE 1: Using static mock data (current default)
// =============================================================================

export function initializeWithMockData() {
  const simulator = new MockFleetSimulator(
    CAR_DATA, // Use imported mock data
    undefined, // Use all vehicles in CAR_DATA
    2000, // Update every 2 seconds
  );

  simulator.start();
  return simulator;
}

// =============================================================================
// EXAMPLE 2: Using custom inline data
// =============================================================================

export function initializeWithCustomData() {
  const customFleet: CarData[] = [
    {
      file: "custom-car-1.png",
      name: "Tesla Model 3",
      model: "Long Range",
      numberPlate: "SGTESLA1",
      status: "Available",
    },
    {
      file: "custom-car-2.png",
      name: "Tesla Model Y",
      model: "Performance",
      numberPlate: "SGTESLA2",
      status: "In Use",
    },
  ];

  const simulator = new MockFleetSimulator(customFleet);
  simulator.start();
  return simulator;
}

// =============================================================================
// EXAMPLE 3: Fetching data from backend API
// =============================================================================

export async function initializeWithBackendData() {
  try {
    // Fetch fleet data from your backend
    const fleetData = await fetchFleetData();

    const simulator = new MockFleetSimulator(
      fleetData, // Use data from backend
      undefined, // Use all vehicles from backend
      2000,
    );

    simulator.start();
    return simulator;
  } catch (error) {
    console.error("Failed to fetch fleet data:", error);
    throw error;
  }
}

// =============================================================================
// EXAMPLE 4: Using a subset of vehicles
// =============================================================================

export function initializeWithSubset() {
  // Only simulate 5 vehicles even though CAR_DATA has 16
  const simulator = new MockFleetSimulator(
    CAR_DATA,
    5, // Only use first 5 vehicles
    2000,
  );

  simulator.start();
  return simulator;
}

// =============================================================================
// EXAMPLE 5: Faster update rate
// =============================================================================

export function initializeWithFastUpdates() {
  const simulator = new MockFleetSimulator(
    CAR_DATA,
    undefined,
    500, // Update every 500ms (faster movement)
  );

  simulator.start();
  return simulator;
}

// =============================================================================
// EXAMPLE 6: Complete integration with React component
// =============================================================================

/**
 * Example of how to use in a React component
 *
 * import { useEffect, useState } from "react";
 * import { type Vehicle } from "../services/mockFleetService";
 *
 * export function FleetComponent() {
 *   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
 *
 *   useEffect(() => {
 *     // Initialize with backend data
 *     const initSimulator = async () => {
 *       try {
 *         const simulator = await initializeWithBackendData();
 *
 *         const unsubscribe = simulator.subscribe((vehicleData) => {
 *           setVehicles(vehicleData);
 *         });
 *
 *         return () => {
 *           unsubscribe();
 *           simulator.stop();
 *         };
 *       } catch (error) {
 *         console.error("Failed to initialize:", error);
 *       }
 *     };
 *
 *     initSimulator();
 *   }, []);
 *
 *   return (
 *     <div>
 *       <h2>Active Vehicles: {vehicles.length}</h2>
 *       {vehicles.map(v => (
 *         <div key={v.id}>{v.numberPlate} - {v.status}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */

// =============================================================================
// EXAMPLE 7: Dynamic data loading with loading state
// =============================================================================

export async function initializeWithLoadingState(
  onLoading: () => void,
  onSuccess: (simulator: MockFleetSimulator) => void,
  onError: (error: Error) => void,
) {
  try {
    onLoading();

    const fleetData = await fetchFleetData();
    const simulator = new MockFleetSimulator(fleetData);

    simulator.start();
    onSuccess(simulator);

    return simulator;
  } catch (error) {
    onError(error as Error);
    throw error;
  }
}

// =============================================================================
// EXAMPLE 8: Filtering vehicles by status before initialization
// =============================================================================

export function initializeWithAvailableVehiclesOnly() {
  // Only simulate vehicles that are "Available"
  const availableVehicles = CAR_DATA.filter(
    (car) => car.status === "Available",
  );

  const simulator = new MockFleetSimulator(availableVehicles);
  simulator.start();
  return simulator;
}

// =============================================================================
// EXAMPLE 9: Combining multiple data sources
// =============================================================================

export async function initializeWithMixedData() {
  try {
    // Fetch from backend
    const backendData = await fetchFleetData();

    // Add some mock vehicles
    const additionalMockVehicles: CarData[] = [
      {
        file: "temp-vehicle.png",
        name: "Temporary Fleet Vehicle",
        model: "Test",
        numberPlate: "SGTEMP01",
        status: "Maintenance",
      },
    ];

    // Combine both sources
    const combinedData = [...backendData, ...additionalMockVehicles];

    const simulator = new MockFleetSimulator(combinedData);
    simulator.start();
    return simulator;
  } catch (error) {
    console.error("Failed to initialize:", error);
    // Fallback to mock data
    const simulator = new MockFleetSimulator(CAR_DATA);
    simulator.start();
    return simulator;
  }
}

/**
 * Usage in EagleViewPage.tsx:
 *
 * // Replace this line:
 * const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);
 *
 * // With any of the examples above:
 * const simulator = await initializeWithBackendData();
 * // or
 * const simulator = initializeWithMockData();
 * // or
 * const simulator = initializeWithFastUpdates();
 */
