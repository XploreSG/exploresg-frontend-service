import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../contexts/bookingContextCore";
import BookingProgress from "../components/Rentals/BookingProgress";
import { FaClipboardCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { createBooking, handleBookingApiError } from "../services/bookingApi";
import type { CreateBookingRequest } from "../services/bookingApi";
import type { AddOnSelection } from "../contexts/bookingContextCore";
import ReservationExpiredModal from "../components/Rentals/ReservationExpiredModal";

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { carId } = useParams();
  const {
    selectedCar,
    bookingDates,
    selectedCDW,
    selectedAddOns,
    driverDetails,
    totalPrice,
    setBooking,
  } = useBooking();

  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleReserveVehicle = async () => {
    if (!selectedCar || !bookingDates || !driverDetails) {
      setError(
        "Missing required booking information. Please go back and complete all steps.",
      );
      return;
    }

    setIsReserving(true);
    setError(null);

    try {
      const bookingRequest: CreateBookingRequest = {
        carModelPublicId: selectedCar.carId || "unknown",
        startDate: bookingDates.pickup,
        endDate: bookingDates.return,
        pickupLocation: "Changi Airport", // TODO: Get from form
        returnLocation: "Changi Airport", // TODO: Get from form
        driverDetails: {
          firstName: driverDetails.firstName,
          lastName: driverDetails.lastName,
          email: driverDetails.email,
          phone: driverDetails.phone,
          licenseNumber: driverDetails.licenseNumber,
          dateOfBirth: driverDetails.dateOfBirth,
          licenseExpiryDate: driverDetails.licenseExpiryDate,
        },
        selectedCDW,
        selectedAddOns: selectedAddOns
          .filter((a: AddOnSelection) => a.selected)
          .map((a: AddOnSelection) => a.id),
      };

      const response = await createBooking(bookingRequest);

      // Store booking reservation in context
      setBooking({
        bookingId: response.bookingId,
        status: response.status,
        reservationExpiresAt: response.reservationExpiresAt,
        totalAmount: response.totalAmount,
      });

      // Navigate to payment page with bookingId
      navigate(`/booking/${response.bookingId}/payment`);
    } catch (err: unknown) {
      const errorMessage = handleBookingApiError(err, navigate);

      const apiError = err as {
        status?: number;
        data?: { error?: string; message?: string };
      };
      if (apiError.status === 409) {
        // No vehicles available - show modal
        setModalMessage(errorMessage);
        setShowErrorModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsReserving(false);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    navigate("/rentals");
  };

  if (!selectedCar || !bookingDates || !driverDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Missing Booking Information
          </h2>
          <p className="mb-6 text-gray-600">
            Please complete all previous steps before reviewing your booking.
          </p>
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
    <div className="min-h-screen bg-gray-50">
      <BookingProgress currentStep={4} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 shadow-sm">
              <FaClipboardCheck className="mr-3 h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-blue-700">
                Step 4: Review & Reserve Your Vehicle
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Booking Summary
            </h2>

            {/* Vehicle Details */}
            <div className="mb-6 border-b pb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Vehicle Details
              </h3>
              <div className="flex gap-6">
                <img
                  src={selectedCar.imageUrl}
                  alt={selectedCar.model}
                  className="h-32 w-48 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-xl font-semibold">{selectedCar.model}</p>
                  <p className="text-gray-600">
                    {selectedCar.operator || "Premium"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedCar.transmission || "Automatic"} •{" "}
                    {selectedCar.seats} Seats • {selectedCar.luggage || 3}{" "}
                    Luggage
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="mb-6 border-b pb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Rental Period
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup</p>
                  <p className="font-medium">
                    {new Date(bookingDates.pickup).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Return</p>
                  <p className="font-medium">
                    {new Date(bookingDates.return).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">
                    Duration: {bookingDates.nights} days
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            <div className="mb-6 border-b pb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Driver Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">
                    {driverDetails.firstName} {driverDetails.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{driverDetails.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{driverDetails.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">License Number</p>
                  <p className="font-medium">{driverDetails.licenseNumber}</p>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {selectedAddOns.some((a: AddOnSelection) => a.selected) && (
              <div className="mb-6 border-b pb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Selected Add-ons
                </h3>
                <ul className="space-y-2 text-sm">
                  {selectedAddOns
                    .filter((a: AddOnSelection) => a.selected)
                    .map((addon: AddOnSelection) => (
                      <li key={addon.id} className="flex justify-between">
                        <span>{addon.name}</span>
                        <span className="font-medium">
                          S$ {addon.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Price Breakdown */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Price Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Base Rental ({bookingDates.nights} days × S${" "}
                    {selectedCar.price})
                  </span>
                  <span>
                    S$ {(selectedCar.price * bookingDates.nights).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance (CDW {selectedCDW})</span>
                  <span>
                    {selectedCDW === "basic"
                      ? "Included"
                      : `S$ ${(selectedCDW === "plus" ? 18 : 40) * bookingDates.nights}.00`}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    S$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/booking/${carId}/driver-details`)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              disabled={isReserving}
            >
              <FaArrowLeft />
              Back to Driver Details
            </button>

            <button
              type="button"
              onClick={handleReserveVehicle}
              disabled={isReserving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReserving ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  Reserving Vehicle...
                </>
              ) : (
                <>
                  Reserve Vehicle
                  <FaArrowRight />
                </>
              )}
            </button>
          </div>

          {/* Important Notice */}
          <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> After clicking "Reserve Vehicle",
              you'll have 30 seconds to complete your payment before the
              reservation expires.
            </p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ReservationExpiredModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title="Vehicle Unavailable"
        message={modalMessage}
      />
    </div>
  );
};

export default ReviewPage;
