# Backend Bug: NullPointerException on Repeat Sign-in

## 🐛 **Issue Description**

When a user signs up using the minimal signup flow (empty body `{}`), the backend successfully creates a user with only the email field populated. However, when the same user tries to sign in again, the backend throws a `NullPointerException`:

```
Cannot invoke "java.time.LocalDate.toString()" because the return value of
"com.exploresg.authservice.model.UserProfile.getDateOfBirth()" is null
```

## 📍 **Root Cause**

The backend's `UserProfile` model or DTO is trying to call `.toString()` on the `dateOfBirth` field without null-checking:

```java
// ❌ Backend code (causing the error)
public String getDateOfBirthString() {
    return dateOfBirth.toString(); // NullPointerException when dateOfBirth is null
}
```

## 🔧 **Backend Fix Required**

### **Option 1: Null-Safe Conversion (Recommended)**

```java
public String getDateOfBirthString() {
    return dateOfBirth != null ? dateOfBirth.toString() : null;
}
```

### **Option 2: Use @JsonInclude**

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
private LocalDate dateOfBirth;
```

### **Option 3: DTO Mapping with Null Handling**

```java
// In UserProfileDTO or UserProfileResponse
public static UserProfileResponse fromEntity(UserProfile profile) {
    return UserProfileResponse.builder()
        .userId(profile.getUserId())
        .email(profile.getEmail())
        .firstName(profile.getFirstName())
        .lastName(profile.getLastName())
        .phone(profile.getPhone())
        .dateOfBirth(profile.getDateOfBirth() != null ? profile.getDateOfBirth().toString() : null)
        // ... other fields
        .build();
}
```

## 🎯 **Where to Apply the Fix**

Check these backend files:

1. **UserProfile.java** (entity/model)
   - Add `@JsonInclude(JsonInclude.Include.NON_NULL)` to `dateOfBirth` field
2. **UserProfileResponse.java** (DTO)
   - Add null-checking in any getter that calls `.toString()` on `dateOfBirth`
3. **UserProfileMapper.java** (if exists)
   - Add null-safe mapping: `dateOfBirth != null ? dateOfBirth.toString() : null`

## 🧪 **Testing Scenario**

1. **New User Minimal Signup:**

   ```bash
   POST /api/v1/signup
   Authorization: Bearer <JWT>
   Body: {}
   ```

   ✅ Should succeed

2. **Same User Sign-in Again:**

   ```bash
   POST /api/v1/auth/google
   Body: { "token": "<Google OAuth Token>" }
   ```

   ❌ Currently fails with NullPointerException
   ✅ Should succeed after fix

3. **Fetch User Profile:**
   ```bash
   GET /api/v1/user/profile
   Authorization: Bearer <JWT>
   ```
   ❌ Currently fails if user has null dateOfBirth
   ✅ Should return profile with null fields after fix

## 📋 **Expected Backend Response After Fix**

```json
{
  "userId": "uuid-123",
  "email": "user@gmail.com",
  "firstName": null,
  "lastName": null,
  "phone": null,
  "dateOfBirth": null,
  "drivingLicenseNumber": null,
  "licenseIssueDate": null,
  "licenseExpiryDate": null,
  "address": null,
  "city": null,
  "postalCode": null,
  "createdAt": "2025-10-18T10:00:00Z",
  "updatedAt": "2025-10-18T10:00:00Z"
}
```

## 🚀 **Frontend Workaround (Temporary)**

While waiting for the backend fix, the frontend already handles null values gracefully:

```typescript
// ✅ Frontend already handles null dateOfBirth
const formData: SignupDetails = {
  firstName: user?.givenName || "",
  lastName: user?.familyName || "",
  email: user?.email || "",
  phone: "",
  dateOfBirth: "", // ← Empty string for null
  // ...
};
```

```tsx
// ✅ Profile page also handles null
{
  user.dateOfBirth || "Not provided";
}
```

## ⚠️ **Impact**

- **Severity**: HIGH (blocks users from signing in after minimal signup)
- **Affected Users**: All users who sign up with the minimal flow
- **Workaround**: None - backend fix required

## 📝 **Next Steps**

1. ✅ Document the issue (this file)
2. ✅ Report to backend team
3. ✅ Backend team applies null-safe handling
4. ✅ Test the fix
5. ⏳ Deploy to production

---

## ✅ **RESOLUTION**

**Fixed**: October 18, 2025

**File**: `AuthenticationService.java` (line 41)

**Change Applied**:

```java
// ❌ BEFORE (NullPointerException)
.dateOfBirth(userProfile != null ? userProfile.getDateOfBirth().toString() : null)

// ✅ AFTER (Null-safe)
.dateOfBirth(userProfile != null && userProfile.getDateOfBirth() != null
        ? userProfile.getDateOfBirth().toString()
        : null)
```

**Fix Type**: Option 1 - Null-Safe Conversion (double null-check)

**Testing Status**: ✅ Verified working

- Users can sign up with minimal signup (empty body)
- Users can sign in again without NullPointerException
- Profile returns null for unprovided fields
- Driver details collected during first booking

**Deployment**: Ready for production after rebuild

---

**Reported**: October 18, 2025  
**Resolved**: October 18, 2025  
**Status**: ✅ **FIXED**
