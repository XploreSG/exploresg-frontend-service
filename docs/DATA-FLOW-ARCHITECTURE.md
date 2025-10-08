# Data Flow Architecture - Fleet Manager Brand Identity

## Overview

This document explains where data is stored and how it flows through the application for the Fleet Manager brand identity feature.

---

## Data Storage Layers

### 1. **Static Configuration** (`rental.ts`)

**Location**: `src/types/rental.ts`

**Purpose**: Static mapping of UUIDs to operator information

```typescript
export const OPERATOR_CONFIG: Record<
  string,
  { name: string; id: number; styling: OperatorStyling }
> = {
  "92f04715-b828-4fc0-9013-81c3b468fcf1": {
    name: "Hertz",
    id: 102,
    styling: {
      brand: "text-yellow-600 bg-gray-200",
      background: "bg-black bg-blend-overlay bg-yellow-900/60",
    },
  },
  // ... other operators
};
```

**Storage Type**: Hard-coded configuration  
**Access**: Direct import  
**Persistence**: Code-level (not runtime)

---

### 2. **User Authentication Data** (React Context + localStorage)

#### **AuthContext Provider**

**Location**: `src/contexts/AuthContext.tsx`

**Purpose**: Manages user authentication state across the app

**Storage Mechanism**:

```typescript
// React State
const [user, setUser] = useState<UserInfo | null>(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});

const [token, setToken] = useState<string | null>(
  () => localStorage.getItem("token") || null,
);
```

**Storage Layers**:

1. **Browser localStorage** (persistent across sessions)
   - Key: `"user"` - Stores user object with userId
   - Key: `"token"` - Stores JWT token

2. **React Context State** (runtime, in-memory)
   - Provides user data to all child components
   - Automatically syncs with localStorage

**Data Structure**:

```typescript
interface UserInfo {
  userId: number | string; // ← This is the UUID we use!
  email: string;
  givenName: string;
  familyName: string;
  picture?: string;
  // ... other fields
}
```

---

### 3. **useAuth Hook** (Custom Hook)

**Location**: `src/contexts/useAuth.ts`

**Purpose**: Provides easy access to AuthContext

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

**Returns**:

