import React from "react";
import { FaTimesCircle } from "react-icons/fa";

interface ReservationExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const ReservationExpiredModal: React.FC<ReservationExpiredModalProps> = ({
  isOpen,
  onClose,
  title = "Reservation Expired",
  message = "Your vehicle reservation has expired. Please select a vehicle again to continue.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="animate-fade-in max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FaTimesCircle className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>

          {/* Message */}
          <p className="mb-6 text-gray-600">{message}</p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Return to Vehicle Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationExpiredModal;
