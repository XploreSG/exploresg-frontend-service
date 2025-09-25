// Application constants
export const APP_CONFIG = {
  name: "ExploreSG Bikes",
  tagline: "Explore Singapore on Two Wheels",
  logo: "🚲",
  maxWidth: "max-w-7xl",
  copyright: "© 2025 ExploreSG Bikes. All rights reserved.",
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  auth: "/api/auth",
  bookings: "/api/bookings",
  bikes: "/api/bikes",
} as const;

// Route paths
export const ROUTES = {
  home: "/",
  login: "/login",
  book: "/book-bike",
  bookings: "/bookings",
  logout: "/logout",
  dashboard: "/dashboard",
  vehicles: "/vehicles",
} as const;

// Theme colors
export const COLORS = {
  primary: "green",
  secondary: "orange",
  danger: "red",
  dark: "gray-900",
  black: "black",
} as const;
