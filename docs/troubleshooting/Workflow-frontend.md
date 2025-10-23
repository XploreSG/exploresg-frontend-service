# Frontend Booking Flow - Integration Guide

📋 **Version**: 1.0  
🎯 **Purpose**: Frontend implementation guide for three-phase booking process  
🔗 **Backend Services**: Booking Service, Payment Service, Fleet Service

---

## 📚 Table of Contents

1. [Current vs Recommended Flow](#current-vs-recommended-flow)
2. [Detailed Step-by-Step Flow](#detailed-step-by-step-flow)
3. [API Integration Points](#api-integration-points)
4. [State Management](#state-management)
5. [UI/UX Components](#uiux-components)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)

---

## 🔄 Current vs Recommended Flow

### Your Current Flow

```
┌─────────────────────────────────────────────────────────────┐
│ CURRENT FLOW (4 Steps)                                      │
└─────────────────────────────────────────────────────────────┘

Step 1: Select Car
   └─> User browses and selects vehicle

Step 2: Choose Add-ons
   └─> User selects insurance, GPS, child seat, etc.

Step 3: Fill Details
   └─> User enters driver details, contact info

Step 4: Payment & Complete Booking
   └─> User enters payment details
   └─> Click "Complete Booking"
   └─> ⚠️ PROBLEM: Vehicle might be taken during payment entry
```

### ✅ Recommended Flow (5 Steps)

```
┌─────────────────────────────────────────────────────────────┐
│ RECOMMENDED FLOW (5 Steps)                                  │
└─────────────────────────────────────────────────────────────┘

Step 1: Select Car
   └─> User browses and selects vehicle
   └─> Shows pricing, availability

Step 2: Choose Add-ons
   └─> User selects insurance, GPS, child seat, etc.
   └─> Shows updated total price

Step 3: Fill Details
   └─> User enters driver details, contact info, pickup/return locations
   └─> Validates all required fields

Step 4: Review & Reserve ⭐ NEW STEP
   └─> Show booking summary
   └─> User clicks "Reserve Vehicle"
   └─> API CALL: POST /api/v1/bookings (creates booking + reserves vehicle)
   └─> Backend: Vehicle locked for 30 seconds
   └─> Frontend: Navigate to payment page with countdown timer

Step 5: Payment (30-second window)
   └─> Show countdown timer: "Complete payment within 00:28"
   └─> User enters payment details
   └─> Click "Complete Payment"
   └─> API CALL: POST /api/v1/bookings/{id}/pay
   └─> Backend: Processes payment + confirms reservation
   └─> Frontend: Show success confirmation
```

---

## 📋 Detailed Step-by-Step Flow

### Step 1: Select Car (No API calls)

**Page**: `/rentals` or `/cars`

**User Actions**:

- Browse available vehicles
- Filter by date range, price, category
- Select a vehicle

**Frontend State**:

```typescript
interface SelectedCar {
  carModelPublicId: string;
  model: string;
  manufacturer: string;
  dailyRate: number;
  imageUrl: string;
  seats: number;
  transmission: string;
}

interface DateSelection {
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  returnLocation: string;
}
```

**Navigate to**: `/booking/add-ons` (Step 2)

---

### Step 2: Choose Add-ons (No API calls)

**Page**: `/booking/add-ons`

**User Actions**:

- Select collision damage waiver (CDW)
- Select optional add-ons:
  - GPS Navigation ($5/day)
  - Child Seat ($3/day)
  - Additional Driver ($10/day)
  - Roadside Assistance ($2/day)

**Frontend State**:

```typescript
interface AddOn {
  id: string;
  name: string;
  pricePerDay: number;
  selected: boolean;
}

interface BookingPricing {
  basePrice: number; // Daily rate × number of days
  addOnsTotal: number; // Sum of selected add-ons
  cdwPrice: number; // CDW price if selected
  totalPrice: number; // basePrice + addOnsTotal + cdwPrice
}
```

**UI Components**:

- ✅ Sidebar with running total
- ✅ Checkbox list for add-ons
- ✅ Price breakdown

**Navigate to**: `/booking/driver-details` (Step 3)

---

### Step 3: Fill Driver Details (No API calls)

**Page**: `/booking/driver-details`

**User Actions**:

- Enter driver information:
  - First Name, Last Name
  - Email, Phone Number
  - License Number
  - Date of Birth
  - License Expiry Date
- Confirm pickup/return locations
- Confirm pickup/return times

**Frontend State**:

```typescript
interface DriverDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  dateOfBirth: string;
  licenseExpiryDate: string;
}

interface BookingDetails {
  startDate: string; // ISO format
  endDate: string; // ISO format
  pickupLocation: string;
  returnLocation: string;
  pickupTime: string; // "10:00 AM"
  returnTime: string; // "06:00 PM"
}
```

**Validation**:

- ✅ Email format validation
- ✅ Phone number validation (Singapore: +65 XXXX XXXX)
- ✅ Age validation (must be 21+)
- ✅ License expiry validation (must be valid for 6+ months)

**Navigate to**: `/booking/review` (Step 4) ⭐ **NEW**

---

### Step 4: Review & Reserve ⭐ NEW STEP

**Page**: `/booking/review`

**Purpose**: Show complete booking summary and reserve vehicle BEFORE payment

**Display**:

```
┌─────────────────────────────────────────────────────────────┐
│                     Booking Summary                          │
└─────────────────────────────────────────────────────────────┘

Vehicle Details:
  • Toyota Camry (or whatever selected)
  • Automatic, 5 Seats, 3 Luggage
  • Pickup: Jan 1, 2025 at 10:00 AM
  • Return: Jan 5, 2025 at 6:00 PM
  • Duration: 5 days

Driver Details:
  • Name: John Doe
  • Email: john@example.com
  • Phone: +65 9123 4567
  • License: S1234567A

Add-ons:
  • GPS Navigation ($25.00)
  • Child Seat ($15.00)

Price Breakdown:
  • Base Rental (5 days × $50): $250.00
  • Add-ons: $40.00
  • CDW Insurance: $50.00
  ────────────────────────────────────
  • Total: $340.00

[Cancel]  [← Back]  [Reserve Vehicle →]
```

**User Action**: Click "Reserve Vehicle"

**API Call**:

```typescript
POST /api/v1/bookings
Authorization: Bearer <JWT>

Request Body:
{
  "carModelPublicId": "uuid-123",
  "startDate": "2025-01-01T10:00:00",
  "endDate": "2025-01-05T18:00:00",
  "pickupLocation": "Changi Airport",
  "returnLocation": "Changi Airport",
  "driverDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+65 9123 4567",
    "licenseNumber": "S1234567A"
  }
}

Response 201 Created:
{
  "bookingId": "uuid-456",
  "status": "PENDING_PAYMENT",
  "reservationExpiresAt": "2025-01-01T09:30:30", // 30 seconds from now
  "totalAmount": 340.00,
  "currency": "USD"
}
```

**Error Handling**:

**Scenario A: No vehicles available (409 Conflict)**

```typescript
Response 409 Conflict:
{
  "error": "NO_VEHICLES_AVAILABLE",
  "message": "No vehicles available for the requested dates"
}

Frontend Action:
→ Show error modal: "Sorry, this vehicle is no longer available. Please select another vehicle."
→ Navigate back to: /rentals
```

**Scenario B: Invalid dates (400 Bad Request)**

```typescript
Response 400 Bad Request:
{
  "error": "INVALID_DATE_RANGE",
  "message": "End date must be after start date",
  "fieldErrors": {
    "endDate": "Must be after start date"
  }
}

Frontend Action:
→ Show validation errors
→ Allow user to fix and retry
```

**Success**: Navigate to `/booking/${bookingId}/payment` (Step 5)

**Frontend State to Carry Forward**:

```typescript
interface BookingReservation {
  bookingId: string;
  reservationExpiresAt: string; // ISO timestamp
  totalAmount: number;
  selectedAddOns: AddOn[]; // For display on payment page
}
```

---

### Step 5: Payment (30-second window) ⭐ CRITICAL

**Page**: `/booking/${bookingId}/payment`

**UI Components**:

#### 1. Countdown Timer (Prominent Display)

```
┌─────────────────────────────────────────────────────────────┐
│  ⏰ Complete payment within: 00:27                          │
│  Your vehicle is reserved. Time remaining before expiry.    │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**:

```typescript
const [timeRemaining, setTimeRemaining] = useState<number>(30);

useEffect(() => {
  const expiresAt = new Date(bookingReservation.reservationExpiresAt);

  const timer = setInterval(() => {
    const now = new Date();
    const secondsLeft = Math.max(
      0,
      Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
    );

    setTimeRemaining(secondsLeft);

    if (secondsLeft === 0) {
      clearInterval(timer);
      // Show expiration modal
      handleReservationExpired();
    }
  }, 1000);

  return () => clearInterval(timer);
}, [bookingReservation.reservationExpiresAt]);

// Display format: MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
```

**Timer Colors** (Visual feedback):

- 🟢 Green: 30-15 seconds remaining
- 🟡 Yellow: 14-6 seconds remaining
- 🔴 Red: 5-0 seconds remaining (pulsing animation)

#### 2. Booking Summary (Right Sidebar)

```
┌─────────────────────────────────────┐
│     Booking Summary                  │
├─────────────────────────────────────┤
│ Toyota Camry                         │
│ Jan 1 - Jan 5, 2025                  │
│                                      │
│ Base Rental: $250.00                 │
│ Add-ons: $40.00                      │
│ CDW: $50.00                          │
│ ────────────────────                 │
│ Total: $340.00                       │
└─────────────────────────────────────┘
```

#### 3. Payment Form

**Option A: Use Mock Payment (Development)**

```
Payment Method: Credit Card ●

No actual card details needed for mock payment.
Click "Complete Payment" to simulate successful payment.

[Cancel]  [← Back]  [Complete Payment →]
```

**Option B: Real Payment (Production - Future)**

```
Payment Method: Credit Card ●

Card Number: [____-____-____-____]
Expiry: [MM] / [YY]   CVV: [___]
Cardholder Name: [________________]

🔒 Secure Payment - Your payment information is encrypted

[Cancel]  [← Back]  [Complete Payment →]
```

**User Action**: Click "Complete Payment"

**Frontend Processing**:

```typescript
const handlePayment = async () => {
  setIsProcessing(true);

  try {
    const response = await fetch(`/api/v1/bookings/${bookingId}/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod: "CREDIT_CARD",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      handlePaymentError(error);
      return;
    }

    const result = await response.json();

    // Success! Navigate to confirmation
    navigate(`/booking/${bookingId}/confirmation`, {
      state: { bookingDetails: result },
    });
  } catch (error) {
    console.error("Payment error:", error);
    setError("An unexpected error occurred. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
```

**API Call**:

```typescript
POST /api/v1/bookings/{bookingId}/pay
Authorization: Bearer <JWT>

Request Body:
{
  "paymentMethod": "CREDIT_CARD"
}

Response 200 OK:
{
  "bookingId": "uuid-456",
  "status": "PENDING_CONFIRMATION",
  "paymentId": "uuid-789",
  "message": "Payment processed successfully. Confirming booking..."
}
```

**Error Scenarios**:

**A. Reservation Expired (410 Gone)**

```typescript
Response 410 Gone:
{
  "error": "RESERVATION_EXPIRED",
  "message": "Vehicle reservation has expired. Please create a new booking."
}

Frontend Action:
→ Show modal: "Your reservation has expired. Please select the vehicle again."
→ Navigate to: /rentals
```

**B. Payment Declined (402 Payment Required)**

```typescript
Response 402 Payment Required:
{
  "error": "PAYMENT_DECLINED",
  "message": "Payment was declined. Please try a different payment method."
}

Frontend Action:
→ Show error message above payment form
→ Allow user to retry payment
→ Reservation still valid (within 30 seconds)
```

**C. Network Error / Timeout**

```typescript
Frontend Action:
→ Show error: "Connection lost. Please check your internet and try again."
→ Don't navigate away
→ Allow retry
→ Timer continues counting down
```

**Success**: Navigate to `/booking/${bookingId}/confirmation`

---

## 🎯 Final Step: Confirmation Page

**Page**: `/booking/${bookingId}/confirmation`

**Display**:

```
┌─────────────────────────────────────────────────────────────┐
│                  ✅ Booking Confirmed!                       │
└─────────────────────────────────────────────────────────────┘

Your booking has been confirmed. We've sent a confirmation
email to john@example.com.

Booking Details:
  • Booking ID: #ABC123
  • Vehicle: Toyota Camry
  • Pickup: Jan 1, 2025 at 10:00 AM
  • Return: Jan 5, 2025 at 6:00 PM
  • Total Paid: $340.00

Next Steps:
  ✓ Check your email for confirmation details
  ✓ Bring your driver's license on pickup day
  ✓ Arrive 15 minutes early for vehicle inspection

[View Booking Details]  [Return to Home]
```

---

## 🔌 API Integration Points

### Summary of All API Calls

| Step | Endpoint                                       | Method | Purpose                          | When                                |
| ---- | ---------------------------------------------- | ------ | -------------------------------- | ----------------------------------- |
| 0    | `/api/v1/fleet/models`                         | GET    | Get available cars               | On page load                        |
| 0    | `/api/v1/fleet/models/{id}/availability-count` | GET    | Check availability               | Optional, when user selects dates   |
| 4    | `/api/v1/bookings`                             | POST   | Create booking + reserve vehicle | When user clicks "Reserve Vehicle"  |
| 5    | `/api/v1/bookings/{id}/pay`                    | POST   | Process payment + confirm        | When user clicks "Complete Payment" |
| 6    | `/api/v1/bookings/{id}`                        | GET    | Get booking details              | On confirmation page                |

---

## 💾 State Management

### React Context / Redux State Structure

```typescript
interface BookingState {
  // Step 1: Car Selection
  selectedCar: {
    carModelPublicId: string;
    model: string;
    manufacturer: string;
    dailyRate: number;
    imageUrl: string;
    seats: number;
    transmission: string;
  } | null;

  // Step 1: Date Selection
  dateSelection: {
    startDate: Date | null;
    endDate: Date | null;
    pickupLocation: string;
    returnLocation: string;
  };

  // Step 2: Add-ons
  selectedAddOns: AddOn[];
  selectedCDW: boolean;

  // Step 3: Driver Details
  driverDetails: DriverDetails | null;

  // Step 4: Booking Reservation
  booking: {
    bookingId: string | null;
    status: string | null;
    reservationExpiresAt: string | null;
    totalAmount: number;
  } | null;

  // UI State
  currentStep: number;
  isLoading: boolean;
  error: string | null;
}
```

### Using React Context

```typescript
// BookingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  bookingState: BookingState;
  updateSelectedCar: (car: SelectedCar) => void;
  updateDateSelection: (dates: DateSelection) => void;
  updateAddOns: (addOns: AddOn[]) => void;
  updateDriverDetails: (details: DriverDetails) => void;
  updateBooking: (booking: BookingReservation) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingState, setBookingState] = useState<BookingState>(initialState);

  const updateSelectedCar = (car: SelectedCar) => {
    setBookingState(prev => ({ ...prev, selectedCar: car }));
  };

  // ... other update functions

  return (
    <BookingContext.Provider value={{ bookingState, updateSelectedCar, ... }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
```

### Usage in Components

```typescript
// ReviewPage.tsx
import { useBooking } from '../contexts/BookingContext';

const ReviewPage = () => {
  const { bookingState, updateBooking } = useBooking();

  const handleReserveVehicle = async () => {
    const response = await createBooking({
      carModelPublicId: bookingState.selectedCar.carModelPublicId,
      startDate: bookingState.dateSelection.startDate,
      endDate: bookingState.dateSelection.endDate,
      // ... other fields
    });

    updateBooking({
      bookingId: response.bookingId,
      status: response.status,
      reservationExpiresAt: response.reservationExpiresAt,
      totalAmount: response.totalAmount
    });

    navigate(`/booking/${response.bookingId}/payment`);
  };

  return (
    // ... UI
  );
};
```

---

## 🎨 UI/UX Components

### 1. Progress Stepper

```typescript
const BookingProgress = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, label: "Select Car", path: "/rentals" },
    { number: 2, label: "Add-ons", path: "/booking/add-ons" },
    { number: 3, label: "Driver Details", path: "/booking/driver-details" },
    { number: 4, label: "Review", path: "/booking/review" },
    { number: 5, label: "Payment", path: "/booking/:id/payment" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`flex items-center ${
              step.number === currentStep
                ? "text-blue-600"
                : step.number < currentStep
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                step.number === currentStep
                  ? "border-blue-600 bg-blue-50"
                  : step.number < currentStep
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              {step.number < currentStep ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </div>
            <span className="ml-2 font-medium">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                step.number < currentStep ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
```

### 2. Countdown Timer Component

```typescript
interface CountdownTimerProps {
  expiresAt: string;
  onExpired: () => void;
}

const CountdownTimer = ({ expiresAt, onExpired }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(30);

  useEffect(() => {
    const expiryDate = new Date(expiresAt);

    const timer = setInterval(() => {
      const now = new Date();
      const secondsLeft = Math.max(
        0,
        Math.floor((expiryDate.getTime() - now.getTime()) / 1000)
      );

      setTimeRemaining(secondsLeft);

      if (secondsLeft === 0) {
        clearInterval(timer);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 15) return "text-green-600";
    if (timeRemaining > 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        timeRemaining <= 5
          ? "border-red-600 bg-red-50 animate-pulse"
          : timeRemaining <= 15
          ? "border-yellow-600 bg-yellow-50"
          : "border-green-600 bg-green-50"
      }`}
    >
      <div className="flex items-center justify-center">
        <ClockIcon className={`w-6 h-6 mr-2 ${getTimerColor()}`} />
        <span className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Complete payment before your reservation expires
      </p>
    </div>
  );
};
```

### 3. Booking Summary Sidebar

```typescript
const BookingSummarySidebar = ({
  car,
  dates,
  addOns,
  pricing,
}: BookingSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

      {/* Car Details */}
      <div className="mb-4">
        <img
          src={car.imageUrl}
          alt={car.model}
          className="w-full rounded-lg mb-2"
        />
        <h4 className="font-semibold">{car.model}</h4>
        <p className="text-sm text-gray-600">{car.manufacturer}</p>
      </div>

      {/* Date Range */}
      <div className="mb-4 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-600">Pickup:</span>
          <span className="font-medium">{formatDate(dates.startDate)}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">Return:</span>
          <span className="font-medium">{formatDate(dates.endDate)}</span>
        </p>
        <p className="flex justify-between text-gray-600">
          <span>Duration:</span>
          <span>{calculateDays(dates.startDate, dates.endDate)} days</span>
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4">
        <p className="flex justify-between text-sm mb-2">
          <span>
            Base Rental ({calculateDays(dates.startDate, dates.endDate)} days)
          </span>
          <span>${pricing.basePrice.toFixed(2)}</span>
        </p>

        {addOns
          .filter((a) => a.selected)
          .map((addon) => (
            <p key={addon.id} className="flex justify-between text-sm mb-2">
              <span>{addon.name}</span>
              <span>
                $
                {addon.pricePerDay *
                  calculateDays(dates.startDate, dates.endDate)}
              </span>
            </p>
          ))}

        <div className="border-t pt-2 mt-2">
          <p className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${pricing.totalPrice.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
```

### 4. Error Modal

```typescript
const ReservationExpiredModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Reservation Expired</h2>
          <p className="text-gray-600 mb-6">
            Your vehicle reservation has expired. Please select a vehicle again
            to continue.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Return to Vehicle Selection
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## ⚠️ Error Handling

### Error Scenarios to Handle

| Error                 | HTTP Status          | When It Happens         | Frontend Action                  |
| --------------------- | -------------------- | ----------------------- | -------------------------------- |
| No Vehicles Available | 409 Conflict         | Step 4: Reserve Vehicle | Show modal, navigate to /rentals |
| Invalid Date Range    | 400 Bad Request      | Step 4: Reserve Vehicle | Show validation errors           |
| Reservation Expired   | 410 Gone             | Step 5: Payment         | Show modal, navigate to /rentals |
| Payment Declined      | 402 Payment Required | Step 5: Payment         | Show error, allow retry          |
| Network Error         | N/A                  | Any API call            | Show error, allow retry          |
| Unauthorized          | 401                  | Any API call            | Redirect to login                |

### Error Handling Implementation

```typescript
const handleApiError = (error: any, navigate: NavigateFunction) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        navigate("/login");
        break;

      case 409:
        // No vehicles available
        showErrorModal({
          title: "Vehicle Unavailable",
          message: data.message || "This vehicle is no longer available.",
          action: () => navigate("/rentals"),
        });
        break;

      case 410:
        // Reservation expired
        showErrorModal({
          title: "Reservation Expired",
          message:
            data.message || "Your reservation has expired. Please try again.",
          action: () => navigate("/rentals"),
        });
        break;

      case 402:
        // Payment declined
        showError(data.message || "Payment declined. Please try again.");
        break;

      default:
        showError("An unexpected error occurred. Please try again.");
    }
  } else {
    // Network error
    showError("Connection lost. Please check your internet and try again.");
  }
};
```

---

## 📱 Mobile Responsiveness

### Key Considerations

1. **Progress Stepper**:

   - Desktop: Horizontal with labels
   - Mobile: Vertical or compact horizontal (just numbers)

2. **Booking Summary Sidebar**:

   - Desktop: Fixed sidebar on right
   - Mobile: Collapsible accordion or fixed bottom bar

3. **Countdown Timer**:

   - Desktop: Prominent top banner
   - Mobile: Fixed top bar (doesn't scroll away)

4. **Payment Form**:
   - Desktop: Two-column layout
   - Mobile: Single column, larger touch targets

---

## 🎯 Success Criteria

✅ **Vehicle reserved BEFORE payment** (no race conditions)  
✅ **30-second countdown timer** visible during payment  
✅ **Clear error messages** for all failure scenarios  
✅ **Smooth navigation** between steps with state persistence  
✅ **Responsive design** works on mobile and desktop  
✅ **Reservation expiry handling** with user-friendly modals  
✅ **Loading states** for all async operations  
✅ **Form validation** before proceeding to next step

---

## 📝 Implementation Checklist

### Step 1: Update Routing

- [ ] Add `/booking/review` route
- [ ] Add `/booking/:id/payment` route (with dynamic bookingId)
- [ ] Add `/booking/:id/confirmation` route
- [ ] Update existing routes to match new flow

### Step 2: Create New Components

- [ ] `ReviewPage.tsx` - Step 4: Review & Reserve
- [ ] `PaymentPage.tsx` - Step 5: Payment with timer
- [ ] `ConfirmationPage.tsx` - Success page
- [ ] `CountdownTimer.tsx` - Reusable timer component
- [ ] `ReservationExpiredModal.tsx` - Error modal

### Step 3: Update Existing Components

- [ ] Update `BookingProgress` to show 5 steps instead of 4
- [ ] Update `DriverDetailsPage` to navigate to `/booking/review`
- [ ] Update `BookingSummarySidebar` to handle new state

### Step 4: Implement State Management

- [ ] Create `BookingContext.tsx` or Redux slice
- [ ] Add booking reservation state
- [ ] Add countdown timer state
- [ ] Add error state

### Step 5: Integrate APIs

- [ ] Create `bookingApi.ts` service
- [ ] Implement `createBooking()` function
- [ ] Implement `processPayment()` function
- [ ] Add error handling

### Step 6: Testing

- [ ] Test happy path (successful booking)
- [ ] Test reservation expiry scenario
- [ ] Test no vehicles available scenario
- [ ] Test payment declined scenario
- [ ] Test network error handling
- [ ] Test mobile responsiveness

---

## 🚀 Quick Start Code Example

```typescript
// bookingApi.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createBooking = async (bookingData: CreateBookingRequest) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/bookings`,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }
  );

  return response.data;
};

export const processPayment = async (bookingId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/bookings/${bookingId}/pay`,
    { paymentMethod: "CREDIT_CARD" },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }
  );

  return response.data;
};
```

---

**Document Version**: 1.0  
**Last Updated**: October 17, 2025  
**Status**: ✅ Ready for Implementation
