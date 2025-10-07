import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const FleetManagerDashboard: React.FC = () => {
  // Line Chart Data - Fleet Utilization Over Time
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Vehicles in Use",
        data: [45, 52, 48, 60, 55, 70, 65],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Available Vehicles",
        data: [25, 18, 22, 10, 15, 5, 10],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Weekly Fleet Utilization",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Bar Chart Data - Revenue by Vehicle Type
  const barChartData = {
    labels: ["Sedan", "SUV", "Van", "Luxury", "Electric"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12000, 19000, 8000, 15000, 10000],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Revenue by Vehicle Type",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Doughnut Chart Data - Fleet Status
  const doughnutChartData = {
    labels: ["Available", "In Use", "Maintenance", "Reserved"],
    datasets: [
      {
        label: "Vehicles",
        data: [25, 45, 8, 12],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(251, 191, 36, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(251, 191, 36, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Fleet Status Distribution",
      },
    },
  };

  // Pie Chart Data - Popular Destinations
  const pieChartData = {
    labels: [
      "Marina Bay",
      "Sentosa",
      "Orchard Road",
      "Changi Airport",
      "Others",
    ],
    datasets: [
      {
        label: "Trips",
        data: [300, 250, 180, 220, 150],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Popular Destinations",
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Fleet Manager Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">90</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">In Use</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">45</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">25</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">8</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div style={{ height: "300px" }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div style={{ height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div style={{ height: "300px" }}>
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
