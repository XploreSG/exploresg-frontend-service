import { createContext, useContext } from "react";
import type { CarDetailsWithPricing } from "../types/rental";

export interface AddOnSelection {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface BookingDates {
  pickup: string;
  return: string;
  nights: number;
}

export interface DriverDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseCountry: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  drivingExperience: string;
}

export interface BookingReservation {
  bookingId: string;
  status: string;
  reservationExpiresAt: string; // ISO timestamp
  totalAmount: number;
}

export interface BookingContextType {
  selectedCar: CarDetailsWithPricing | null;
  bookingDates: BookingDates | null;
  selectedCDW: string;
  selectedAddOns: AddOnSelection[];
  driverDetails: DriverDetails | null;
  totalPrice: number;
  booking: BookingReservation | null;
  setSelectedCar: (car: CarDetailsWithPricing) => void;
  setBookingDates: (dates: BookingDates) => void;
  setSelectedCDW: (cdw: string) => void;
  setSelectedAddOns: (addOns: AddOnSelection[]) => void;
  setDriverDetails: (details: DriverDetails) => void;
  setBooking: (booking: BookingReservation | null) => void;
  calculateTotal: () => void;
  resetBooking: () => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(
  undefined,
);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export default BookingContext;
