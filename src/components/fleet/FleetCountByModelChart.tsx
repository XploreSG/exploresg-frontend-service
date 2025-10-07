import React from "react";
import { Bar } from "react-chartjs-2";
import type { FleetByModel } from "../../types/dashboard";

interface FleetCountByModelChartProps {
  fleetData: FleetByModel[];
}

export const FleetCountByModelChart: React.FC<FleetCountByModelChartProps> = ({
  fleetData,
}) => {
  const data = {
    labels: fleetData.map((item) => item.model),
    datasets: [
      {
        label: "Available",
        data: fleetData.map((item) => item.availableCount),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Booked",
        data: fleetData.map((item) => item.bookedCount),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Under Maintenance",
        data: fleetData.map((item) => item.underMaintenanceCount),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Fleet Count by Model & Status",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div style={{ height: "350px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
