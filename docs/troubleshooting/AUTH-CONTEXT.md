# Auth Context Usage Guide

## Overview

The Auth Context provides a global authentication state for your React application. It stores the current user and authentication token (such as a Google SSO token) and exposes methods to log in and log out. This allows any component in the app to access authentication information and perform authentication actions.

## How It Works

- **State Management:**
  - Stores `user` (string or null) and `token` (string or null) in React state and persists them in `localStorage`.
  - On login, both `user` and `token` are set and saved.
  - On logout, both are cleared from state and `localStorage`.
- **Context Provider:**
  - The `AuthProvider` wraps your app and provides the context value (`user`, `token`, `login`, `logout`) to all child components.
- **Accessing Auth State:**
  - Use the `useAuth()` hook to access the current user, token, and auth methods from any component.

## API

### Context Value

- `user: string | null` — The current user's identifier (e.g., email or username).
- `token: string | null` — The authentication token (e.g., Google SSO ID token).
- `login(user: string, token?: string | null): void` — Logs in a user and optionally sets the token.
- `logout(): void` — Logs out the user and clears the token.

### Example Usage

#### 1. Wrapping your app

```tsx
import { AuthProvider } from "./contexts/AuthContext";

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

#### 2. Accessing Auth State in a Component

```tsx
import { useAuth } from "./contexts/useAuth";

function Profile() {
  const { user, token, logout } = useAuth();
  return (
    <div>
      <p>User: {user}</p>
      <p>Token: {token}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### 3. Logging in with Google SSO

```tsx
// In your sign-in page:
<GoogleLogin
  onSuccess={(credentialResponse) => {
    const idToken = credentialResponse.credential;
    login("google-user", idToken ?? undefined);
    navigate("/yourday");
  }}
  onError={() => {
    // handle error
  }}
/>
```

## Best Practices

- Always use the `useAuth()` hook to access or update authentication state.
- Store only non-sensitive user info in `user`; keep sensitive data in `token` or backend.
- Use the `token` for authenticated API requests.
- Call `logout()` to clear all authentication data on sign out.

## File Locations

- Context definition: `src/contexts/AuthContextInstance.ts`
- Provider implementation: `src/contexts/AuthContext.tsx`
- Hook: `src/contexts/useAuth.ts`

---

This document describes the current implementation as of September 2025.
