import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

interface CountdownTimerProps {
  expiresAt: string; // ISO timestamp
  onExpired: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiresAt,
  onExpired,
  className = "",
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(30);

  useEffect(() => {
    const expiryDate = new Date(expiresAt);

    const timer = setInterval(() => {
      const now = new Date();
      const secondsLeft = Math.max(
        0,
        Math.floor((expiryDate.getTime() - now.getTime()) / 1000),
      );

      setTimeRemaining(secondsLeft);

      if (secondsLeft === 0) {
        clearInterval(timer);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 15) return "text-green-600";
    if (timeRemaining > 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getBorderColor = () => {
    if (timeRemaining > 15) return "border-green-600 bg-green-50";
    if (timeRemaining > 5) return "border-yellow-600 bg-yellow-50";
    return "border-red-600 bg-red-50";
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 ${getBorderColor()} ${
        timeRemaining <= 5 ? "animate-pulse" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-center">
        <FaClock className={`mr-3 h-6 w-6 ${getTimerColor()}`} />
        <span className={`text-3xl font-bold ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      <p className="mt-2 text-center text-sm text-gray-600">
        {timeRemaining > 0
          ? "Complete payment before your reservation expires"
          : "Reservation expired"}
      </p>

      {/* Visual progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-1000 ${
            timeRemaining > 15
              ? "bg-green-500"
              : timeRemaining > 5
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${(timeRemaining / 30) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