- `user` - User object with userId
- `token` - JWT token
- `login()` - Function to log in
- `logout()` - Function to log out
- `primaryRole` - User's primary role
- `hasRole()` - Function to check roles

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION START                            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. User Logs In (Backend Authentication)                           │
│     ↓                                                                │
│  Backend sends JWT token with userId in payload                     │
│     {                                                                │
│       "userId": "92f04715-b828-4fc0-9013-81c3b468fcf1",            │
│       "roles": ["ROLE_FLEET_MANAGER"],                             │
│       "givenName": "reshma",                                        │
│       "familyName": "rajendran"                                     │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. AuthProvider.login() Called                                      │
│     ↓                                                                │
│  • Decodes JWT token                                                │
│  • Extracts userId from token                                       │
│  • Stores in React State: setUser(userObject)                      │
│  • Stores in localStorage: localStorage.setItem("user", ...)       │
│  • Stores token: localStorage.setItem("token", ...)                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. Component Mounts (Navbar or Dashboard)                           │
│     ↓                                                                │
│  const { user, hasRole } = useAuth();                               │
│     ↓                                                                │
│  AuthContext provides:                                              │
│     {                                                                │
│       user: {                                                        │
│         userId: "92f04715-b828-4fc0-9013-81c3b468fcf1",           │
│         email: "reshmarmec@gmail.com",                             │
│         givenName: "reshma",                                        │
│         familyName: "rajendran"                                     │
│       },                                                             │
│       primaryRole: "FLEET_MANAGER"                                  │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. Get Operator Info (Component Logic)                              │
│     ↓                                                                │
│  const operatorInfo = useMemo(() => {                               │
│    return hasRole("FLEET_MANAGER")                                  │
│      ? getOperatorInfoFromUserId(user?.userId)                      │
│      : null;                                                         │
│  }, [hasRole, user?.userId]);                                       │
│     ↓                                                                │
│  Calls utility function:                                            │
│  getOperatorInfoFromUserId("92f04715-b828-4fc0-9013-81c3b468fcf1") │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. Lookup in OPERATOR_CONFIG (rental.ts)                           │
│     ↓                                                                │
│  const config = OPERATOR_CONFIG[userId];                            │
│     ↓                                                                │
│  Returns:                                                            │
│     {                                                                │
│       name: "Hertz",                                                │
│       id: 102,                                                       │
│       styling: {                                                     │
│         brand: "text-yellow-600 bg-gray-200",                       │
│         background: "bg-black bg-blend-overlay bg-yellow-900/60"   │
│       }                                                              │
│     }                                                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  6. Render with Brand Styling                                        │
│     ↓                                                                │
│  <div className={`... ${operatorInfo.styling.brand}`}>             │
│    {operatorInfo.name}                                              │
│  </div>                                                              │
│     ↓                                                                │
│  Renders: [Hertz] badge with yellow colors                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Storage Summary Table

| Data Type           | Storage Location             | Persistence       | Access Method                 |
| ------------------- | ---------------------------- | ----------------- | ----------------------------- |
| **Operator Config** | `rental.ts` (static)         | Permanent (code)  | Direct import                 |
| **User Object**     | `localStorage` + React State | Session + Browser | `useAuth()` hook              |
| **JWT Token**       | `localStorage` + React State | Session + Browser | `useAuth()` hook              |
| **Primary Role**    | Computed from token          | Runtime only      | `useAuth()` hook              |
| **Operator Info**   | Computed from userId         | Runtime only      | `getOperatorInfoFromUserId()` |

---

## Key Points

### ✅ **NOT a Hook** - It's a Context Provider

The data is stored in a **React Context Provider** (`AuthProvider`), not just a hook. The `useAuth()` hook is just an accessor.

### ✅ **Dual Storage**

- **localStorage**: Persists across browser sessions
- **React State**: For reactive UI updates

### ✅ **Lookup Pattern**

```
User logs in
  → userId stored in AuthContext
    → Component uses useAuth() to get userId
      → getOperatorInfoFromUserId(userId) looks up OPERATOR_CONFIG
        → Returns operator info with brand styling
```

### ✅ **No Database Calls**

- Operator configuration is **static** (hardcoded)
- User data comes from **JWT token** (from backend)
- No additional API calls needed for brand info

---

## Component Usage Examples

### In Navbar.tsx:

```typescript
const { user, hasRole } = useAuth();  // ← Get user from Context

const operatorInfo = useMemo(() => {
  return hasRole("FLEET_MANAGER")
    ? getOperatorInfoFromUserId(user?.userId)  // ← Look up by userId
    : null;
}, [hasRole, user?.userId]);

// Render with brand styling
{operatorInfo && (
  <div className={operatorInfo.styling.brand}>
    {operatorInfo.name}
  </div>
)}
```

### In FleetAdminDashboardPage.tsx:

```typescript
const { user, hasRole } = useAuth();  // ← Same pattern

const operatorInfo = hasRole("FLEET_MANAGER")
  ? getOperatorInfoFromUserId(user?.userId)  // ← Look up by userId
  : null;

// Use in UI
<h1>{operatorInfo?.name} Fleet Manager Dashboard</h1>
```

---

## Architecture Benefits

1. **Separation of Concerns**
   - Auth logic in Context
   - Operator config in types
   - UI in components

2. **Single Source of Truth**
   - User data from AuthContext
   - Operator config from OPERATOR_CONFIG

3. **No Prop Drilling**
   - Any component can access user via `useAuth()`

4. **Performance**
   - useMemo prevents unnecessary lookups
   - localStorage caches user data

5. **Type Safety**
   - Full TypeScript support
   - Type checking at compile time

---

## Debugging Tips

### Check localStorage:

```javascript
// In browser console
localStorage.getItem("user");
localStorage.getItem("token");
```

### Check Context Value:

```typescript
// In component
const auth = useAuth();
console.log("User:", auth.user);
console.log("Role:", auth.primaryRole);
```

### Check Operator Lookup:

```typescript
// In component
const operatorInfo = getOperatorInfoFromUserId(user?.userId);
console.log("Operator Info:", operatorInfo);
```
