import React from "react";
import { Bar } from "react-chartjs-2";
import type { FleetByModel } from "../../types/dashboard";

interface RevenueByModelChartProps {
  fleetData: FleetByModel[];
}

export const RevenueByModelChart: React.FC<RevenueByModelChartProps> = ({
  fleetData,
}) => {
  const data = {
    labels: fleetData.map((item) => item.model),
    datasets: [
      {
        label: "Daily Revenue Potential ($)",
        data: fleetData.map((item) => item.averageDailyPrice * item.totalCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(199, 199, 199, 0.8)",
          "rgba(83, 102, 255, 0.8)",
          "rgba(255, 99, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(83, 102, 255, 1)",
          "rgba(255, 99, 255, 1)",
        ],
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
        text: "Revenue Potential by Vehicle Model",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return "$" + value;
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
