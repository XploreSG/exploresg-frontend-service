# Summary of AuthContext User ID Fixes

This document summarizes the changes made on October 7, 2025, to resolve an issue where the `userId` was being incorrectly handled as an integer instead of a UUID string from the JWT.

## Problem Description

The application state was showing `userId` as an integer (e.g., `1`) instead of the UUID provided in the JSON Web Token (JWT). This was caused by two main issues:

1.  An incorrect default value for `userId` in the `AuthContext` state merging logic.
2.  The `login` function was not prioritizing the `userId` from the JWT when a user session was initiated, allowing an incorrect initial value to persist.

## Changes Implemented

### 1. Corrected Default `userId` in State Merging

The default `userId` in the `useEffect` hook responsible for merging user data was changed from an integer (`0`) to an empty string (`""`). This ensures type consistency and prevents the fallback to a number.

**File:** `src/contexts/AuthContext.tsx`

**Before:**

```typescript
// ...
        const merged = {
          // ...
          userId: prev?.userId ?? tokenUser.userId ?? 0,
// ...
```

**After:**

```typescript
// ...
        const merged = {
          // ...
          userId: prev?.userId ?? tokenUser.userId ?? "",
// ...
```

### 2. Updated `login` Function to Prioritize JWT `userId`

The `login` function was modified to immediately decode the JWT upon login. If a `userId` is present in the token, it now overwrites any `userId` that might have been passed in the initial `user` object. This ensures the UUID from the token is always the source of truth for the session.

**File:** `src/contexts/AuthContext.tsx`

**Before:**

```typescript
// ...
const login = useCallback((user: UserInfo, token?: string | null) => {
  setUser(user);
  localStorage.setItem("user", JSON.stringify(user));

  if (token) {
    setToken(token);
    localStorage.setItem("token", token);
  }
}, []);
// ...
```

**After:**

```typescript
// ...
const login = useCallback((user: UserInfo, token?: string | null) => {
  const finalUser = { ...user };

  if (token) {
    try {
      const decoded = decodeJWT(token);
      if (decoded && decoded.userId) {
        finalUser.userId = decoded.userId;
      }
    } catch {
      // Ignore decode errors, proceed with the user object as is
    }
    setToken(token);
    localStorage.setItem("token", token);
  }

  setUser(finalUser);
  localStorage.setItem("user", JSON.stringify(finalUser));
}, []);
// ...
```
