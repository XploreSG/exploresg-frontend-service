import React from "react";

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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${colorClasses[color]}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};
