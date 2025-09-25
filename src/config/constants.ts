// Application constants
export const APP_CONFIG = {
  name: "ExploreSG",
  tagline: "Explore Singapore",
  logo: "🚲",
  maxWidth: "max-w-7xl",
  copyright: "© 2025 XploreSG. All rights reserved.",
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  auth: "/api/auth",
  bookings: "/api/bookings",
  bikes: "/api/bikes",
  profile: "/api/profile",
} as const;

// Route paths
export const ROUTES = {
  home: "/",
  login: "/login",
  book: "/book",
  bookings: "/bookings",
  rides: "/rides",
  profile: "/profile",
  editProfile: "/edit-profile",
  logout: "/logout",
  dashboard: "/dashboard",
} as const;

// Theme colors
export const COLORS = {
  primary: "green",
  secondary: "orange",
  danger: "red",
  dark: "gray-900",
  black: "black",
} as const;
