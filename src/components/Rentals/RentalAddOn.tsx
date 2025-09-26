import React, { useState, useEffect } from "react";
import BookingProgress from "./BookingProgress";
import { FaPlus } from "react-icons/fa";

// Types (keeping existing types)
type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  isIncluded?: boolean;
};

type CDWOption = {
  key: string;
  label: string;
  price: number;
  priceDisplay: string;
};

type BookingDetails = {
  car: string;
  location: string;
  pickup: string;
  return: string;
  passengers: number;
  luggage: number;
  petFriendly: boolean;
  nights: number;
  basePrice: number;
};

const ADDONS: AddOn[] = [
  {
    id: "malaysia-drive",
    name: "Drive to West Malaysia x 5 nights",
    description: "Only pay for nights you enter West Malaysia. FREE GIFT 🎁",
    price: "Included",
    isIncluded: true,
  },
  {
    id: "windscreen-protector",
    name: "Windscreen Damage Protector",
    description:
      "$0 Windscreen Excess in event of windscreen damage chargeable at $200",
    price: 20,
  },
  {
    id: "malaysia-breakdown",
    name: "Malaysia Breakdown Protector",
    description: "Be insured for cross-border towing service in Malaysia",
    price: 30,
  },
  {
    id: "child-booster",
    name: "Child Booster Seat",
    description: "Designed for children aged 3 to 12 years old",
    price: 25,
  },
  {
    id: "nets-cashcard",
    name: "NETS Motoring Cash Card Rental",
    description: "Required for ERP tolls and carpark payments in Singapore",
    price: 20,
  },
];

const CDW_OPTIONS: CDWOption[] = [
  { key: "basic", label: "CDW Basic", price: 0, priceDisplay: "Included" },
  { key: "plus", label: "CDW Plus", price: 18, priceDisplay: "+S$18/night" },
  { key: "max", label: "CDW Max", price: 40, priceDisplay: "+S$40/night" },
];

