import React from "react";
import { useParams } from "react-router-dom";

// Mock data for a single fleet item
const fleetDetails = {
  "1": {
    name: "Toyota Camry",
    model: "2023",
    licensePlate: "SGA1234B",
    mileage: "15,000 km",
    nextService: "2024-12-01",
  },
  "2": {
    name: "Honda Civic",
    model: "2022",
    licensePlate: "SGE5678C",
    mileage: "25,000 km",
    nextService: "2024-11-15",
  },
  "3": {
    name: "BMW X5",
    model: "2023",
    licensePlate: "SGB9101D",
    mileage: "10,000 km",
    nextService: "2025-02-01",
  },
};

const FleetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicle = id ? fleetDetails[id as keyof typeof fleetDetails] : null;

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">Vehicle not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{vehicle.name}</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p>
          <strong>Model:</strong> {vehicle.model}
        </p>
        <p>
          <strong>License Plate:</strong> {vehicle.licensePlate}
        </p>
        <p>
          <strong>Mileage:</strong> {vehicle.mileage}
        </p>
        <p>
          <strong>Next Service:</strong> {vehicle.nextService}
        </p>
      </div>
    </div>
  );
};

export default FleetDetailPage;
