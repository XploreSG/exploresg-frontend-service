import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import BookingContext from "./bookingContextCore";
import type {
  BookingContextType,
  AddOnSelection,
  BookingDates,
  DriverDetails,
  BookingReservation,
} from "./bookingContextCore";
import type { CarDetailsWithPricing } from "../types/rental";

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedCar, setSelectedCar] = useState<CarDetailsWithPricing | null>(
    null,
  );
  const [bookingDates, setBookingDates] = useState<BookingDates | null>(null);
  const [selectedCDW, setSelectedCDW] = useState<string>("basic");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnSelection[]>([]);
  const [driverDetails, setDriverDetailsState] = useState<DriverDetails | null>(
    null,
  );
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [booking, setBooking] = useState<BookingReservation | null>(null);

  // Wrapper to add logging
  const setDriverDetails = (details: DriverDetails | null) => {
    console.log("📝 BookingProvider - setDriverDetails called with:", details);
    setDriverDetailsState(details);
    console.log("✅ BookingProvider - Driver details state updated");
  };

  const calculateTotal = useCallback(() => {
    if (!selectedCar || !bookingDates) {
      setTotalPrice(0);
      return;
    }

    let total = selectedCar.price * bookingDates.nights;
    const cdwPrices = { basic: 0, plus: 18, max: 40 };
    total +=
      (cdwPrices[selectedCDW as keyof typeof cdwPrices] || 0) *
      bookingDates.nights;

    selectedAddOns.forEach((addon) => {
      if (addon.selected) {
        total += addon.price;
      }
    });

    setTotalPrice(total);
  }, [selectedCar, bookingDates, selectedCDW, selectedAddOns]);

  const resetBooking = () => {
    setSelectedCar(null);
    setBookingDates(null);
    setSelectedCDW("basic");
    setSelectedAddOns([]);
    setDriverDetails(null);
    setTotalPrice(0);
    setBooking(null);
  };

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const contextValue: BookingContextType = {
    selectedCar,
    bookingDates,
    selectedCDW,
    selectedAddOns,
    driverDetails,
    totalPrice,
    booking,
    setSelectedCar,
    setBookingDates,
    setSelectedCDW,
    setSelectedAddOns,
    setDriverDetails,
    setBooking,
    calculateTotal,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
