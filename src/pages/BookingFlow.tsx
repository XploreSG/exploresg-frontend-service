import React from "react";
import { Routes, Route } from "react-router-dom";
import RentalAddOnPage from "../components/Rentals/RentalAddOn";
import DriverDetailsPage from "../components/Rentals/DriverDetailsPage";
import ReviewPage from "./ReviewPage";
import PaymentPage from "./PaymentPage";
import ConfirmationPage from "./ConfirmationPage";

const BookingFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="addons" element={<RentalAddOnPage />} />
      <Route path="driver-details" element={<DriverDetailsPage />} />
      <Route path="review" element={<ReviewPage />} />
      <Route path=":bookingId/payment" element={<PaymentPage />} />
      <Route path=":bookingId/confirmation" element={<ConfirmationPage />} />
    </Routes>
  );
};

export default BookingFlow;
