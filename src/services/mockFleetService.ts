/**
 * Frontend-only mock fleet simulator
 * Emits periodic location updates for a small set of vehicles inside Singapore
 */

// ============================================================================
// Type Definitions
// ============================================================================

/** Vehicle operational status */
export type VehicleStatus = "Available" | "In Use" | "Maintenance";

/** Real-time vehicle data with location and status */
export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  numberPlate?: string;
  imageUrl?: string;
  name?: string;
  model?: string;
  status?: VehicleStatus;
  driver?: string;
}

/** Static vehicle configuration data */
export interface CarData {
  file: string;
  name: string;
  model: string;
  numberPlate: string;
  status: VehicleStatus;
}

type Subscriber = (vehicles: Vehicle[]) => void;

// ============================================================================
// Constants
// ============================================================================

/** Base path for vehicle images */
const ASSETS_BASE_PATH = "/assets/cars-logo";

/** Movement delta in degrees (approximately 200-300 meters) */
const MOVEMENT_DELTA = 0.002;

/** Default update interval in milliseconds */
const DEFAULT_UPDATE_INTERVAL = 2000;

/** Pool of driver names for vehicles in use */
const DRIVERS = [
  "John Doe",
  "Jane Smith",
  "Alex Johnson",
  "Emily Davis",
  "Michael Brown",
  "Sarah Wilson",
] as const;

/**
 * Geographic bounding box for central Singapore
 * Focused on downtown, Marina Bay, and Orchard areas to keep vehicles over land
 */
const SINGAPORE_BOUNDS = {
  minLat: 1.3, // Southern edge (Marina Bay area)
  maxLat: 1.36, // Northern edge (Balestier/Novena)
  minLng: 103.8, // Western edge (Clementi/Orchard)
  maxLng: 103.88, // Eastern edge (Marina Bay/Kallang)
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/** Generate random number between min and max */
const rand = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/** Generate random coordinates within Singapore bounds */
const randomLatLng = (): { lat: number; lng: number } => ({
  lat: rand(SINGAPORE_BOUNDS.minLat, SINGAPORE_BOUNDS.maxLat),
  lng: rand(SINGAPORE_BOUNDS.minLng, SINGAPORE_BOUNDS.maxLng),
});

/** Select random driver from the pool */
const randomDriver = (): string =>
  DRIVERS[Math.floor(Math.random() * DRIVERS.length)];

/** Clamp value between min and max */
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// ============================================================================
// Mock Fleet Simulator Class
// ============================================================================

/**
 * Simulates a fleet of vehicles with real-time location updates
 * Uses pub/sub pattern for reactive updates
 */
export class MockFleetSimulator {
  private vehicles: Vehicle[] = [];
  private subscribers = new Set<Subscriber>();
  private timer: number | null = null;
  private readonly updateIntervalMs: number;
  private readonly carDataSource: CarData[];

  /**
   * Initialize the fleet simulator
   * @param carData Array of vehicle configuration data (required)
   * @param count Number of vehicles to simulate (default: all vehicles in carData)
   * @param updateIntervalMs Update frequency in milliseconds (default: 2000)
   */
  constructor(
    carData: CarData[],
    count?: number,
    updateIntervalMs: number = DEFAULT_UPDATE_INTERVAL,
  ) {
    if (!carData || carData.length === 0) {
      throw new Error("CarData array cannot be empty");
    }
    this.carDataSource = carData;
    this.updateIntervalMs = updateIntervalMs;
    const vehicleCount = count ?? carData.length;
    this.vehicles = this.initializeVehicles(vehicleCount);
  }

  /**
   * Create initial vehicle instances with random positions
   */
  private initializeVehicles(count: number): Vehicle[] {
    return Array.from({ length: count }, (_, i) => {
      const { lat, lng } = randomLatLng();
      const carData = this.carDataSource[i % this.carDataSource.length];

      return {
        id: `veh-${i + 1}`,
        lat,
        lng,
        heading: Math.floor(rand(0, 360)),
        numberPlate: carData.numberPlate,
        imageUrl: `${ASSETS_BASE_PATH}/${carData.file}`,
        name: carData.name,
        model: carData.model,
        status: carData.status,
        driver: carData.status === "In Use" ? randomDriver() : undefined,
      };
    });
  }

  /**
   * Start the simulation with periodic updates
   * Emits initial positions immediately
   */
  start(): void {
    if (this.timer) return;
    this.timer = window.setInterval(() => this.tick(), this.updateIntervalMs);
    this.emit();
  }

  /**
   * Stop the simulation and clear the update timer
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Subscribe to vehicle updates
   * @param fn Callback function to receive vehicle updates
   * @returns Unsubscribe function
   */
  subscribe(fn: Subscriber): () => boolean {
    this.subscribers.add(fn);
    fn(this.vehicles.map((v) => ({ ...v })));
    return () => this.subscribers.delete(fn);
  }

  private emit() {
    const snapshot = this.vehicles.map((v) => ({ ...v }));
    this.subscribers.forEach((s) => s(snapshot));
  }

  /**
   * Update vehicle positions (only moves vehicles "In Use")
   */
  private tick(): void {
    this.vehicles = this.vehicles.map((v) => {
      const st = (v.status || "").toString().toLowerCase();
      const shouldMove =
        st === "in use" || st === "in_use" || st === "booked" || st === "book";
      if (!shouldMove) return v;

      const dLat = rand(-MOVEMENT_DELTA, MOVEMENT_DELTA);
      const dLng = rand(-MOVEMENT_DELTA, MOVEMENT_DELTA);

      const lat = clamp(
        v.lat + dLat,
        SINGAPORE_BOUNDS.minLat,
        SINGAPORE_BOUNDS.maxLat,
      );
      const lng = clamp(
        v.lng + dLng,
        SINGAPORE_BOUNDS.minLng,
        SINGAPORE_BOUNDS.maxLng,
      );
      const heading = Math.floor(rand(0, 360));

      return { ...v, lat, lng, heading };
    });
    this.emit();
  }
}

export default MockFleetSimulator;
