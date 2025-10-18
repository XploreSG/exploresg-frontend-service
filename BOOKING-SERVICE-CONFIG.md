# Booking Service Configuration Update ✅

## Summary

Updated the application to use a separate **Booking Service** running on port **8082** for all booking-related API calls.

## Changes Made

### 1. Environment Variables

#### `.env.development`

Added new environment variable for the Booking Service:

```bash
VITE_BOOKING_API_BASE_URL=https://api.xplore.town/booking
# VITE_BOOKING_API_BASE_URL=http://localhost:8082  # For local development
```

**Note:** Uncomment the local URL and comment out the production URL when running locally.

#### `example.frontend.env`

Added template for Docker runtime:

```bash
BOOKING_API_BASE_URL=BOOKING_API_BASE_URL
```

#### `public/env.template.js`

Added runtime configuration for Docker deployments:

```javascript
BOOKING_API_BASE_URL: "$BOOKING_API_BASE_URL",
```

### 2. API Configuration (`src/config/api.ts`)

#### Added Booking API Base URL:

```typescript
export const BOOKING_API_BASE_URL = getEnvVar(
  "BOOKING_API_BASE_URL",
  "http://localhost:8082",
);
```

#### Updated Booking Endpoints:

```typescript
BOOKING: {
  CREATE: `${BOOKING_API_BASE_URL}/api/v1/bookings`,           // Changed from API_BASE_URL
  DETAILS: (id: string) => `${BOOKING_API_BASE_URL}/api/v1/bookings/${id}`,
}
```

#### Added to Required Environment Variables:

```typescript
const requiredEnvVars = {
  VITE_API_BASE_URL: getEnvVar("API_BASE_URL"),
  VITE_FLEET_API_BASE_URL: getEnvVar("FLEET_API_BASE_URL"),
  VITE_BOOKING_API_BASE_URL: getEnvVar("BOOKING_API_BASE_URL"), // NEW
  VITE_GOOGLE_CLIENT_ID: getEnvVar("GOOGLE_CLIENT_ID"),
} as const;
```

## Service Architecture

The application now uses **3 separate microservices**:

### 1. **Auth Service** (Port 8080)

- Base URL: `http://localhost:8080` (local) / `https://api.xplore.town/auth` (production)
- Endpoints:
  - `POST /api/v1/auth/google` - Google OAuth
  - `POST /api/v1/auth/logout` - Logout
  - `POST /api/v1/signup` - User signup
  - `GET /api/v1/user/profile` - User profile

### 2. **Fleet Service** (Port 8081)

- Base URL: `http://localhost:8081` (local) / `https://api.xplore.town/fleet` (production)
- Endpoints:
  - `GET /api/v1/fleet/models` - Get vehicle models
  - `GET /api/v1/fleet/vehicles` - Get vehicles

### 3. **Booking Service** (Port 8082) ⭐ NEW

- Base URL: `http://localhost:8082` (local) / `https://api.xplore.town/booking` (production)
- Endpoints:
  - `POST /api/v1/bookings` - Create booking & reserve vehicle
  - `POST /api/v1/bookings/:id/pay` - Process payment
  - `GET /api/v1/bookings/:id` - Get booking details

## API Call Flow

### Booking Workflow:

```
1. ReviewPage → POST ${BOOKING_API_BASE_URL}/api/v1/bookings
   ↓ Creates reservation (30s window)

2. PaymentPage → POST ${BOOKING_API_BASE_URL}/api/v1/bookings/:bookingId/pay
   ↓ Processes payment

3. ConfirmationPage → GET ${BOOKING_API_BASE_URL}/api/v1/bookings/:bookingId
   ↓ Fetches booking details
```

## Local Development Setup

### Running All Services Locally:

1. **Auth Service** (Terminal 1):

   ```bash
   cd auth-service
   # Start on port 8080
   ```

2. **Fleet Service** (Terminal 2):

   ```bash
   cd fleet-service
   # Start on port 8081
   ```

3. **Booking Service** (Terminal 3):

   ```bash
   cd booking-service
   # Start on port 8082
   ```

4. **Frontend** (Terminal 4):

   ```bash
   cd exploresg-frontend-service

   # Update .env.development to use local URLs:
   # VITE_API_BASE_URL=http://localhost:8080
   # VITE_FLEET_API_BASE_URL=http://localhost:8081
   # VITE_BOOKING_API_BASE_URL=http://localhost:8082

   npm run dev
   ```

## Production Deployment

### Environment Variables Required:

```bash
VITE_API_BASE_URL=https://api.xplore.town/auth
VITE_FLEET_API_BASE_URL=https://api.xplore.town/fleet
VITE_BOOKING_API_BASE_URL=https://api.xplore.town/booking
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MAPBOX_TOKEN=your-mapbox-token
VITE_APP_ENV=production
VITE_DEBUG=false
```

## Testing

### Verify Configuration:

```bash
npm run build
```

Build should complete successfully with no errors ✅

### Check Runtime Configuration:

When running in development mode with `VITE_DEBUG=true`, the console will display:

```javascript
API Configuration Loaded: {
  API_BASE_URL: "http://localhost:8080",
  FLEET_API_BASE_URL: "http://localhost:8081",
  BOOKING_API_BASE_URL: "http://localhost:8082",  // ✅ NEW
  APP_ENV: "development",
  GOOGLE_CLIENT_ID: "Set",
  MAPBOX_TOKEN: "Set"
}
```

## Files Modified

1. ✅ `.env.development` - Added `VITE_BOOKING_API_BASE_URL`
2. ✅ `example.frontend.env` - Added `BOOKING_API_BASE_URL`
3. ✅ `public/env.template.js` - Added `BOOKING_API_BASE_URL`
4. ✅ `src/config/api.ts` - Added booking service configuration

## Backend Requirements

The **Booking Service** (port 8082) must implement these endpoints:

### 1. Create Booking

```
POST /api/v1/bookings
Authorization: Bearer {jwtToken}
Content-Type: application/json

Request Body: {
  carModelPublicId: string,
  startDate: string,
  endDate: string,
  pickupLocation: string,
  returnLocation: string,
  driverDetails: {...},
  selectedAddOns: string[],
  selectedCDW: string
}

Response: {
  bookingId: string,
  status: "PENDING_PAYMENT",
  reservationExpiresAt: string,  // 30 seconds from now
  totalAmount: number,
  currency: string
}
```

### 2. Process Payment

```
POST /api/v1/bookings/:bookingId/pay
Authorization: Bearer {jwtToken}
Content-Type: application/json

Request Body: {
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "MOCK",
  cardDetails: {...}
}

Response: {
  bookingId: string,
  status: "CONFIRMED",
  paymentId: string,
  message: string
}
```

### 3. Get Booking Details

```
GET /api/v1/bookings/:bookingId
Authorization: Bearer {jwtToken}

Response: {
  bookingId: string,
  status: string,
  carModel: {...},
  startDate: string,
  endDate: string,
  totalAmount: number,
  driverDetails: {...}
}
```

## Next Steps

1. ✅ Configuration updated
2. ✅ Build successful
3. ⏳ Start Booking Service on port 8082
4. ⏳ Test complete booking flow
5. ⏳ Verify API integration

---

**Updated:** October 18, 2025  
**Build Status:** ✅ Passing  
**Configuration:** ✅ Complete
