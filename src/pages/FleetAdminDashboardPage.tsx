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
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Example: fetchDashboardData().then(data => setDashboardData(data));

    // Mock data for demonstration - replace with actual API call
    const mockData: DashboardResponse = {
      vehicleStatus: {
        available: 47,
        underMaintenance: 12,
        booked: 0,
        total: 59,
      },
      serviceReminders: {
        overdue: 12,
        dueSoon: 0,
      },
      workOrders: {
        active: 12,
        pending: 0,
      },
      vehicleAssignments: {
        assigned: 0,
        unassigned: 47,
      },
      statistics: {
        totalVehicles: 59,
        totalModels: 9,
        averageMileage: 8081.677966101695,
        totalMileage: 476819,
        totalPotentialDailyRevenue: 7889.7,
        totalRevenue: 7889.7,
        utilizationRate: 0.0,
      },
      fleetByModel: [
        {
          manufacturer: "Peugeot",
          model: "Peugeot 5008",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/peugeot-5008.png",
          totalCount: 7,
          availableCount: 0,
          bookedCount: 0,
          underMaintenanceCount: 7,
          averageMileage: 14828.0,
          averageDailyPrice: 87.73,
        },
        {
          manufacturer: "Mini",
          model: "Mini Cooper",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/mini-cooper.png",
          totalCount: 6,
          availableCount: 6,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 761.0,
          averageDailyPrice: 114.71,
        },
        {
          manufacturer: "Toyota",
          model: "Toyota Prius",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/toyota-prius.png",
          totalCount: 7,
          availableCount: 7,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 3058.0,
          averageDailyPrice: 98.42,
        },
        {
          manufacturer: "BMW",
          model: "BMW Z4",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/bmw-z4.png",
          totalCount: 7,
          availableCount: 7,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 8380.0,
          averageDailyPrice: 154.46,
        },
        {
          manufacturer: "Maserati",
          model: "Maserati Grecale",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/maserati-grecale.png",
          totalCount: 5,
          availableCount: 0,
          bookedCount: 0,
          underMaintenanceCount: 5,
          averageMileage: 2193.0,
          averageDailyPrice: 155.98,
        },
        {
          manufacturer: "Toyota",
          model: "Toyota Alphard",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/toyota-alphard.png",
          totalCount: 7,
          availableCount: 7,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 4130.0,
          averageDailyPrice: 87.9,
        },
        {
          manufacturer: "BMW",
          model: "BMW M440i",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/bmw-440i.png",
          totalCount: 7,
          availableCount: 7,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 10792.0,
          averageDailyPrice: 204.63,
        },
        {
          manufacturer: "BMW",
          model: "BMW M240i",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/bmw-2.png",
          totalCount: 7,
          availableCount: 7,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 11734.0,
          averageDailyPrice: 188.72,
        },
        {
          manufacturer: "Skoda",
          model: "Skoda Octavia",
          imageUrl:
            "https://exploresg-swe5001-capstone-assets-prod.s3.ap-southeast-1.amazonaws.com/cars/skoda-octavia.png",
          totalCount: 6,
          availableCount: 6,
          bookedCount: 0,
          underMaintenanceCount: 0,
          averageMileage: 15139.0,
          averageDailyPrice: 111.42,
        },
      ],
    };

    setDashboardData(mockData);
    setIsLoading(false);
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Fleet Manager Dashboard</h1>

      {/* Vehicle Status Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
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
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
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
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
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
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
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
  );
};

export default FleetAdminDashboardPage;
