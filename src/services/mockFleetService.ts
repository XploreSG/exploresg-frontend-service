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
      const carData = CAR_DATA[i % CAR_DATA.length];
      return {
        id: `veh-${i + 1}`,
        lat,
        lng,
        heading: Math.floor(rand(0, 360)),
        numberPlate: carData.numberPlate,
        imageUrl: `/assets/cars-logo/${carData.file}`,
        name: carData.name,
        model: carData.model,
        status: carData.status,
        driver: carData.status === "In Use" ? randomDriver() : undefined,
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
      // Only move vehicles that are "In Use"
      if (v.status !== "In Use") {
        return v;
      }

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
