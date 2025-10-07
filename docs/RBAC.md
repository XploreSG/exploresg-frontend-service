# RBAC Documentation

## 1. Role Normalization and Access Utility (Refactoring) 🛠️

Since the roles are present in the JWT as an array (e.g., `["ROLE_USER"]`) and already extracted by `getUserRole`, the next step is to create a clean, accessible method for checking permissions.

### A. Define Available Roles

First, define all possible roles in a central location, potentially in `src/types/auth.ts` (if you create one) or directly in `src/contexts/AuthContextInstance.ts`.

```typescript
// src/contexts/AuthContextInstance.ts (Enhancement)

// Add all roles supported by your backend
export type AppRole =
  | "USER"
  | "FLEET_MANAGER"
  | "MANAGER"
  | "SUPPORT"
  | "ADMIN"
  | "ROLE_USER"; // Including the default extracted role

export interface UserInfo {
  // ... existing fields
  // Add an array of normalized roles if needed, though single role extraction is done by getUserRole
}

// ... existing AuthContextType definition
```

### B. Enhance `useAuth` for Role Checking

Modify your `useAuth` hook (or the `AuthContext` provider itself in `src/contexts/AuthContext.tsx`) to directly expose a method to check if the user has a specific role.

**Recommended changes for `src/contexts/AuthContext.tsx`:**

1.  Import `getUserRole` from `../utils/jwtUtils`.
2.  Memoize the extracted role string.
3.  Add a `hasRole` function to check permissions.

<!-- end list -->

```typescript
// src/contexts/AuthContext.tsx (Recommended Addition)

// ... inside AuthProvider
const { user, token, login, logout } = useAuthLogic(); // assuming you extract the logic into a custom hook

// 1. Memoize the current primary role
const primaryRole = useMemo(() => {
  // getUserRole already handles extraction from the token
  const role = getUserRole(token);
  // Normalize and return the role (e.g., remove "ROLE_" prefix if needed)
  return role ? role.replace("ROLE_", "").toUpperCase() : "GUEST";
}, [token]);

// 2. Create a utility function to check roles
const hasRole = useCallback(
  (requiredRoles: string | string[]): boolean => {
    if (!token) return false;
    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    // This is simplified: production code should check all roles from the token
    return roles.includes(primaryRole);
  },
  [token, primaryRole],
);

const contextValue = useMemo(
  () => ({
    user,
    token,
    login,
    logout,
    primaryRole, // <-- Expose the primary role string
    hasRole, // <-- Expose the role checking utility
  }),
  [user, token, login, logout, primaryRole, hasRole],
);

// return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
```

---

## 2\. Role-Based Page Access Control (Routing) 🔒

This involves creating a wrapper component that uses the `hasRole` utility to decide whether to render the requested component, redirect, or show an error.

### A. Create a `ProtectedRoleRoute` Component

Create a new file, perhaps `src/components/Auth/ProtectedRoleRoute.tsx`.

```tsx
// src/components/Auth/ProtectedRoleRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

interface ProtectedRouteProps {
  // Roles allowed to view this route. Example: ["ADMIN", "FLEET_MANAGER"]
  allowedRoles?: string[];
  // Path to redirect if user is authenticated but unauthorized
  redirectTo?: string;
  // Path to redirect if user is not authenticated at all
  loginPath?: string;
}

const ProtectedRoleRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/access-denied", // Create an access-denied page
  loginPath = "/login",
}) => {
  const { user, primaryRole } = useAuth(); // Assume primaryRole is exposed by useAuth

  if (!user) {
    // 1. Not authenticated: Redirect to login page
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(primaryRole)) {
    // 2. Authenticated but unauthorized role: Redirect to access denied page
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Authenticated and authorized: Render the child routes/page
  return <Outlet />;
};

export default ProtectedRoleRoute;
```

### B. Implement RBAC in `src/App.tsx`

Use the new component to wrap protected routes.

