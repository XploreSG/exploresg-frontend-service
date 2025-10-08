export interface DashboardResponse {
  vehicleStatus: {
    available: number;
    underMaintenance: number;
    booked: number;
    total: number;
  };
  serviceReminders: {
    overdue: number;
    dueSoon: number;
  };
  workOrders: {
    active: number;
    pending: number;
  };
  vehicleAssignments: {
    assigned: number;
    unassigned: number;
  };
  statistics: {
    totalVehicles: number;
    totalModels: number;
    averageMileage: number;
    totalMileage: number;
    totalPotentialDailyRevenue: number;
    totalRevenue: number;
    utilizationRate: number;
  };
  fleetByModel: FleetByModel[];
}

export interface FleetByModel {
  manufacturer: string;
  model: string;
  imageUrl: string;
  totalCount: number;
  availableCount: number;
  bookedCount: number;
  underMaintenanceCount: number;
  averageMileage: number;
  averageDailyPrice: number;
}
