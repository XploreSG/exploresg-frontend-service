# 5-Step Booking Workflow - Logic Confirmation ✅

## Correct Workflow Flow

### Step-by-Step Process:

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Select Car                                          │
│ Page: /rentals                                              │
│ Action: User selects a vehicle                             │
│ Button: "Select Vehicle" → Navigate to Add-ons             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Add-ons                                             │
│ Page: /booking/:carId/addons                                │
│ Action: User selects insurance (CDW) and add-ons           │
│ Button: "Continue to Driver Details"                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Driver Details                                      │
│ Page: /booking/:carId/driver-details                        │
│ Action: User enters driver information                     │
│ Button: "Continue to Review" ✅ (CORRECTED)                │
│ Navigation: `/booking/${carId}/review`                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Review & Reserve                                    │
│ Page: /booking/:carId/review                                │
│ Action: User reviews booking details                       │
│ Button: "Reserve Vehicle"                                  │
│ API Call: POST /api/v1/bookings (Booking Service)         │
│ Response: { bookingId, reservationExpiresAt (30s) }       │
│ Creates: 30-second reservation hold                        │
│ Navigation: `/booking/${bookingId}/payment`                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Payment (with 30s countdown)                        │
│ Page: /booking/:bookingId/payment                           │
│ Display: Countdown timer (30 seconds)                      │
│ Action: User enters payment details                        │
│ Button: "Complete Payment"                                 │
│ API Call: POST /api/v1/bookings/:bookingId/pay            │
│ Must Complete: Within 30 seconds or reservation expires    │
│ Navigation: `/booking/${bookingId}/confirmation`           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Confirmation                                        │
│ Page: /booking/:bookingId/confirmation                      │
│ Display: Booking confirmation details                      │
│ Status: Booking confirmed                                  │
└─────────────────────────────────────────────────────────────┘
```

## Key Logic Points

### 1. ✅ Driver Details → Review (NOT Payment)

**Button Text:** "Continue to Review"  
**Navigation:** `/booking/${carId}/review`  
**Reason:** User needs to review all details before making a reservation

### 2. ✅ Review → Payment (After API Call)

**Button Text:** "Reserve Vehicle"  
**API Call:** `POST ${BOOKING_API_BASE_URL}/api/v1/bookings`  
**Creates:** 30-second hold on the vehicle  
**Navigation:** `/booking/${bookingId}/payment` (note: uses bookingId, not carId)  
**Reason:** Reservation must be created before payment to prevent race conditions

### 3. ✅ Payment → Confirmation

**Button Text:** "Complete Payment"  
**API Call:** `POST ${BOOKING_API_BASE_URL}/api/v1/bookings/${bookingId}/pay`  
**Constraint:** Must complete within 30 seconds  
**Navigation:** `/booking/${bookingId}/confirmation`  
**Reason:** Confirms the reserved booking with payment

## Why This Flow Prevents Race Conditions

### ❌ Old 4-Step Flow Problem:

```
Driver Details → Payment → (Multiple users can pay simultaneously)
→ Only first payment succeeds, others fail
```

### ✅ New 5-Step Flow Solution:

```
Review → Reserve (30s hold) → Payment (within 30s)
→ Vehicle locked for single user
→ Others get 409 error if vehicle unavailable
→ Reservation expires if payment not completed in 30s
```

## API Endpoints Used

### Step 4: Review & Reserve

```http
POST ${BOOKING_API_BASE_URL}/api/v1/bookings
Authorization: Bearer {jwtToken}

Request: {
  carModelPublicId: string,
  startDate: string,
  endDate: string,
  driverDetails: {...},
  selectedAddOns: string[],
  selectedCDW: string
}

Response: {
  bookingId: string,
  status: "PENDING_PAYMENT",
  reservationExpiresAt: string,  // 30 seconds from now
  totalAmount: number
}
```

### Step 5: Payment

```http
POST ${BOOKING_API_BASE_URL}/api/v1/bookings/:bookingId/pay
Authorization: Bearer {jwtToken}

Request: {
  paymentMethod: "CREDIT_CARD",
  cardDetails: {...}
}

Response: {
  bookingId: string,
  status: "CONFIRMED",
  paymentId: string
}
```

## Booking Context State

### After Step 4 (Review):

```typescript
setBooking({
  bookingId: "abc123",
  status: "PENDING_PAYMENT",
  reservationExpiresAt: "2025-10-18T10:30:45Z", // 30s from now
  totalAmount: 1500.0,
});
```

### After Step 5 (Payment):

```typescript
// Booking status updated to "CONFIRMED"
// User sees confirmation page
```

## Button Text Summary

| Page           | Step | Button Text                  | Destination              |
| -------------- | ---- | ---------------------------- | ------------------------ |
| Rentals        | 1    | "Select Vehicle"             | Add-ons                  |
| Add-ons        | 2    | "Continue to Driver Details" | Driver Details           |
| Driver Details | 3    | **"Continue to Review"** ✅  | Review                   |
| Review         | 4    | "Reserve Vehicle"            | Payment (with bookingId) |
| Payment        | 5    | "Complete Payment"           | Confirmation             |

## Verification Checklist

- ✅ Driver Details button says "Continue to Review" (not "Continue to Payment")
- ✅ Driver Details navigates to `/booking/${carId}/review`
- ✅ Review page calls `createBooking()` API to create reservation hold
- ✅ Review page navigates to `/booking/${bookingId}/payment` (not `/booking/${carId}/payment`)
- ✅ Payment page shows countdown timer for 30 seconds
- ✅ Payment page gets bookingId from URL params (not location state)
- ✅ Payment page calls `processPayment()` API
- ✅ Confirmation page fetches booking details via `getBookingDetails()` API

---

**Status:** ✅ Logic Confirmed  
**Last Updated:** October 18, 2025  
**Change Made:** Fixed button text on Driver Details page from "Continue to Payment" → "Continue to Review"
