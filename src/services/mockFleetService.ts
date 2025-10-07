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

/** Default number of vehicles to simulate */
const DEFAULT_VEHICLE_COUNT = 12;

/** Fleet vehicle catalog with predefined data */
const CAR_DATA: CarData[] = [
  {
    file: "bmw-2.png",
    name: "BMW 2 Series",
    model: "218i Gran Coupé",
    numberPlate: "SGF1234A",
    status: "Available" as const,
  },
  {
    file: "bmw-440i.png",
    name: "BMW 4 Series",
    model: "440i Convertible",
    numberPlate: "SGFUN88B",
    status: "In Use" as const,
  },
  {
    file: "bmw-5-t.png",
    name: "BMW 5 Series",
    model: "520i",
    numberPlate: "SGMYCAR5C",
    status: "Maintenance" as const,
  },
  {
    file: "bmw-x3.png",
    name: "BMW X3",
    model: "xDrive30i",
    numberPlate: "SGAGENT7X",
    status: "Available" as const,
  },
  {
    file: "bmw-z4.png",
    name: "BMW Z4",
    model: "sDrive20i",
    numberPlate: "SGCOPILOT",
    status: "In Use" as const,
  },
  {
    file: "maserati-grecale.png",
    name: "Maserati Grecale",
    model: "GT",
    numberPlate: "SGHACKER",
    status: "Available" as const,
  },
  {
    file: "merc-sl63.png",
    name: "Mercedes-AMG SL",
    model: "SL 63",
    numberPlate: "SGEXPLORE",
    status: "In Use" as const,
  },
  {
    file: "merc-v.png",
    name: "Mercedes-Benz V-Class",
    model: "V 220 d",
    numberPlate: "SGAWESOME",
    status: "Maintenance" as const,
  },
  {
    file: "mini-cooper.png",
    name: "MINI Cooper",
    model: "3-Door",
    numberPlate: "SGFRIEND1",
    status: "Available" as const,
  },
  {
    file: "nissan-sentra.png",
    name: "Nissan Sentra",
    model: "SV",
    numberPlate: "SGFRIEND2",
    status: "In Use" as const,
  },
  {
    file: "peugeot-5008.png",
    name: "Peugeot 5008",
    model: "Allure",
    numberPlate: "SGBOSS",
    status: "Available" as const,
  },
  {
    file: "porsche-911-c.png",
    name: "Porsche 911",
    model: "Carrera",
    numberPlate: "SGFAST",
    status: "In Use" as const,
  },
  {
    file: "rr.png",
    name: "Rolls-Royce Ghost",
    model: "Black Badge",
    numberPlate: "SGEZ",
    status: "Maintenance" as const,
  },
  {
    file: "skoda-octavia.png",
    name: "Skoda Octavia",
    model: "RS",
    numberPlate: "SGPRO",
    status: "Available" as const,
  },
  {
    file: "vw-golf.png",
    name: "Volkswagen Golf",
    model: "GTI",
    numberPlate: "SGKING",
    status: "In Use" as const,
  },
  {
    file: "vw-polo.png",
    name: "Volkswagen Polo",
    model: "Life",
    numberPlate: "SGRIDER",
    status: "Available" as const,
  },
];

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

  /**
   * Initialize the fleet simulator
   * @param count Number of vehicles to simulate (default: 12)
   * @param updateIntervalMs Update frequency in milliseconds (default: 2000)
   */
  constructor(
    count: number = DEFAULT_VEHICLE_COUNT,
    updateIntervalMs: number = DEFAULT_UPDATE_INTERVAL,
  ) {
    this.updateIntervalMs = updateIntervalMs;
    this.vehicles = this.initializeVehicles(count);
  }

  /**
   * Create initial vehicle instances with random positions
   */
  private initializeVehicles(count: number): Vehicle[] {
    return Array.from({ length: count }, (_, i) => {
      const { lat, lng } = randomLatLng();
      const carData = CAR_DATA[i % CAR_DATA.length];

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
      if (v.status !== "In Use") {
        return v;
      }

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
