// Frontend-only mock fleet simulator
// Emits periodic location updates for a small set of vehicles inside Singapore

export interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  numberPlate?: string;
}

type Subscriber = (vehicles: Vehicle[]) => void;

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

export class MockFleetSimulator {
  private vehicles: Vehicle[] = [];
  private subscribers = new Set<Subscriber>();
  private timer: number | null = null;
  private updateIntervalMs: number;

  constructor(count = 12, updateIntervalMs = 2000) {
    this.updateIntervalMs = updateIntervalMs;
    this.vehicles = Array.from({ length: count }).map((_, i) => {
      const { lat, lng } = randomLatLng();
      return {
        id: `veh-${i + 1}`,
        lat,
        lng,
        heading: Math.floor(rand(0, 360)),
        numberPlate: generateNumberPlate(),
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
