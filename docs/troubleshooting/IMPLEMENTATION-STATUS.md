# Implementation Guide: 5-Step Booking Workflow

## ✅ Completed Components

### 1. Booking API Service (`src/services/bookingApi.ts`)

- ✅ `createBooking()` - Creates booking and reserves vehicle
- ✅ `processPayment()` - Processes payment within 30 seconds
- ✅ `getBookingDetails()` - Fetches booking information
- ✅ `handleBookingApiError()` - Centralized error handling

### 2. Updated Booking Progress (`src/components/Rentals/BookingProgress.tsx`)

- ✅ Now shows 5 steps instead of 4
- ✅ Added "Review & Reserve" step before payment

### 3. Countdown Timer (`src/components/Rentals/CountdownTimer.tsx`)

- ✅ Visual countdown with color coding (green/yellow/red)
- ✅ Progress bar animation
- ✅ Auto-expires and triggers callback

### 4. Reservation Expired Modal (`src/components/Rentals/ReservationExpiredModal.tsx`)

- ✅ Error modal for expired reservations
- ✅ Redirects user back to vehicle selection

### 5. Review Page (`src/pages/ReviewPage.tsx`)

- ✅ Step 4: Review & Reserve
- ✅ Complete booking summary display
- ✅ Vehicle, driver, add-ons, and pricing details
- ✅ Reserve button that calls API

### 6. Updated Booking Context (`src/contexts/BookingProvider.tsx`)

- ✅ Added `BookingReservation` type
- ✅ Added `booking` state and `setBooking()` method

---

## 🔨 Remaining Tasks

### Task 6: Update PaymentPage.tsx

**File**: `src/pages/PaymentPage.tsx`

**Changes Needed**:

1. Change route to accept dynamic `bookingId`: `/booking/:bookingId/payment`
2. Add Countdown Timer component at the top
3. Get `booking` from context instead of location state
4. Call `processPayment(bookingId, paymentData)` API
5. Handle reservation expiry (410 Gone)
6. Navigate to `/booking/:bookingId/confirmation` on success

**Key Code**:

```tsx
import CountdownTimer from "../components/Rentals/CountdownTimer";
import { useBooking } from "../contexts/bookingContextCore";
import { processPayment } from "../services/bookingApi";

// Inside component:
const { booking } = useBooking();
const { bookingId } = useParams(); // Get from URL

// Add timer:
<CountdownTimer
  expiresAt={booking.reservationExpiresAt}
  onExpired={handleReservationExpired}
/>;

// Update payment handler:
const handlePayment = async () => {
  const response = await processPayment(bookingId, {
    paymentMethod: "CREDIT_CARD",
  });
  navigate(`/booking/${bookingId}/confirmation`);
};
```

---

### Task 7: Create ConfirmationPage.tsx

**File**: `src/pages/ConfirmationPage.tsx`

**Template**:

```tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingDetails } from "../services/bookingApi";
import { FaCheckCircle } from "react-icons/fa";

const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingId) {
      getBookingDetails(bookingId).then(setBooking);
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl text-center">
        <FaCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-2 text-3xl font-bold">Booking Confirmed!</h1>
        <p className="mb-6 text-gray-600">
          Your booking has been confirmed. Check your email for details.
        </p>

        {booking && (
          <div className="rounded-lg bg-white p-6 text-left shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Booking Details</h2>
            <p>
              <strong>Booking ID:</strong> {booking.bookingId}
            </p>
            <p>
              <strong>Vehicle:</strong> {booking.carModel.model}
            </p>
            <p>
              <strong>Total Paid:</strong> ${booking.totalAmount}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
```

---

### Task 9: Update BookingFlow.tsx

**File**: `src/pages/BookingFlow.tsx`

**Add routes**:

```tsx
import ReviewPage from "./ReviewPage";
import ConfirmationPage from "./ConfirmationPage";

// Add these routes:
<Route path="review" element={<ReviewPage />} />
<Route path=":bookingId/payment" element={<PaymentPage />} />
<Route path=":bookingId/confirmation" element={<ConfirmationPage />} />
```

---

### Task 10: Update DriverDetailsPage Navigation

**File**: `src/components/Rentals/DriverDetailsPage.tsx`

**Change**:

```tsx
// OLD:
navigate(`/booking/${carId}/payment`);

// NEW:
navigate(`/booking/${carId}/review`);
```

---

## 📝 Final Checklist

- [ ] Update PaymentPage with countdown timer and API integration
- [ ] Create ConfirmationPage
- [ ] Update BookingFlow routes
- [ ] Update DriverDetailsPage navigation to go to `/review`
- [ ] Test complete flow: Select Car → Add-ons → Driver Details → Review → Payment → Confirmation
- [ ] Test error scenarios:
  - [ ] Vehicle unavailable (409)
  - [ ] Reservation expired (410)
  - [ ] Payment declined (402)
- [ ] Enable BookingProvider in App.tsx (uncomment the wrapper)

---

## 🔗 Flow Summary

```
Step 1: /rentals
  ↓ (Select car)
Step 2: /booking/:carId/addons
  ↓ (Choose add-ons)
Step 3: /booking/:carId/driver-details
  ↓ (Enter driver info)
Step 4: /booking/:carId/review  ⭐ NEW
  ↓ (API: POST /bookings) → Reserve vehicle
Step 5: /booking/:bookingId/payment  ⭐ UPDATED
  ↓ (API: POST /bookings/:id/pay) → Process payment
Step 6: /booking/:bookingId/confirmation  ⭐ NEW
  ✅ Success!
```

---

## 🚀 Quick Commands

```bash
# Check for errors
npm run build

# Run development server
npm run dev
```

---

**Status**: 70% Complete
**Next Step**: Update PaymentPage.tsx with countdown timer
