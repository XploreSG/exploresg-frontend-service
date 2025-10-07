// Frontend-only mock fleet simulator
// Emits periodic location updates for a small set of vehicles inside Singapore

export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  numberPlate?: string;
  imageUrl?: string;
  name?: string;
  model?: string;
  status?: "Available" | "In Use" | "Maintenance";
  driver?: string;
}

type Subscriber = (vehicles: Vehicle[]) => void;

const CAR_DATA = [
  { file: "bmw-2.png", name: "BMW 2 Series", model: "218i Gran Coupé" },
  { file: "bmw-440i.png", name: "BMW 4 Series", model: "440i Convertible" },
  { file: "bmw-5-t.png", name: "BMW 5 Series", model: "520i" },
  { file: "bmw-x3.png", name: "BMW X3", model: "xDrive30i" },
  { file: "bmw-z4.png", name: "BMW Z4", model: "sDrive20i" },
  { file: "maserati-grecale.png", name: "Maserati Grecale", model: "GT" },
  { file: "merc-sl63.png", name: "Mercedes-AMG SL", model: "SL 63" },
  { file: "merc-v.png", name: "Mercedes-Benz V-Class", model: "V 220 d" },
  { file: "mini-cooper.png", name: "MINI Cooper", model: "3-Door" },
  { file: "nissan-sentra.png", name: "Nissan Sentra", model: "SV" },
  { file: "peugeot-5008.png", name: "Peugeot 5008", model: "Allure" },
  { file: "porsche-911-c.png", name: "Porsche 911", model: "Carrera" },
  { file: "rr.png", name: "Rolls-Royce Ghost", model: "Black Badge" },
  { file: "skoda-octavia.png", name: "Skoda Octavia", model: "RS" },
  { file: "vw-golf.png", name: "Volkswagen Golf", model: "GTI" },
  { file: "vw-polo.png", name: "Volkswagen Polo", model: "Life" },
];

const STATUSES: Vehicle["status"][] = ["Available", "In Use", "Maintenance"];
const DRIVERS = [
  "John Doe",
  "Jane Smith",
  "Alex Johnson",
  "Emily Davis",
  "Michael Brown",
  "Sarah Wilson",
];

// Tighter bounding box focused on central Singapore (downtown / Marina Bay / Orchard)
// This keeps simulated points over land and avoids placing many points out at sea.
const SINGAPORE_BOUNDS = {
  minLat: 1.3, // southern edge roughly around Marina Bay area
  maxLat: 1.36, // northern edge around Balestier/Novena
  minLng: 103.8, // western edge near Clementi/Orchard corridor
  maxLng: 103.88, // eastern edge near Marina Bay / Kallang
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomLatLng() {
  return {
    lat: rand(SINGAPORE_BOUNDS.minLat, SINGAPORE_BOUNDS.maxLat),
    lng: rand(SINGAPORE_BOUNDS.minLng, SINGAPORE_BOUNDS.maxLng),
  };
}

function generateNumberPlate() {
  // Simple Singapore-like plate: S followed by 3 letters and 4 digits (not exact format)
  const letters = Array.from({ length: 3 })
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const digits = String(Math.floor(Math.random() * 9000) + 1000);
  return `S${letters} ${digits}`;
}

function randomCarData() {
  const car = CAR_DATA[Math.floor(Math.random() * CAR_DATA.length)];
  return {
    ...car,
    imageUrl: `/assets/cars-logo/${car.file}`,
  };
}

function randomStatus() {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

function randomDriver() {
  return DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
}

export class MockFleetSimulator {
  private vehicles: Vehicle[] = [];
  private subscribers = new Set<Subscriber>();
  private timer: number | null = null;
  private updateIntervalMs: number;

  constructor(count = 12, updateIntervalMs = 2000) {
    this.updateIntervalMs = updateIntervalMs;
    this.vehicles = Array.from({ length: count }).map((_, i) => {
      const { lat, lng } = randomLatLng();
      const car = randomCarData();
      const status = randomStatus();
      return {
        id: `veh-${i + 1}`,
        lat,
        lng,
        heading: Math.floor(rand(0, 360)),
        numberPlate: generateNumberPlate(),
        imageUrl: car.imageUrl,
        name: car.name,
        model: car.model,
        status: status,
        driver: status === "In Use" ? randomDriver() : undefined,
      } as Vehicle;
    });
  }

  start() {
    if (this.timer) return;
    this.timer = window.setInterval(() => this.tick(), this.updateIntervalMs);
    // immediately emit initial positions
    this.emit();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  subscribe(fn: Subscriber) {
    this.subscribers.add(fn);
    // send initial snapshot
    fn(this.vehicles.map((v) => ({ ...v })));
    return () => this.subscribers.delete(fn);
  }

  private emit() {
    const snapshot = this.vehicles.map((v) => ({ ...v }));
    this.subscribers.forEach((s) => s(snapshot));
  }

  private tick() {
    // Move each vehicle a small amount, staying within bounds
    this.vehicles = this.vehicles.map((v) => {
      // random small delta in degrees (~ up to ~200-300m)
      const dLat = rand(-0.002, 0.002);
      const dLng = rand(-0.002, 0.002);
      let lat = v.lat + dLat;
      let lng = v.lng + dLng;
      // clamp to SG bounds
      lat = Math.max(
        SINGAPORE_BOUNDS.minLat,
        Math.min(SINGAPORE_BOUNDS.maxLat, lat),
      );
      lng = Math.max(
        SINGAPORE_BOUNDS.minLng,
        Math.min(SINGAPORE_BOUNDS.maxLng, lng),
      );
      const heading = Math.floor(rand(0, 360));
      return { ...v, lat, lng, heading };
    });
    this.emit();
  }
}

export default MockFleetSimulator;
