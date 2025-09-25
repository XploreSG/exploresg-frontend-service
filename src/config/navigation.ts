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
    label: "Dashboard",
    path: ROUTES.dashboard,
    requiresAuth: true,
  },
  {
    label: "Book a Ride",
    path: ROUTES.book,
    requiresAuth: true,
  },
  {
    label: "My Bookings",
    path: ROUTES.bookings,
    requiresAuth: true,
  },
  {
    label: "All Bikes",
    path: ROUTES.rides,
  },
  {
    label: "Profile", // This should be dynamic based on user
    path: ROUTES.profile,
    variant: "user",
    requiresAuth: true,
  },
  {
    label: "Edit Profile",
    path: ROUTES.editProfile,
    requiresAuth: true,
  },
  {
    label: "Log Out",
    path: ROUTES.logout,
    variant: "danger",
    requiresAuth: true,
  },
];
