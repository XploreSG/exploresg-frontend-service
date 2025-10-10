import React, { useMemo, useState } from "react";
// no local Link usage; VehicleDrawer handles its own links
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import FleetSearchFilters from "../components/FleetSearchFilters";
import FleetTable from "../components/FleetTable";
import FleetPagination from "../components/FleetPagination";
import VehicleDrawer from "../components/VehicleDrawer";
import { FLEET_API_BASE_URL } from "../config/api";
import { useFleetContext } from "../contexts/FleetContext";
import type { VehicleRow, ApiFleetItem } from "../types/vehicle";

const FleetAdminListPage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLicensePlate, setSearchLicensePlate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchModel, setSearchModel] = useState("");
  const [searchManufacturer, setSearchManufacturer] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(
    null,
  );
  const [rawById, setRawById] = useState<Record<string, ApiFleetItem>>({});
  const [selectedVehicleRaw, setSelectedVehicleRaw] =
    useState<ApiFleetItem | null>(null);
  const { setFleet } = useFleetContext();

  // Formatting handled inside VehicleDrawer; keep page focused on data & table

  // UPDATED: Fixed status normalization - only AVAILABLE and UNDER_MAINTENANCE
  const normalizeStatus = (s?: string | null) => {
    const code = (s || "").toString().toUpperCase();
    if (code === "AVAILABLE") return "AVAILABLE";
    if (code === "UNDER_MAINTENANCE" || code === "MAINTENANCE")
      return "UNDER_MAINTENANCE";
    return "AVAILABLE"; // Default fallback
  };

  // Define table columns
  const columns = useMemo<ColumnDef<VehicleRow>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">
            <img
              src={(info.getValue() as string) || "/assets/default-car.png"}
              alt={info.row.original.model || info.row.original.licensePlate}
              className="h-full w-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.src = "/assets/default-car.png";
              }}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "licensePlate",
        header: "License Plate",
        cell: (info) => (
          <span className="font-mono text-sm font-semibold text-gray-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "model",
        header: "Model",
        cell: (info) => (
          <span className="text-sm text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: (info) => (
          <span className="text-sm text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "currentLocation",
        header: "Location",
        cell: (info) => (
          <span className="text-sm text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Operational",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${status === "AVAILABLE" ? "bg-green-500" : "bg-red-500"}`}
              />
              {status === "AVAILABLE" ? "Available" : "Maintenance"}
            </span>
          );
        },
      },
      {
        accessorKey: "hasActiveBooking",
        header: "Booking",
        cell: (info) => {
          const hasBooking = info.getValue() as boolean;
          return hasBooking ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Booked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              No Booking
            </span>
          );
        },
        enableSorting: false,
      },
    ],
    [],
  );

  // UPDATED: Fetch fleet data with booking status
  React.useEffect(() => {
    setLoading(true);
    setError(null);

    const params: Record<string, string | number | boolean | undefined> = {
      page: pageIndex,
      size: pageSize,
      sortBy: (sorting[0]?.id as string) || "licensePlate",
      sortDirection: sorting[0]?.desc ? "desc" : "asc",
      licensePlate: searchLicensePlate,
      status: selectedStatus,
      model: searchModel,
      manufacturer: searchManufacturer,
      location: searchLocation,
    };

    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&");

    const apiUrl = `${FLEET_API_BASE_URL}/api/v1/fleet/operators/fleet/all/paginated${query ? `?${query}` : ""}`;

    const token = localStorage.getItem("token");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(apiUrl, { method: "GET", headers, credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch fleet data");
        return res.json();
      })
      .then(async (result) => {
        const content = (result.content || []) as ApiFleetItem[];

        // UPDATED: Fetch booking status for all vehicles
        const mapped: VehicleRow[] = await Promise.all(
          content.map(async (item) => {
            let hasActiveBooking = false;
            try {
              const bookingResponse = await fetch(
                `${FLEET_API_BASE_URL}/api/v1/fleet/booking-records/vehicle/${item.id}/is-booked`,
                { headers, credentials: "include" },
              );
              if (bookingResponse.ok) {
                const bookingData = await bookingResponse.json();
                hasActiveBooking = bookingData.isBooked || false;
              }
            } catch (err) {
              console.warn(`Failed to check booking for ${item.id}`, err);
            }

            return {
              id: item.id,
              licensePlate: item.licensePlate,
              status: normalizeStatus(item.status),
              model: item.carModel?.model,
              manufacturer: item.carModel?.manufacturer,
              imageUrl: item.carModel?.imageUrl,
              currentLocation: item.currentLocation,
              mileageKm: item.mileageKm,
              dailyPrice: item.dailyPrice,
              availableFrom: item.availableFrom,
              availableUntil: item.availableUntil,
              maintenanceNote: item.maintenanceNote,
              expectedReturnDate: item.expectedReturnDate,
              hasActiveBooking,
            };
          }),
        );

        setData(mapped);
        setTotalCount(result.totalElements || 0);
        const map: Record<string, ApiFleetItem> = {};
        content.forEach((it) => (map[it.id] = it));
        setRawById(map);
        setFleet(content);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load fleet data");
      })
      .finally(() => setLoading(false));
  }, [
    pageIndex,
    pageSize,
    sorting,
    searchLicensePlate,
    selectedStatus,
    searchModel,
    searchManufacturer,
    searchLocation,
    setFleet,
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize } as PaginationState,
    },
    onSortingChange: setSorting,
    onPaginationChange: (
      updater: PaginationState | ((old: PaginationState) => PaginationState),
    ) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      if (next) {
        if (typeof next.pageIndex === "number") setPageIndex(next.pageIndex);
        if (typeof next.pageSize === "number") setPageSize(next.pageSize);
      }
    },
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(totalCount / pageSize)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and monitor your vehicle fleet
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <FleetSearchFilters
          searchLicensePlate={searchLicensePlate}
          setSearchLicensePlate={setSearchLicensePlate}
          searchModel={searchModel}
          setSearchModel={setSearchModel}
          searchManufacturer={searchManufacturer}
          setSearchManufacturer={setSearchManufacturer}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          setPageIndex={setPageIndex}
        />

        <FleetTable
          table={table}
          data={data}
          columnsCount={columns.length}
          loading={loading}
          error={error}
          onRowClick={(row) => {
            setSelectedVehicle(row.original as VehicleRow);
            const raw = rawById[(row.original as VehicleRow).id];
            setSelectedVehicleRaw(raw ?? null);
          }}
        />

        <FleetPagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      </div>

      {selectedVehicle && (
        <VehicleDrawer
          selectedVehicle={selectedVehicle}
          selectedVehicleRaw={selectedVehicleRaw}
          onRequestClose={() => {
            // clear selection after drawer requests close
            setSelectedVehicle(null);
            setSelectedVehicleRaw(null);
          }}
        />
      )}
    </div>
  );
};

export default FleetAdminListPage;
