import React from "react";
import { Routes, Route } from "react-router-dom";
import RentalAddOnPage from "../components/Rentals/RentalAddOn";
import DriverDetailsPage from "../components/Rentals/DriverDetailsPage";
import PaymentPage from "./PaymentPage";

const BookingFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="addons" element={<RentalAddOnPage />} />
      <Route path="driver-details" element={<DriverDetailsPage />} />
      <Route path="payment" element={<PaymentPage />} />
    </Routes>
  );
};

export default BookingFlow;
