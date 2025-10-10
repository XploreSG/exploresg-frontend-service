import React from "react";

type Props = {
  searchLicensePlate: string;
  setSearchLicensePlate: (v: string) => void;
  searchModel: string;
  setSearchModel: (v: string) => void;
  searchManufacturer: string;
  setSearchManufacturer: (v: string) => void;
  searchLocation: string;
  setSearchLocation: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  setPageIndex: (n: number) => void;
};

const FleetSearchFilters: React.FC<Props> = ({
  searchLicensePlate,
  setSearchLicensePlate,
  searchModel,
  setSearchModel,
  searchManufacturer,
  setSearchManufacturer,
  searchLocation,
  setSearchLocation,
  selectedStatus,
  setSelectedStatus,
  setPageIndex,
}) => {
  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <input
            type="text"
            placeholder="License Plate"
            value={searchLicensePlate}
            onChange={(e) => {
              setSearchLicensePlate(e.target.value);
              setPageIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Model"
            value={searchModel}
            onChange={(e) => {
              setSearchModel(e.target.value);
              setPageIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Manufacturer"
            value={searchManufacturer}
            onChange={(e) => {
              setSearchManufacturer(e.target.value);
              setPageIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => {
              setSearchLocation(e.target.value);
              setPageIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPageIndex(0);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FleetSearchFilters;
