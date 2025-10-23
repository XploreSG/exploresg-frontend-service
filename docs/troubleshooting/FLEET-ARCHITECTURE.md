# Fleet Data Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        EagleViewPage.tsx                        │
│                     (Main Fleet Dashboard)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ imports & uses
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌──────────────────┐
│   fleetData.ts  │            │ mockFleetService │
│   (Mock Data)   │            │   (Simulator)    │
└────────┬────────┘            └────────┬─────────┘
         │                               │
         │                               │
         │                               │ can be replaced with
         │                               │
         │                               ▼
         │                    ┌─────────────────────┐
         │                    │ fleetApiService.ts  │
         │                    │  (Backend Bridge)   │
         │                    └──────────┬──────────┘
         │                               │
         │                               │ fetches from
         │                               │
         │                               ▼
         │                    ┌─────────────────────┐
         │                    │   Backend API       │
         └───────────────────►│  /api/fleet/...     │
            can be replaced   └─────────────────────┘
```

## 🔄 Data Flow

### Current Implementation (Mock Data)

```
fleetData.ts
    │
    │ exports CAR_DATA
    │
    ▼
EagleViewPage.tsx
    │
    │ const simulator = new MockFleetSimulator(CAR_DATA)
    │
    ▼
MockFleetSimulator
    │
    │ generates random locations
    │ publishes updates every 2s
    │
    ▼
EagleViewPage (vehicles state)
    │
    │ renders on Mapbox
    │
    ▼
Map Markers + Vehicle List
```

### Future Implementation (Backend API)

```
Backend API
    │
    │ GET /api/fleet/vehicles
    │
    ▼
fleetApiService.ts
    │
    │ fetchFleetData()
    │
    ▼
EagleViewPage.tsx
    │
    │ const simulator = new MockFleetSimulator(backendData)
    │
    ▼
MockFleetSimulator
    │
    │ simulates movement
    │
    ▼
Map Markers + Vehicle List
```

### Production Implementation (Real-Time GPS)

```
Backend WebSocket
    │
    │ wss://api/fleet/stream
    │
    ▼
EagleViewPage.tsx
    │
    │ direct state updates (no simulator)
    │
    ▼
Map Markers + Vehicle List
```

## 📂 File Responsibilities

### Data Layer

- **`src/data/fleetData.ts`**
  - Contains static fleet vehicle catalog
  - Defines vehicle properties (name, model, plate, status)
  - **Easy to modify** for quick updates
  - Type: `CarData[]`

### Service Layer

- **`src/services/mockFleetService.ts`**
  - Simulates real-time vehicle movement
  - Accepts `CarData[]` as input (modular!)
  - Generates random GPS coordinates
  - Publishes location updates via pub/sub
  - Status: "In Use" vehicles move, others stay still

- **`src/services/fleetApiService.ts`**
  - Template for backend integration
  - `fetchFleetData()` - get vehicle catalog
  - `fetchVehicleLocations()` - get real-time GPS
  - Ready to use with your backend

### Presentation Layer

- **`src/pages/EagleViewPage.tsx`**
  - Main dashboard component
  - Renders Mapbox map
  - Shows vehicle list panel
  - Handles search & filtering
  - Displays vehicle details

## 🎯 Integration Points

### Point 1: Data Source

**Current:**

```typescript
import { CAR_DATA } from "../data/fleetData";
```

**Backend:**

```typescript
import { fetchFleetData } from "../services/fleetApiService";
const fleetData = await fetchFleetData();
```

### Point 2: Simulator Initialization

**Current:**

```typescript
const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);
```

**With Backend:**

```typescript
const simulator = new MockFleetSimulator(fleetData, undefined, 2000);
```

**Real-Time GPS (No Simulator):**

```typescript
// WebSocket connection
const ws = new WebSocket("wss://api.example.com/fleet");
ws.onmessage = (e) => setVehicles(JSON.parse(e.data));
```

## 🚀 Migration Path

### Phase 1: Current (Mock Data) ✅

- Use `fleetData.ts` for static data
- Simulator generates fake GPS coordinates
- Perfect for development & testing

### Phase 2: Backend Catalog + Mock GPS

- Backend provides vehicle list
- Simulator still generates GPS coordinates
- Good for MVP with partial backend

### Phase 3: Full Backend Integration

- Backend provides vehicle list
- Backend provides real-time GPS via WebSocket
- Remove simulator, use direct state updates
- Production-ready

## 📊 Component Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    EagleViewPage                         │
│                                                          │
│  ┌────────────────┐  ┌─────────────────────────────┐   │
│  │  Search Bar    │  │    Status Filter Buttons    │   │
│  └────────────────┘  └─────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │          Vehicle List (Filtered)                │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │ [IMG] SGF1234A - BMW 2 Series - Available│ │   │
│  │  │ [IMG] SGFUN88B - BMW 4 Series - In Use   │ │   │
│  │  │ ...                                       │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │               Mapbox Map                        │   │
│  │                                                  │   │
│  │    🔴 ← Vehicle Marker (with popup label)      │   │
│  │    🟢 ← Available                               │   │
│  │    🟡 ← In Use (moving)                        │   │
│  │    🔴 ← Maintenance                             │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │        Vehicle Detail Overlay (on click)        │   │
│  │  [Vehicle Image]                                │   │
│  │  Name: BMW 2 Series                             │   │
│  │  Plate: SGF1234A                                │   │
│  │  Status: Available                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 🔐 Type Safety

All data flows are fully typed:

```typescript
CarData (static config)
    ↓
MockFleetSimulator
    ↓
Vehicle (with GPS coordinates)
    ↓
React State
    ↓
UI Components
```

Every interface is exported and reusable!
