# Quick Reference: Fleet Data Integration

## 🎯 TL;DR

The `CAR_DATA` is now **modular** and lives in `src/data/fleetData.ts`. You can easily swap it with backend data.

## 📁 Key Files

| File                               | Purpose           | When to Edit                   |
| ---------------------------------- | ----------------- | ------------------------------ |
| `src/data/fleetData.ts`            | Mock fleet data   | Update vehicle list for MVP    |
| `src/services/fleetApiService.ts`  | Backend API calls | Configure API endpoints        |
| `src/services/mockFleetService.ts` | GPS simulator     | Usually don't need to edit     |
| `src/pages/EagleViewPage.tsx`      | Main UI           | Switch between mock/API data   |
| `docs/FLEET-DATA-INTEGRATION.md`   | Full guide        | Read for detailed instructions |

## 🔄 Quick Switches

### Switch 1: Update Mock Data

**File:** `src/data/fleetData.ts`

```typescript
export const CAR_DATA: CarData[] = [
  {
    file: "your-car.png", // ← Change image filename
    name: "Your Car Name", // ← Change display name
    model: "Your Model", // ← Change model
    numberPlate: "YOUR123", // ← Change plate number
    status: "Available", // ← "Available" | "In Use" | "Maintenance"
  },
  // Add more vehicles...
];
```

### Switch 2: Connect to Backend

**File:** `src/pages/EagleViewPage.tsx`

```typescript
// BEFORE (line 6):
import { CAR_DATA } from "../data/fleetData";

// AFTER:
import { fetchFleetData } from "../services/fleetApiService";

// BEFORE (line 55):
const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);

// AFTER:
const fleetData = await fetchFleetData();
const simulator = new MockFleetSimulator(fleetData, undefined, 2000);
```

### Switch 3: Real-Time GPS (No Simulator)

**File:** `src/pages/EagleViewPage.tsx`

Replace the entire simulator logic with:

```typescript
// WebSocket connection
const ws = new WebSocket("wss://your-api.com/fleet/stream");

ws.onmessage = (event) => {
  const vehicleData: Vehicle[] = JSON.parse(event.data);
  setVehicles(vehicleData);

  // Update map markers...
};

// Cleanup
return () => ws.close();
```

## 🌐 Environment Variables

**File:** `.env`

```env
# Add your backend API URL
VITE_API_BASE_URL=https://your-backend-api.com

# Example for local development
# VITE_API_BASE_URL=http://localhost:3000
```

## 📡 Backend Requirements

### Endpoint 1: Get Fleet Vehicles

```
GET /api/fleet/vehicles
```

**Response:**

```json
[
  {
    "file": "bmw-2.png",
    "name": "BMW 2 Series",
    "model": "218i Gran Coupé",
    "numberPlate": "SGF1234A",
    "status": "Available"
  }
]
```

### Endpoint 2: Get Real-Time Locations (Optional)

```
GET /api/fleet/locations
```

**Response:**

```json
[
  {
    "id": "veh-1",
    "lat": 1.3521,
    "lng": 103.8198,
    "numberPlate": "SGF1234A",
    "status": "Available"
  }
]
```

## 🧪 Testing

### Test Mock Data (Current Setup)

```bash
npm run dev
# Navigate to /manager/eagle-view
# Should see 16 vehicles on map
```

### Test Backend Connection

```typescript
// In browser console:
fetch("http://localhost:3000/api/fleet/vehicles")
  .then((r) => r.json())
  .then(console.log);
```

### Test Build

```bash
npm run build
# Should complete without errors
```

## 🐛 Common Issues

### Issue 1: "Cannot find module 'fleetData'"

**Solution:** Make sure the import path is correct:

```typescript
import { CAR_DATA } from "../data/fleetData";
```

### Issue 2: "carData cannot be empty"

**Solution:** Ensure your backend returns at least one vehicle, or use fallback:

```typescript
const fleetData = await fetchFleetData().catch(() => CAR_DATA);
```

### Issue 3: Vehicle images not loading

**Solution:**

1. Images must be in `public/assets/cars-logo/`
2. The `file` field must match the filename exactly
3. Check browser console for 404 errors

## 📚 Documentation Links

- **Full Integration Guide:** `docs/FLEET-DATA-INTEGRATION.md`
- **Architecture Diagram:** `docs/FLEET-ARCHITECTURE.md`
- **Code Examples:** `src/examples/fleetSimulatorExamples.ts`
- **Summary:** `docs/FLEET-DATA-MODULARIZATION.md`

## 💡 Pro Tips

1. **Start Simple:** Keep using mock data until backend is ready
2. **Type Safety:** Always import types from `mockFleetService.ts`
3. **Error Handling:** Add try/catch when fetching from backend
4. **Loading States:** Show spinner while fetching data
5. **Fallback:** Use mock data if backend fails

## 🎨 Customization

### Change Update Frequency

```typescript
// Current: 2000ms (2 seconds)
new MockFleetSimulator(CAR_DATA, undefined, 2000);

// Faster: 500ms
new MockFleetSimulator(CAR_DATA, undefined, 500);

// Slower: 5000ms (5 seconds)
new MockFleetSimulator(CAR_DATA, undefined, 5000);
```

### Limit Number of Vehicles

```typescript
// Show only 5 vehicles
new MockFleetSimulator(CAR_DATA, 5, 2000);
```

### Filter by Status

```typescript
const availableOnly = CAR_DATA.filter((car) => car.status === "Available");
new MockFleetSimulator(availableOnly, undefined, 2000);
```

## ✅ Checklist

- [ ] Data extracted to `src/data/fleetData.ts`
- [ ] Service accepts data as parameter
- [ ] API service template created
- [ ] Documentation complete
- [ ] Build succeeds
- [ ] Ready for backend integration

## 🚀 Next Steps

1. Update mock data in `fleetData.ts` for your MVP
2. Implement backend API following the contract
3. Switch `EagleViewPage.tsx` to use `fetchFleetData()`
4. Add loading states and error handling
5. Deploy! 🎉
