import React from "react";
import { Link } from "react-router-dom";

// Mock data for the fleet
const fleetData = [
  {
    id: "1",
    name: "Toyota Camry",
    status: "Available",
    location: "Changi Airport",
  },
  {
    id: "2",
    name: "Honda Civic",
    status: "Rented",
    location: "Marina Bay Sands",
  },
  { id: "3", name: "BMW X5", status: "Maintenance", location: "Woodlands" },
];

const FleetListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Fleet Management</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Vehicle
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Status
              </th>
              <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {fleetData.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  <Link
                    to={`/manager/fleet/${vehicle.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {vehicle.name}
                  </Link>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {vehicle.status}
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                  {vehicle.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FleetListPage;
