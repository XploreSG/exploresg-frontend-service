import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingProgress from "../components/Rentals/BookingProgress";
import CountdownTimer from "../components/Rentals/CountdownTimer";
import ReservationExpiredModal from "../components/Rentals/ReservationExpiredModal";
import RentalCardSummary from "../components/Rentals/RentalCardSummary";
import { useBooking } from "../contexts/bookingContextCore";
import { processPayment, handleBookingApiError } from "../services/bookingApi";
import { FaCreditCard, FaLock, FaShieldAlt, FaCheck } from "react-icons/fa";

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const {
    booking,
    selectedCar,
    bookingDates,
    selectedAddOns,
    selectedCDW,
    totalPrice,
    resetBooking,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const handleReservationExpired = () => {
    setShowExpiredModal(true);
  };

  const handleExpiredModalClose = () => {
    setShowExpiredModal(false);
    resetBooking();
    navigate("/rentals");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId) {
      setError("No booking ID found. Please start over.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await processPayment(bookingId, {
        paymentMethod: "CREDIT_CARD",
        // cardDetails can be added here for real payment gateway
      });

      // Success - navigate to confirmation
      navigate(`/booking/${bookingId}/confirmation`);
    } catch (err: unknown) {
      const errorMessage = handleBookingApiError(err, navigate);

      const apiError = err as { status?: number };
      if (apiError.status === 410) {
        // Reservation expired - show modal
        setShowExpiredModal(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // If no booking reservation, redirect back
  if (!booking || !selectedCar) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">No Active Reservation</h2>
          <p className="mb-6 text-gray-600">
            Please complete the previous steps to make a reservation.
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
      {/* Progress Steps - Step 5: Payment */}
      <BookingProgress currentStep={5} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Countdown Timer - Prominent Display */}
          {booking && (
            <CountdownTimer
              expiresAt={booking.reservationExpiresAt}
              onExpired={handleReservationExpired}
              className="mb-8"
            />
          )}

          {/* Current Step Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 shadow-sm">
              <FaCreditCard className="mr-3 h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-blue-700">
                Step 5: Complete your payment
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Full-Width Car Summary */}
          {selectedCar && bookingDates && (
            <div className="mb-8">
              <RentalCardSummary
                model={selectedCar.model}
                seats={selectedCar.seats}
                luggage={selectedCar.luggage}
                transmission={selectedCar.transmission}
                price={selectedCar.price}
                originalPrice={selectedCar.originalPrice}
                promoText={selectedCar.promoText}
                imageUrl={selectedCar.imageUrl}
                operator={selectedCar.operator}
                operatorStyling={selectedCar.operatorStyling}
                nights={bookingDates.nights}
                showPricing={true}
                className="mb-0"
              />
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Method */}
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="card" className="ml-3 flex items-center">
                        <FaCreditCard className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">Credit/Debit Card</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-center">
                      <FaLock className="mr-3 h-5 w-5 text-green-500" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Card Details
                      </h2>
                      <span className="ml-auto text-sm text-green-600">
                        Secure Payment
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardholderName}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              cardholderName: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter cardholder name"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) =>
                            setCardDetails((prev) => ({
                              ...prev,
                              cardNumber: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Month *
                          </label>
                          <select
                            value={cardDetails.expiryMonth}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                expiryMonth: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Year *
                          </label>
                          <select
                            value={cardDetails.expiryYear}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                expiryYear: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) =>
                              setCardDetails((prev) => ({
                                ...prev,
                                cvv: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-3 h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Secure Payment
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        Your payment information is encrypted and secure. We use
                        industry-standard SSL encryption.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    disabled={isProcessing}
                  >
                    Back to Review
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      "Complete Payment"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">Booking Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {selectedCar?.model || "Vehicle"} (
                      {bookingDates?.nights || 5} nights)
                    </span>
                    <span>
                      S${" "}
                      {(
                        (selectedCar?.price || 250) *
                        (bookingDates?.nights || 5)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Insurance (CDW{" "}
                      {selectedCDW === "basic"
                        ? "Basic"
                        : selectedCDW === "plus"
                          ? "Plus"
                          : "Max"}
                      )
                    </span>
                    <span>
                      {selectedCDW === "basic"
                        ? "Included"
                        : selectedCDW === "plus"
                          ? "S$ 90.00"
                          : "S$ 200.00"}
                    </span>
                  </div>
                  {selectedAddOns &&
                    selectedAddOns.length > 0 &&
                    selectedAddOns.some((a) => a.selected) &&
                    selectedAddOns.map((addon) =>
                      addon.selected ? (
                        <div key={addon.id} className="flex justify-between">
                          <span>{addon.name}</span>
                          <span>S$ {addon.price.toFixed(2)}</span>
                        </div>
                      ) : null,
                    )}

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>S$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-xs text-gray-600">
                  <div className="flex items-start">
                    <FaCheck className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                    <span>Free cancellation up to 72 hours before pickup</span>
                  </div>
                  <div className="flex items-start">
                    <FaCheck className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                    <span>Security deposit: S$ 2,000 (refundable)</span>
                  </div>
                  <div className="flex items-start">
                    <FaCheck className="mt-0.5 mr-2 h-3 w-3 text-green-500" />
                    <span>24/7 roadside assistance included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Expired Modal */}
      <ReservationExpiredModal
        isOpen={showExpiredModal}
        onClose={handleExpiredModalClose}
        title="Reservation Expired"
        message="Your 30-second reservation window has expired. Please select the vehicle again to restart the booking process."
      />
    </div>
  );
};

export default PaymentPage;
