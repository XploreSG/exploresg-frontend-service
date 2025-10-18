import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingDetails } from "../services/bookingApi";
import type { BookingDetailsResponse } from "../services/bookingApi";
import { FaCheckCircle, FaEnvelope, FaIdCard, FaClock } from "react-icons/fa";

const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const details = await getBookingDetails(bookingId);
        setBooking(details);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
          <p className="mb-6 text-gray-600">{error || "Booking not found"}</p>
          <button
            onClick={() => navigate("/rentals")}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Return to Vehicle Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <FaCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your rental is confirmed. We've sent a confirmation email to{" "}
            <span className="font-semibold">{booking.driverDetails.email}</span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 border-b pb-4 text-2xl font-bold text-gray-900">
            Booking Details
          </h2>

          {/* Booking ID */}
          <div className="mb-6 flex items-start gap-4 rounded-lg bg-blue-50 p-4">
            <FaIdCard className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-xl font-bold text-blue-600">
                {booking.bookingId}
              </p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Vehicle Information
            </h3>
            <div className="flex gap-4">
              <img
                src={booking.carModel.imageUrl}
                alt={booking.carModel.model}
                className="h-24 w-36 rounded-lg object-cover"
              />
              <div>
                <p className="text-lg font-semibold">
                  {booking.carModel.model}
                </p>
                <p className="text-gray-600">{booking.carModel.manufacturer}</p>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Rental Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Pickup</p>
                <p className="font-medium">
                  {new Date(booking.startDate).toLocaleDateString("en-SG", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.pickupLocation}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Return</p>
                <p className="font-medium">
                  {new Date(booking.endDate).toLocaleDateString("en-SG", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.returnLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Driver Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">
                  {booking.driverDetails.firstName}{" "}
                  {booking.driverDetails.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{booking.driverDetails.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{booking.driverDetails.email}</p>
              </div>
              <div>
                <p className="text-gray-600">License Number</p>
                <p className="font-medium">
                  {booking.driverDetails.licenseNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-green-600">
                {booking.currency} ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
            <FaClock className="h-5 w-5" />
            Next Steps
          </h3>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 h-4 w-4 flex-shrink-0" />
              <span>
                Check your email for confirmation details and pickup
                instructions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaIdCard className="mt-1 h-4 w-4 flex-shrink-0" />
              <span>
                Bring your driver's license and a valid credit card on pickup
                day
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 h-4 w-4 flex-shrink-0" />
              <span>
                Arrive 15 minutes early for vehicle inspection and paperwork
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
