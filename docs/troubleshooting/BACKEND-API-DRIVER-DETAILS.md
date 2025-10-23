# Backend API Integration - Driver Details

📋 **Purpose**: Document the actual backend API contract for driver details management  
📅 **Updated**: October 18, 2025

---

## 🎯 **Backend API Design Philosophy**

The backend uses a **PATCH-style** signup endpoint that supports **progressive profile completion**:

1. ✅ Initial signup with empty body (minimal onboarding)
2. ✅ Add details later via same endpoint (during booking)
3. ✅ Fetch complete profile anytime

---

## 📡 **API Endpoints**

### **1. POST /api/v1/signup** (Create/Update Profile)

**Purpose:** Creates new user OR updates existing user profile (idempotent)

**Use Cases:**

- Initial signup with empty body `{}`
- Add driver details during first booking
- Update profile information later

#### **Request Examples**

**Initial Signup (Minimal):**

```bash
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Authorization: Bearer <JWT from Google OAuth>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Add Driver Details (During Booking):**

```bash
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "91234567",
    "dateOfBirth": "1990-01-01",
    "drivingLicenseNumber": "S1234567A",
    "licenseExpiryDate": "2025-12-31",
    "address": "123 Orchard Road",
    "city": "Singapore",
    "postalCode": "238858"
  }'
```

#### **Request Body Schema**

All fields are **optional** - send only what you want to update:

```typescript
{
  firstName?: string;
  lastName?: string;
  phone?: string;              // e.g., "91234567"
  dateOfBirth?: string;        // ISO format "1990-01-01"
  drivingLicenseNumber?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  licenseCountry?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  drivingExperience?: string;  // e.g., "3+"
  passportNumber?: string;
  preferredLanguage?: string;
  countryOfResidence?: string;
}
```

#### **Response**

```json
{
  "userId": "uuid-123",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "91234567",
  "dateOfBirth": "1990-01-01",
  "drivingLicenseNumber": "S1234567A",
  "licenseIssueDate": "2015-06-15",
  "licenseExpiryDate": "2025-12-31",
  "licenseCountry": "Singapore",
  "address": "123 Orchard Road",
  "city": "Singapore",
  "postalCode": "238858",
  "country": "Singapore",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "87654321",
  "drivingExperience": "3+",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2025-10-18T12:30:00Z"
}
```

---

### **2. GET /api/v1/user/profile** (Fetch Profile)

**Purpose:** Retrieve current user's profile data

**Request:**

```bash
curl -X GET http://localhost:8080/api/v1/user/profile \
  -H "Authorization: Bearer <JWT>"
```

**Response:** Same format as POST /signup response above

---

## 🔄 **Frontend Integration**

### **File: src/services/userApi.ts**

```typescript
/**
 * Update user profile with driver details
 * Uses SIGNUP endpoint as per backend design
 */
export const updateUserProfile = async (profileData: UpdateProfileRequest) => {
  const jwtToken = localStorage.getItem("jwtToken");

  const response = await fetch(API_ENDPOINTS.USER.SIGNUP, {
    method: "POST", // ← Note: POST, not PUT
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  return await response.json();
};
```

---

## 📊 **Complete User Flow**

### **Step-by-Step Integration**

```
┌──────────────────────────────────────────────────────────┐
│ 1. USER SIGNS IN WITH GOOGLE OAUTH                      │
└──────────────────────────────────────────────────────────┘
                    ↓
        Frontend receives JWT token
                    ↓
┌──────────────────────────────────────────────────────────┐
│ 2. MINIMAL SIGNUP                                        │
│    POST /api/v1/signup                                   │
│    Body: {}                                              │
└──────────────────────────────────────────────────────────┘
                    ↓
        User created with email from JWT
        (No other details required)
                    ↓
┌──────────────────────────────────────────────────────────┐
│ 3. USER BROWSES CARS & SELECTS VEHICLE                  │
└──────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────┐
│ 4. USER LANDS ON DRIVER DETAILS PAGE                    │
│    GET /api/v1/user/profile                             │
└──────────────────────────────────────────────────────────┘
                    ↓
        If profile has data → Pre-fill form
        If empty → Show empty form
                    ↓
┌──────────────────────────────────────────────────────────┐
│ 5. USER FILLS DRIVER DETAILS                            │
│    - Checks "Save for future bookings" ✓                │
│    - Clicks "Continue to Review"                        │
└──────────────────────────────────────────────────────────┘
                    ↓
        If checkbox checked:
┌──────────────────────────────────────────────────────────┐
│ 6. SAVE TO PROFILE                                       │
│    POST /api/v1/signup                                   │
│    Body: { driver details }                             │
└──────────────────────────────────────────────────────────┘
                    ↓
        Profile saved for future use
                    ↓
┌──────────────────────────────────────────────────────────┐
│ 7. CONTINUE WITH BOOKING FLOW                           │
│    → Review Page → Payment → Confirmation               │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 **Key Implementation Notes**

### **1. Idempotent Updates**

- ✅ Can call `/signup` multiple times
- ✅ Only provided fields are updated
- ✅ Existing fields remain unchanged

### **2. Minimal Required Fields**

- ✅ Initial signup: No fields required (empty body)
- ✅ Booking: Only fields needed for rental (phone, license, etc.)
- ✅ Optional fields can be added anytime

### **3. Progressive Enhancement**

```typescript
// First booking
POST /signup { phone, dateOfBirth, drivingLicenseNumber }

// Later, user adds emergency contact
POST /signup { emergencyContactName, emergencyContactPhone }

// All data is preserved and merged
```

---

## 🧪 **Testing with cURL**

### **Test 1: New User Signup**

```bash
# Get JWT from Google OAuth first
JWT="your-jwt-token-here"

# Create minimal profile
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return user with just email
```

### **Test 2: Add Driver Details**

```bash
# Add details during booking
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "91234567",
    "dateOfBirth": "1990-01-01",
    "drivingLicenseNumber": "S1234567A"
  }'

# Should return full profile with new fields
```

### **Test 3: Fetch Profile**

```bash
# Retrieve saved profile
curl -X GET http://localhost:8080/api/v1/user/profile \
  -H "Authorization: Bearer $JWT"

# Should return all saved data
```

### **Test 4: Update Specific Field**

```bash
# Update just phone number
curl -X POST http://localhost:8080/api/v1/signup \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "98765432"
  }'

# Other fields remain unchanged
```

---

## ✅ **Implementation Checklist**

- [x] Update `userApi.ts` to use `/signup` endpoint for updates
- [x] Change HTTP method from PUT to POST
- [x] Keep GET `/user/profile` for fetching
- [x] Handle optional fields (all fields are optional)
- [x] Document actual backend API contract
- [x] Test with backend server

---

**Last Updated**: October 18, 2025  
**Status**: ✅ Aligned with Backend API
