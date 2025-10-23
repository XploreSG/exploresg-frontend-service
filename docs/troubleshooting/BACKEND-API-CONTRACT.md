# Backend API Contract - Booking Creation

## ⚠️ CRITICAL: Exact API Requirements

### Endpoint

```
POST http://localhost:8082/api/v1/bookings
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body (EXACT FORMAT)

```json
{
  "carModelPublicId": "123e4567-e89b-12d3-a456-426614174000",
  "startDate": "2025-11-01T10:00:00Z",
  "endDate": "2025-11-05T18:00:00Z",
  "pickupLocation": "Changi Airport",
  "returnLocation": "Changi Airport",
  "driverDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+65 9123 4567",
    "licenseNumber": "S1234567A"
  }
}
```

## ❌ Current Frontend Issues

### Issue 1: carModelPublicId Format

**Expected:** UUID format like `"123e4567-e89b-12d3-a456-426614174000"`
**Currently Sending:** `"101-Toyota-Alphard-13"` (frontend-generated ID)

**Root Cause:** Backend fleet API is not returning `publicId` field

**Solution Options:**

1. **Backend Fix (RECOMMENDED):** Update fleet API to return `publicId` field
2. **Frontend Workaround:** Map frontend ID to backend UUID (not ideal)

### Issue 2: Date Format

**Expected:** `"2025-11-01T10:00:00Z"` (no milliseconds)
**Currently Sending:** `"2025-10-19T03:00:00.000Z"` (with milliseconds)

**Solution:** Remove `.000` from ISO string

### Issue 3: Extra Fields

**Backend Expects:** Only 5 fields in `driverDetails`
**Currently Sending:** 7 fields (including `dateOfBirth`, `licenseExpiryDate`)

**Also Sending (not expected):**

- `selectedCDW`: `"basic"`
- `selectedAddOns`: `["malaysia-drive"]`

**Solution:** Remove extra fields from request

## ✅ Required Changes

### 1. Fix Date Format

```typescript
// BEFORE ❌
const pickupISO = new Date(pickupDate + "T" + pickupTime).toISOString();
// Returns: "2025-11-01T10:00:00.000Z"

// AFTER ✅
const pickupISO = new Date(pickupDate + "T" + pickupTime)
  .toISOString()
  .replace(/\.\d{3}Z$/, "Z");
// Returns: "2025-11-01T10:00:00Z"
```

### 2. Fix Request Body

```typescript
// BEFORE ❌
const bookingRequest: CreateBookingRequest = {
  carModelPublicId: "101-Toyota-Alphard-13", // Wrong format
  startDate: "2025-10-19T03:00:00.000Z", // Has milliseconds
  endDate: "2025-10-24T02:00:00.000Z", // Has milliseconds
  pickupLocation: "Changi Airport",
  returnLocation: "Changi Airport",
  driverDetails: {
    firstName: "SREERAJ",
    lastName: "CHELLAPPAN",
    email: "sreeraj_ec@hotmail.com",
    phone: "+6597342754",
    licenseNumber: "sdfsafsdfsa",
    dateOfBirth: "1988-09-25", // ❌ Not expected
    licenseExpiryDate: "2035-09-12", // ❌ Not expected
  },
  selectedCDW: "basic", // ❌ Not expected
  selectedAddOns: ["malaysia-drive"], // ❌ Not expected
};

// AFTER ✅
const bookingRequest = {
  carModelPublicId: "123e4567-e89b-12d3-a456-426614174000", // UUID from backend
  startDate: "2025-11-01T10:00:00Z", // No milliseconds
  endDate: "2025-11-05T18:00:00Z", // No milliseconds
  pickupLocation: "Changi Airport",
  returnLocation: "Changi Airport",
  driverDetails: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+65 9123 4567",
    licenseNumber: "S1234567A",
    // ✅ Only 5 fields
  },
  // ✅ No extra fields
};
```

## 🔧 Implementation Steps

### Step 1: Update Backend Fleet API

**File:** `FleetController.java` or equivalent

Add `publicId` field to car model response:

```json
{
  "operatorId": "28dac4bd-...",
  "carModelId": 5,
  "publicId": "123e4567-e89b-12d3-a456-426614174000",  // ⭐ ADD THIS
  "model": "Toyota Alphard",
  ...
}
```

### Step 2: Update Frontend Type (DONE ✅)

```typescript
export interface CreateBookingRequest {
  carModelPublicId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  driverDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    // ❌ Remove: dateOfBirth, licenseExpiryDate
  };
  // ❌ Remove: selectedCDW, selectedAddOns
}
```

### Step 3: Update Date Formatting (DONE ✅)

File: `DatePickerSection.tsx`

- Remove milliseconds from ISO string

### Step 4: Update API Call (NEEDS UPDATE)

File: `ReviewPage.tsx`

- Remove extra fields from request body
- Ensure UUID is used for carModelPublicId

## 📋 Testing Checklist

- [ ] Backend returns `publicId` in fleet API
- [ ] Console shows UUID: `"123e4567-..."`
- [ ] Console shows dates: `"2025-11-01T10:00:00Z"` (no `.000`)
- [ ] Request body has ONLY 7 fields (not 9)
- [ ] `driverDetails` has ONLY 5 fields (not 7)
- [ ] No `selectedCDW` or `selectedAddOns` in request
- [ ] Backend accepts booking: `201 Created`
- [ ] Booking ID returned successfully

## 🚨 Action Required

**IMMEDIATE:**

1. **Backend Team:** Add `publicId` field to fleet API response
2. **Frontend Team:** Remove extra fields from booking request

**Until backend fix:**

- Frontend will send `"101-Toyota-Alphard-13"` ❌
- This will cause `400 Bad Request` error ❌
- Booking flow will NOT work ❌

## Status

- ✅ Date format fixed (no milliseconds)
- ✅ TypeScript types updated
- ⚠️ Waiting for backend `publicId` field
- 🔄 Need to remove extra fields from request
