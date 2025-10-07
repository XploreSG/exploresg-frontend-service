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
