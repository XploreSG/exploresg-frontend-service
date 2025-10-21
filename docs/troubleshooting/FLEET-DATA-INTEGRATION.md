# Fleet Data Integration Guide

This document explains how to integrate the Eagle View fleet tracking system with your backend API.

## 📁 File Structure

```
src/
├── data/
│   └── fleetData.ts           # Mock fleet data (can be replaced)
├── services/
│   ├── mockFleetService.ts    # Fleet simulator service
│   └── fleetApiService.ts     # Backend API integration template
└── pages/
    └── EagleViewPage.tsx      # Main Eagle View component
```

## 🔄 Current Setup (Mock Data)

Currently, the system uses **mock data** from `src/data/fleetData.ts`:

```typescript
// EagleViewPage.tsx
import { CAR_DATA } from "../data/fleetData";

const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);
```

## 🚀 How to Integrate with Backend

### Option 1: Static Fleet Data (Recommended for MVP)

If your backend provides a static list of vehicles, follow these steps:

#### 1. Update Environment Variables

Add your backend API URL to `.env`:

```env
VITE_API_BASE_URL=https://your-backend-api.com
```

#### 2. Update `fleetApiService.ts`

The template is already created at `src/services/fleetApiService.ts`. Update the endpoint if needed:

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
```

#### 3. Update `EagleViewPage.tsx`

Replace the static import with an API call:

```typescript
// Before:
import { CAR_DATA } from "../data/fleetData";

// After:
import { fetchFleetData } from "../services/fleetApiService";
```

Then update the `useEffect` to fetch data:

```typescript
useEffect(() => {
  // ... mapbox setup code ...

  // Fetch fleet data from backend
  const initializeFleet = async () => {
    try {
      const fleetData = await fetchFleetData();
      const simulator = new MockFleetSimulator(fleetData, undefined, 2000);

      const sub = simulator.subscribe((vehicleData: Vehicle[]) => {
        // ... existing subscription logic ...
      });

      simulator.start();
    } catch (error) {
      console.error("Failed to initialize fleet:", error);
      // Handle error (show error message to user)
    }
  };

  initializeFleet();

  // ... cleanup code ...
}, []);
```

### Option 2: Real-Time GPS Data

If your backend provides real-time GPS coordinates, you don't need the mock simulator:

#### 1. Set up WebSocket or Polling

**WebSocket Example:**

```typescript
useEffect(() => {
  const ws = new WebSocket("wss://your-backend-api.com/fleet/stream");

  ws.onmessage = (event) => {
    const vehicleData: Vehicle[] = JSON.parse(event.data);
    setVehicles(vehicleData);
  };

  return () => {
    ws.close();
  };
}, []);
```

**Polling Example:**

```typescript
useEffect(() => {
  const fetchLocations = async () => {
    const locations = await fetchVehicleLocations();
    setVehicles(locations);
  };

  fetchLocations(); // Initial fetch
  const interval = setInterval(fetchLocations, 2000); // Poll every 2s

  return () => clearInterval(interval);
}, []);
```

## 📦 Backend API Contract

### Endpoint: GET `/api/fleet/vehicles`

Returns the list of all vehicles in the fleet.

**Response Schema:**

```typescript
interface CarData {
  file: string; // Image filename (e.g., "bmw-2.png")
  name: string; // Vehicle name (e.g., "BMW 2 Series")
  model: string; // Vehicle model (e.g., "218i Gran Coupé")
  numberPlate: string; // License plate (e.g., "SGF1234A")
  status: "Available" | "In Use" | "Maintenance";
}
```

**Example Response:**

```json
[
  {
    "file": "bmw-2.png",
    "name": "BMW 2 Series",
    "model": "218i Gran Coupé",
    "numberPlate": "SGF1234A",
    "status": "Available"
  },
  {
    "file": "bmw-440i.png",
    "name": "BMW 4 Series",
    "model": "440i Convertible",
    "numberPlate": "SGFUN88B",
    "status": "In Use"
  }
]
```

### Endpoint: GET `/api/fleet/locations` (Optional)

Returns real-time GPS locations of all vehicles.

**Response Schema:**

```typescript
interface Vehicle {
  id: string;
  lat: number; // Latitude
  lng: number; // Longitude
  heading?: number; // Direction in degrees (0-360)
  numberPlate?: string;
  imageUrl?: string;
  name?: string;
  model?: string;
  status?: "Available" | "In Use" | "Maintenance";
  driver?: string; // Current driver name (if in use)
}
```

**Example Response:**

```json
[
  {
    "id": "veh-1",
    "lat": 1.3521,
    "lng": 103.8198,
    "heading": 45,
    "numberPlate": "SGF1234A",
    "imageUrl": "/assets/cars-logo/bmw-2.png",
    "name": "BMW 2 Series",
    "model": "218i Gran Coupé",
    "status": "Available"
  }
]
```

## 🔐 Authentication

If your backend requires authentication, update the headers in `fleetApiService.ts`:

```typescript
const token = localStorage.getItem("authToken"); // or use your auth context

const response = await fetch(`${API_BASE_URL}/api/fleet/vehicles`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

## 🧪 Testing

### Test with Mock Data

The current setup works out of the box with mock data from `src/data/fleetData.ts`.

### Test with Local Backend

1. Run your backend server on `http://localhost:3000`
2. Ensure your backend returns data matching the schema above
3. Update the import in `EagleViewPage.tsx` to use `fetchFleetData()`

### Test Backend Connection

You can test your API connection in the browser console:

```javascript
// Test in browser console
fetch("http://localhost:3000/api/fleet/vehicles")
  .then((r) => r.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## 🎨 Vehicle Images

Vehicle images should be placed in `public/assets/cars-logo/`. The `file` field in `CarData` should match the filename:

```
public/assets/cars-logo/
├── bmw-2.png
├── bmw-440i.png
├── merc-sl63.png
└── ...
```

If you want to use a different path, update the `ASSETS_BASE_PATH` constant in `mockFleetService.ts`:

```typescript
const ASSETS_BASE_PATH = "/your/custom/path";
```

## 📝 Summary

**For MVP (Quick Start):**

- Keep using mock data from `src/data/fleetData.ts`
- Just update the data in that file to match your fleet

**For Production:**

- Implement backend endpoints following the API contract
- Use `fetchFleetData()` from `fleetApiService.ts`
- Update `EagleViewPage.tsx` to fetch data on mount

**For Real-Time GPS:**

- Implement WebSocket or polling for live location updates
- Remove the mock simulator and use direct state updates
