import React, { useEffect, useState } from "react";
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
import {
  StatCard,
  VehicleStatusChart,
  RevenueByModelChart,
  MileageComparisonChart,
  FleetCountByModelChart,
} from "../components/fleet";
import type { DashboardResponse } from "../types/dashboard";
import { FLEET_API_BASE_URL } from "../config/api";
import { useAuth } from "../contexts/useAuth";
import { getOperatorInfoFromUserId } from "../types/rental";

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

const FleetAdminDashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get operator info (name + styling) for FLEET_MANAGER users
  const operatorInfo = hasRole("FLEET_MANAGER")
    ? getOperatorInfoFromUserId(
        typeof user?.userId === "string" ? user.userId : undefined,
      )
    : null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the auth token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No authentication token found in localStorage");
        }

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const apiUrl = `${FLEET_API_BASE_URL}/api/v1/fleet/operators/dashboard`;
        console.log("Fetching dashboard data from:", apiUrl);
        console.log("Request headers:", headers);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers,
          credentials: "include", // Include cookies for authentication
        });

        console.log("Dashboard API response status:", response.status);

        if (!response.ok) {
          // Try to get error details from response body
          let errorDetail = response.statusText;
          try {
            const errorData = await response.json();
            errorDetail = errorData.message || errorData.error || errorDetail;
          } catch {
            // Response body might not be JSON
          }

          if (response.status === 401) {
            throw new Error(
              `Unauthorized: Please log in to access the dashboard. ${errorDetail}`,
            );
          }
          throw new Error(
            `Failed to fetch dashboard data: ${response.status} - ${errorDetail}`,
          );
        }

        const data: DashboardResponse = await response.json();
        console.log("Dashboard data received successfully:", data);
        setDashboardData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-gray-600">No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const {
    vehicleStatus,
    statistics,
    serviceReminders,
    workOrders,
    fleetByModel,
  } = dashboardData;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-10% via-white via-20% to-gray-800 to-55% ${operatorInfo ? operatorInfo.styling.background : "bg-white"}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">
            {operatorInfo
              ? `${operatorInfo.name} Fleet Manager Dashboard`
              : "Fleet Manager Dashboard"}
          </h1>
          {operatorInfo && (
            <span
              className={`rounded-md px-3 py-1 text-sm font-semibold ${operatorInfo.styling.brand}`}
            >
              {operatorInfo.name}
            </span>
          )}
        </div>

        {/* Vehicle Status Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Vehicle Status
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
              title="Total Vehicles"
              value={vehicleStatus.total}
              color="blue"
            />
            <StatCard
              title="Available"
              value={vehicleStatus.available}
              color="green"
            />
            <StatCard
              title="Booked"
              value={vehicleStatus.booked}
              color="purple"
            />
            <StatCard
              title="Under Maintenance"
              value={vehicleStatus.underMaintenance}
              color="red"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Fleet Statistics
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
              title="Total Models"
              value={statistics.totalModels}
              color="indigo"
            />
            <StatCard
              title="Average Mileage"
              value={`${Math.round(statistics.averageMileage).toLocaleString()} km`}
              color="blue"
            />
            <StatCard
              title="Daily Revenue Potential"
              value={`$${statistics.totalPotentialDailyRevenue.toFixed(2)}`}
              color="green"
            />
            <StatCard
              title="Utilization Rate"
              value={`${(statistics.utilizationRate * 100).toFixed(1)}%`}
              color="yellow"
            />
          </div>
        </div>

        {/* Service & Work Orders */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Service & Operations
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard
              title="Overdue Services"
              value={serviceReminders.overdue}
              color="red"
            />
            <StatCard
              title="Due Soon"
              value={serviceReminders.dueSoon}
              color="yellow"
            />
            <StatCard
              title="Active Work Orders"
              value={workOrders.active}
              color="blue"
            />
            <StatCard
              title="Pending Work Orders"
              value={workOrders.pending}
              color="purple"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Fleet Analytics
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Vehicle Status Distribution */}
            <VehicleStatusChart
              available={vehicleStatus.available}
              booked={vehicleStatus.booked}
              underMaintenance={vehicleStatus.underMaintenance}
            />

            {/* Revenue by Model */}
            <RevenueByModelChart fleetData={fleetByModel} />

            {/* Fleet Count by Model */}
            <FleetCountByModelChart fleetData={fleetByModel} />

            {/* Mileage Comparison */}
            <MileageComparisonChart fleetData={fleetByModel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetAdminDashboardPage;
