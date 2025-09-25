import { ROUTES } from "../config/constants";

export interface NavigationItem {
  label: string;
  path: string;
  variant?: "default" | "danger" | "user";
  requiresAuth?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Home",
    path: ROUTES.home,
  },
  {
    label: "Login",
    path: ROUTES.login,
    requiresAuth: false, // Only show when NOT logged in
  },
  {
    label: "My Bookings",
    path: ROUTES.bookings,
    requiresAuth: true,
  },
  {
    label: "Book a Bike",
    path: ROUTES.book,
    requiresAuth: false,
  },
  {
    label: "Vehicles",
    path: ROUTES.vehicles,
    requiresAuth: false,
  },
  {
    label: "Log Out",
    path: ROUTES.logout,
    variant: "danger",
    requiresAuth: true,
  },
];