const RentalAddOn: React.FC = () => {
  // Booking details (normally passed as props or from context/state)
  const bookingDetails: BookingDetails = {
    car: "Toyota Alphard or similar",
    location: "McIver City, 28 Sin Ming Lane",
    pickup: "Sat, 27 Sep, 11:00",
    return: "Thu, 2 Oct, 10:00",
    passengers: 7,
    luggage: 2,
    petFriendly: true,
    nights: 5,
    basePrice: 250,
  };

  const [selectedCDW, setSelectedCDW] = useState<string>("basic");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(
    {
      "malaysia-drive": true,
    },
  );
  const [total, setTotal] = useState<number>(0);

  // Calculate total price whenever selections change
  useEffect(() => {
    let calculatedTotal = bookingDetails.basePrice * bookingDetails.nights;

    // Add CDW cost
    const selectedCDWOption = CDW_OPTIONS.find(
      (opt) => opt.key === selectedCDW,
    );
    if (selectedCDWOption) {
      calculatedTotal += selectedCDWOption.price * bookingDetails.nights;
    }

    // Add selected add-ons cost
    ADDONS.forEach((addon) => {
      if (selectedAddOns[addon.id] && typeof addon.price === "number") {
        calculatedTotal += addon.price;
      }
    });

    setTotal(calculatedTotal);
  }, [
    selectedCDW,
    selectedAddOns,
    bookingDetails.nights,
    bookingDetails.basePrice,
  ]);

  const handleAddOnToggle = (addonId: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps - Step 2: Choose add-ons */}
      <BookingProgress currentStep={2} />

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Current Step Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 shadow-sm">
              <FaPlus className="mr-3 h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-blue-700">
                Step 2: Customize your rental with add-ons
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            {/* Car Information + Booking Details */}
            <div className="mb-6 flex items-start space-x-4 rounded-lg bg-gray-50 p-4">
              {/* Car Image */}
              <div className="flex-shrink-0">
                <img
                  src="/assets/alphard.png"
                  alt={bookingDetails.car}
                  className="h-20 w-32 rounded-lg bg-white object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='80' viewBox='0 0 128 80'%3E%3Crect width='128' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%236b7280'%3ECar Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {bookingDetails.car}
                </h2>
                <div className="mt-1 flex items-center space-x-2 text-sm text-green-600">
                  <span>✓ Unlimited mileage</span>
                  <span>✓ 24/7 assistance</span>
                  <span>✓ Free cancel 72h prior</span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <span className="text-gray-500">Pickup:</span>
                    <div className="font-medium">{bookingDetails.pickup}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Return:</span>
                    <div className="font-medium">{bookingDetails.return}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">
                      {bookingDetails.nights} nights
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CDW Selection */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Collision Damage Waiver
                </h3>
                <button className="text-sm text-blue-600 hover:underline">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CDW_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    className={`rounded-lg border-2 p-4 text-center transition-all ${
                      selectedCDW === opt.key
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedCDW(opt.key)}
                  >
                    <div className="font-bold text-gray-900">{opt.label}</div>
                    <div
                      className={`mt-1 text-sm ${opt.price === 0 ? "font-medium text-blue-600" : "text-green-600"}`}
                    >
                      {opt.priceDisplay}
                    </div>
                  </button>
                ))}
              </div>

              {/* Insurance Excess Information */}
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Insurance Excess:</strong> Amount you pay in case of
                  damage - Singapore: S$2,000 | Malaysia: S$4,000
                </p>
              </div>
            </div>

            {/* Add-ons List */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold">Add-ons</h3>
              <div className="space-y-3">
                {ADDONS.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {addon.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {addon.description}
                      </div>
                      {addon.isIncluded && (
                        <div className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          FREE GIFT 🎁
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex items-center space-x-3">
                      <span className="min-w-[80px] text-right text-lg font-semibold text-gray-900">
                        {typeof addon.price === "string"
                          ? addon.price
                          : `S$ ${addon.price}.00`}
                      </span>

                      {!addon.isIncluded && (
                        <button
                          className={`min-w-[80px] rounded-lg px-4 py-2 font-medium transition-colors ${
                            selectedAddOns[addon.id]
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                          onClick={() => handleAddOnToggle(addon.id)}
                        >
                          {selectedAddOns[addon.id] ? "Remove" : "Add"}
                        </button>
                      )}

                      {addon.isIncluded && (
                        <div className="min-w-[80px] rounded-lg bg-green-100 px-4 py-2 text-center font-medium text-green-800">
                          Included
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Car rental ({bookingDetails.nights} nights)</span>
                  <span>
                    S${" "}
                    {(bookingDetails.basePrice * bookingDetails.nights).toFixed(
                      2,
                    )}
                  </span>
                </div>

                {selectedCDW !== "basic" && (
                  <div className="flex justify-between">
                    <span>
                      Insurance upgrade (
                      {
                        CDW_OPTIONS.find((opt) => opt.key === selectedCDW)
                          ?.label
                      }
                      )
                    </span>
                    <span>
                      S${" "}
                      {(
                        (CDW_OPTIONS.find((opt) => opt.key === selectedCDW)
                          ?.price || 0) * bookingDetails.nights
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {ADDONS.filter(
                  (addon) =>
                    selectedAddOns[addon.id] && typeof addon.price === "number",
                ).map((addon) => (
                  <div key={addon.id} className="flex justify-between">
                    <span>{addon.name}</span>
                    <span>S$ {(addon.price as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 flex items-center justify-between border-t pt-4 text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-600">S$ {total.toFixed(2)}</span>
            </div>

            {/* Continue Button */}
            <button className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-700">
              Continue to Driver Info
            </button>

            {/* Important Information Section */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-2 font-bold text-gray-900">
                Important Information
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    Refundable security deposit will be collected at vehicle
                    collection (S$2,000-S$3,000 depending on driving experience)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    Entry to West Malaysia is allowed with daily surcharge of
                    S$25
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    Free cancellation & 100% refund if pickup is more than 72
                    hours away
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  <span>
                    Valid driving license required for at least 1 year
                  </span>
                </li>
              </ul>

              <button className="mt-3 text-sm text-blue-600 hover:underline">
                View Full Terms and Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAddOn;
