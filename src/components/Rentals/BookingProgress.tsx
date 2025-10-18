import React from "react";
import {
  FaCheck,
  FaCar,
  FaPlus,
  FaUser,
  FaClipboardCheck,
  FaCreditCard,
} from "react-icons/fa";

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "completed" | "current" | "upcoming";
}

interface BookingProgressProps {
  currentStep: number;
  className?: string;
}

const BookingProgress: React.FC<BookingProgressProps> = ({
  currentStep,
  className = "",
}) => {
  const steps: Step[] = [
    {
      id: 1,
      title: "Select a car",
      icon: FaCar,
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "current"
            : "upcoming",
    },
    {
      id: 2,
      title: "Choose add-ons",
      icon: FaPlus,
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
            ? "current"
            : "upcoming",
    },
    {
      id: 3,
      title: "Enter driver info",
      icon: FaUser,
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
            ? "current"
            : "upcoming",
    },
    {
      id: 4,
      title: "Review & Reserve",
      icon: FaClipboardCheck,
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
            ? "current"
            : "upcoming",
    },
    {
      id: 5,
      title: "Payment",
      icon: FaCreditCard,
      status:
        currentStep > 5
          ? "completed"
          : currentStep === 5
            ? "current"
            : "upcoming",
    },
  ];

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-green-500 text-white border-green-500",
          text: "text-green-600 font-semibold",
          connector: "bg-green-500",
        };
      case "current":
        return {
          circle:
            "bg-blue-500 text-white border-blue-500 ring-4 ring-blue-100 shadow-lg",
          text: "text-blue-600 font-semibold",
          connector: "bg-gray-300",
        };
      case "upcoming":
        return {
          circle: "bg-white text-gray-400 border-gray-300",
          text: "text-gray-400",
          connector: "bg-gray-300",
        };
      default:
        return {
          circle: "bg-white text-gray-400 border-gray-300",
          text: "text-gray-400",
          connector: "bg-gray-300",
        };
    }
  };

  const currentStepData = steps.find((s) => s.status === "current");

  return (
    <div className={`sticky top-0 z-10 bg-white shadow-xl ${className}`}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Desktop Progress */}
        <div className="hidden items-center justify-between sm:flex">
          {steps.map((step, index) => {
            const classes = getStepClasses(step.status);
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${classes.circle}`}
                  >
                    {step.status === "completed" ? (
                      <FaCheck className="h-5 w-5" />
                    ) : (
                      <IconComponent className="h-5 w-5" />
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="ml-4">
                    <p
                      className={`text-sm transition-colors duration-300 ${classes.text}`}
                    >
                      Step {step.id}
                    </p>
                    <p
                      className={`text-sm transition-colors duration-300 ${classes.text}`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="mx-6 flex-1">
                    <div
                      className={`h-1 rounded-full transition-colors duration-300 ${classes.connector}`}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Progress */}
        <div className="sm:hidden">
          <div className="mb-4 flex items-center justify-center">
            {steps.map((step, index) => {
              const classes = getStepClasses(step.status);

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${classes.circle}`}
                  >
                    {step.status === "completed" ? (
                      <FaCheck className="h-3 w-3" />
                    ) : (
                      <span className="text-xs font-bold">{step.id}</span>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mx-1 w-8">
                      <div
                        className={`h-0.5 transition-colors duration-300 ${classes.connector}`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Title */}
          {currentStepData && (
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600">
                Step {currentStepData.id} of {steps.length}:{" "}
                {currentStepData.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;
