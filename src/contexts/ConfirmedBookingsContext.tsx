import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { BookingInfo } from "../types/rental";

export interface ConfirmedBookingsContextType {
  confirmedBookings: BookingInfo[];
  addBooking: (booking: BookingInfo) => void;
  removeBooking: (bookingRef: string) => void;
  clearBookings: () => void;
}

const ConfirmedBookingsContext = createContext<
  ConfirmedBookingsContextType | undefined
>(undefined);

export const ConfirmedBookingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load bookings from localStorage on mount
  const [confirmedBookings, setConfirmedBookings] = useState<BookingInfo[]>(
    () => {
      try {
        const stored = localStorage.getItem("confirmedBookings");
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error loading bookings from localStorage:", error);
        return [];
      }
    },
  );

  // Save to localStorage whenever bookings change
  useEffect(() => {
    try {
      localStorage.setItem(
        "confirmedBookings",
        JSON.stringify(confirmedBookings),
      );
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  }, [confirmedBookings]);

  const addBooking = (booking: BookingInfo) => {
    setConfirmedBookings((prev) => {
      // Check if booking already exists
      const exists = prev.some((b) => b.bookingRef === booking.bookingRef);
      if (exists) {
        console.warn(`Booking ${booking.bookingRef} already exists`);
        return prev;
      }
      return [...prev, booking];
    });
  };

  const removeBooking = (bookingRef: string) => {
    setConfirmedBookings((prev) =>
      prev.filter((booking) => booking.bookingRef !== bookingRef),
    );
  };

  const clearBookings = () => {
    setConfirmedBookings([]);
  };

  return (
    <ConfirmedBookingsContext.Provider
      value={{
        confirmedBookings,
        addBooking,
        removeBooking,
        clearBookings,
      }}
    >
      {children}
    </ConfirmedBookingsContext.Provider>
  );
};

export default ConfirmedBookingsContext;
