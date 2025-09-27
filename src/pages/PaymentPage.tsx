import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BookingProgress from "../components/Rentals/BookingProgress";
import RentalCardSummary from "../components/Rentals/RentalCardSummary";
import { FaCreditCard, FaLock, FaShieldAlt, FaCheck } from "react-icons/fa";

interface AddOnSelection {
  id: string;
  name: string;
  price: number | string;
  selected: boolean;
}

interface CarDetails {
  model: string;
  seats: number;
  luggage: number;
  transmission: "automatic" | "manual";
  price: number;
  originalPrice?: number;
  promoText?: string;
  imageUrl: string;
  operator: string;
  operatorStyling: string;
  carId: string;
}

interface BookingDates {
  pickup: string;
  return: string;
  nights: number;
}

const PaymentPage: React.FC = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking data from location state
  const bookingData = location.state || {};
  const {
    carDetails,
    selectedAddOns,
    selectedCDW,
    total,
    bookingDates,
  }: {
    carDetails?: CarDetails;
    selectedAddOns?: AddOnSelection[];
    selectedCDW?: string;
    total?: number;
    bookingDates?: BookingDates;
  } = bookingData;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to confirmation page or show success message
      alert("Payment successful! Booking confirmed.");
      navigate("/rentals");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps - Step 4: Payment */}
      <BookingProgress currentStep={4} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Current Step Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 shadow-sm">
              <FaCreditCard className="mr-3 h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-blue-700">
                Step 4: Complete your booking
              </span>
            </div>
          </div>

          {/* Full-Width Car Summary */}
          {carDetails && (
            <div className="mb-8">
              <RentalCardSummary
                model={carDetails.model}
                seats={carDetails.seats}
                luggage={carDetails.luggage}
                transmission={carDetails.transmission}
                price={carDetails.price}
                originalPrice={carDetails.originalPrice}
                promoText={carDetails.promoText}
                imageUrl={carDetails.imageUrl}
                operator={carDetails.operator}
                operatorStyling={carDetails.operatorStyling}
                nights={bookingDates?.nights || 5}
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
                    onClick={() => navigate(`/booking/${carId}/driver-details`)}
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    disabled={isProcessing}
                  >
                    Back to Driver Details
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
                      "Complete Booking"
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
                      {carDetails?.model || "Toyota Alphard"} (5 nights)
                    </span>
                    <span>
                      S$ {((carDetails?.price || 250) * 5).toFixed(2)}
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
                  {selectedAddOns && selectedAddOns.length > 0 ? (
                    selectedAddOns.map((addon: AddOnSelection) =>
                      addon.selected ? (
                        <div key={addon.id} className="flex justify-between">
                          <span>{addon.name}</span>
                          <span>
                            {typeof addon.price === "string"
                              ? addon.price
                              : `S$ ${addon.price.toFixed(2)}`}
                          </span>
                        </div>
                      ) : null,
                    )
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Malaysia Entry (FREE)</span>
                        <span>S$ 0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Windscreen Protection</span>
                        <span>S$ 20.00</span>
                      </div>
                    </>
                  )}

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>S$ {(total || 1270).toFixed(2)}</span>
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
    </div>
  );
};

export default PaymentPage;
