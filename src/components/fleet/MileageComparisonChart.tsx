import React from "react";
import { Bar } from "react-chartjs-2";
import type { FleetByModel } from "../../types/dashboard";

interface MileageComparisonChartProps {
  fleetData: FleetByModel[];
}

export const MileageComparisonChart: React.FC<MileageComparisonChartProps> = ({
  fleetData,
}) => {
  const data = {
    labels: fleetData.map((item) => item.model),
    datasets: [
      {
        label: "Average Mileage",
        data: fleetData.map((item) => item.averageMileage),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Average Mileage by Model",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `${context.parsed.y.toLocaleString()} km`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return Number(value).toLocaleString() + " km";
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
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
