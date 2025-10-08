import React from "react";
import CountUp from "react-countup";

interface StatCardProps {
  title: string;
  value: number | string;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  subtitle?: string;
}

const colorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
  purple: "text-purple-600",
  indigo: "text-indigo-600",
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color = "blue",
  subtitle,
}) => {
  return (
    <div className="transform rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 ease-in-out will-change-transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${colorClasses[color]}`}>
        {typeof value === "number" ? (
          <CountUp end={value} duration={1.2} separator="," />
        ) : (
          value
        )}
      </p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};
