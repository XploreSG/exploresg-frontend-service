import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useBooking } from "../../contexts/bookingContextCore";

const DatePickerSection: React.FC = () => {
  const { bookingDates, setBookingDates } = useBooking();

  // Initialize with context values or defaults
  const [pickupDate, setPickupDate] = useState<string>(() => {
    if (bookingDates?.pickup) {
      // Try to extract date from format "Sat, 27 Sep, 11:00"
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [pickupTime, setPickupTime] = useState<string>("11:00");

  const [returnDate, setReturnDate] = useState<string>(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 6);
    return nextWeek.toISOString().split("T")[0];
  });

  const [returnTime, setReturnTime] = useState<string>("10:00");

  // Calculate nights between pickup and return
  const calculateNights = (pickup: string, returnDate: string): number => {
    const pickupDateTime = new Date(pickup);
    const returnDateTime = new Date(returnDate);
    const diffTime = Math.abs(
      returnDateTime.getTime() - pickupDateTime.getTime(),
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display (e.g., "Sat, 27 Sep, 11:00")
  const formatDateForDisplay = (dateStr: string, timeStr: string): string => {
    const date = new Date(dateStr + "T" + timeStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `${formattedDate}, ${timeStr}`;
  };

  // Update booking context whenever dates change
  useEffect(() => {
    const nights = calculateNights(pickupDate, returnDate);
    const formattedPickup = formatDateForDisplay(pickupDate, pickupTime);
    const formattedReturn = formatDateForDisplay(returnDate, returnTime);

    // Create ISO format for API: "2025-11-01T10:00:00Z" (no milliseconds)
    const pickupISO = new Date(pickupDate + "T" + pickupTime)
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z"); // Remove .000 milliseconds
    const returnISO = new Date(returnDate + "T" + returnTime)
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z"); // Remove .000 milliseconds

    console.log("📅 DatePicker: Saving dates to BookingContext", {
      pickup: formattedPickup,
      return: formattedReturn,
      pickupISO,
      returnISO,
      nights,
    });

    setBookingDates({
      pickup: formattedPickup,
      return: formattedReturn,
      pickupISO,
      returnISO,
      nights,
    });
  }, [pickupDate, pickupTime, returnDate, returnTime, setBookingDates]);

  const nights = calculateNights(pickupDate, returnDate);

  // Get min date for return (must be after pickup)
  const getMinReturnDate = () => {
    const pickup = new Date(pickupDate);
    pickup.setDate(pickup.getDate() + 1); // At least 1 day rental
    return pickup.toISOString().split("T")[0];
  };

  // Get min date for pickup (today)
  const getMinPickupDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-4 shadow-lg sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Select Your Rental Dates
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pickup Date */}
        <div>
          <label
            htmlFor="pickup-date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Pickup Date
          </label>
          <input
            type="date"
            id="pickup-date"
            value={pickupDate}
            min={getMinPickupDate()}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Pickup Time */}
        <div>
          <label
            htmlFor="pickup-time"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Pickup Time
          </label>
          <input
            type="time"
            id="pickup-time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Return Date */}
        <div>
          <label
            htmlFor="return-date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Return Date
          </label>
          <input
            type="date"
            id="return-date"
            value={returnDate}
            min={getMinReturnDate()}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Return Time */}
        <div>
          <label
            htmlFor="return-time"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Return Time
          </label>
          <input
            type="time"
            id="return-time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-center text-sm text-blue-800">
          <span className="font-semibold">
            {nights} night{nights !== 1 ? "s" : ""}
          </span>{" "}
          rental selected
          <span className="mx-2">•</span>
          {formatDateForDisplay(pickupDate, pickupTime)} →{" "}
          {formatDateForDisplay(returnDate, returnTime)}
        </p>
      </div>
    </div>
  );
};

export default DatePickerSection;