```tsx
// src/App.tsx (Example usage)
import ProtectedRoleRoute from "./components/Auth/ProtectedRoleRoute";
import FleetManagerDashboard from "./pages/FleetManagerDashboard"; // Hypothetical page
import AdminConsole from "./pages/AdminConsole"; // Hypothetical page
// ... other imports

const App = () => {
  return (
    <Router>
      {/* ... Navbar, RoleBanner ... */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/rentals" element={<FleetPage />} />

        {/* Protected Routes - Only for logged-in users (all roles) */}
        <Route element={<ProtectedRoleRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/yourday" element={<YourDayPage />} />
          <Route path="/booking/:carId/*" element={<BookingFlow />} /> //
          Booking flow only for logged-in
        </Route>

        {/* Role-Specific Routes (Admin and Fleet Manager) */}
        <Route
          element={<ProtectedRoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}
        >
          <Route
            path="/manager/dashboard"
            element={<FleetManagerDashboard />}
          />
        </Route>

        {/* Role-Specific Routes (Admin only) */}
        <Route element={<ProtectedRoleRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/console" element={<AdminConsole />} />
        </Route>

        {/* Fallback route for unauthorized access */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />
      </Routes>
      {/* ... Footer ... */}
    </Router>
  );
};
```

---

## 3\. Role-Specific Theming and Layouts 🎨

To change the theme or layout based on the user's role, you can use the `primaryRole` exposed by `useAuth` and leverage **CSS variables** or **dynamic Tailwind classes**.

### A. Dynamic Root Class (Recommended)

Wrap your main layout component (or `App.tsx` itself) to inject the role as a CSS class or variable into the DOM.

```tsx
// src/App.tsx (Modification around the main Router)

const App = () => {
  const { primaryRole } = useAuth(); // Assume primaryRole is exposed

  // The class is set on the main app container based on the user's role
  const roleClass = primaryRole
    ? `theme-${primaryRole.toLowerCase()}`
    : "theme-guest";

  return (
    <Router>
      <div className={`flex min-h-screen flex-col ${roleClass}`}>
        <RoleBanner />
        <Navbar />
        {/* ... Routes ... */}
        <Footer />
      </div>
    </Router>
  );
};
```

### B. Styling with Tailwind/CSS

Now, you can use the injected class in your global CSS (`src/index.css` or component CSS) to apply theme changes.

**Example: Change the primary color for a `FLEET_MANAGER`**

1.  **Define CSS Variables (in `src/index.css`)**:

<!-- end list -->

```css
/* src/index.css or a dedicated theme file */

/* Default/User Theme */
:root {
  --color-primary: #4f46e5; /* Indigo */
}

/* Fleet Manager Theme */
.theme-fleet_manager {
  --color-primary: #047857; /* Dark Teal */
}

/* Admin Theme */
.theme-admin {
  --color-primary: #dc2626; /* Red */
}
```

2.  **Use CSS Variables in Components**:

<!-- end list -->

```tsx
// Example: FleetManagerDashboard.tsx
<button className="bg-[var(--color-primary)] px-6 py-2 text-white hover:opacity-90">
  Manage Fleet
</button>
```

3.  **Conditional Rendering/Styling in `Navbar.tsx`**:

You can use the `primaryRole` directly for component-level styling changes, such as modifying the Navbar or the visibility of menu items.

```tsx
// src/components/Navbar.tsx (Modification to conditionally show a link)

const Navbar: React.FC = () => {
  const { primaryRole, hasRole } = useAuth(); // Assuming primaryRole and hasRole are available

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Rentals", href: "/rentals" },
    // ...
  ];

  // Dynamically add Admin link if the user is an Admin
  if (hasRole("ADMIN")) {
    navigation.push({ name: "Admin Console", href: "/admin/console" });
  }

  if (hasRole("FLEET_MANAGER")) {
    navigation.push({ name: "Manager Dashboard", href: "/manager/dashboard" });
  }

  // ... rest of the Navbar component
};
```
