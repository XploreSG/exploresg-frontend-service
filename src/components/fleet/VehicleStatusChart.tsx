import React from "react";
import { Doughnut } from "react-chartjs-2";

interface VehicleStatusChartProps {
  available: number;
  booked: number;
  underMaintenance: number;
}

export const VehicleStatusChart: React.FC<VehicleStatusChartProps> = ({
  available,
  booked,
  underMaintenance,
}) => {
  const data = {
    labels: ["Available", "Booked", "Under Maintenance"],
    datasets: [
      {
        label: "Vehicles",
        data: [available, booked, underMaintenance],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Fleet Status Distribution",
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div style={{ height: "300px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
