import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
// Vehicle drawer markup remains inline in this page (keeps behavior identical)
import { FLEET_API_BASE_URL } from "../config/api";
import { useFleetContext } from "../contexts/FleetContext";
// API Fleet Data type
type FleetTableData = {
  id: string;
  licensePlate: string;
  status: string;
  model?: string;
  manufacturer?: string;
  currentLocation?: string;
  imageUrl?: string;
  mileageKm?: number;
  dailyPrice?: number;
  availableFrom?: string | null;
  availableUntil?: string | null;
  maintenanceNote?: string | null;
  expectedReturnDate?: string | null;
  hasActiveBooking?: boolean; // NEW: For booking status
};

// API response item shape (partial)
type ApiFleetItem = {
  id: string;
  licensePlate: string;
  status: string;
  carModel?: {
    model?: string;
    manufacturer?: string;
    imageUrl?: string;
  };
  currentLocation?: string;
  mileageKm?: number;
  dailyPrice?: number;
  availableFrom?: string | null;
  availableUntil?: string | null;
  maintenanceNote?: string | null;
  expectedReturnDate?: string | null;
};

const FleetAdminListPage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<FleetTableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLicensePlate, setSearchLicensePlate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchModel, setSearchModel] = useState("");
  const [searchManufacturer, setSearchManufacturer] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetTableData | null>(
    null,
  );
  const [rawById, setRawById] = useState<Record<string, ApiFleetItem>>({});
  const [selectedVehicleRaw, setSelectedVehicleRaw] =
    useState<ApiFleetItem | null>(null);
  const { setFleet } = useFleetContext();

  // Formatting helpers
  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const formatCurrency = (n?: number | null) => {
    if (n == null) return "—";
    try {
      return new Intl.NumberFormat("en-SG", {
        style: "currency",
        currency: "SGD",
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return String(n);
    }
  };

  const formatNumber = (n?: number | null, unit = "km") =>
    n == null ? "—" : `${n.toLocaleString()} ${unit}`;

  // UPDATED: Fixed status normalization - only AVAILABLE and UNDER_MAINTENANCE
  const normalizeStatus = (s?: string | null) => {
    const code = (s || "").toString().toUpperCase();
    if (code === "AVAILABLE") return "AVAILABLE";
    if (code === "UNDER_MAINTENANCE" || code === "MAINTENANCE")
      return "UNDER_MAINTENANCE";
    return "AVAILABLE"; // Default fallback
  };

  // Define table columns
  const columns = useMemo<ColumnDef<FleetTableData>[]>(
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
        const mapped: FleetTableData[] = await Promise.all(
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
            setSelectedVehicle(row.original as FleetTableData);
            const raw = rawById[(row.original as FleetTableData).id];
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
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={() => setSelectedVehicle(null)}
          />

          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out sm:max-w-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Details
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close drawer"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 73px)" }}
            >
              <div className="p-6">
                <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={selectedVehicle.imageUrl ?? "/assets/default-car.png"}
                    alt={selectedVehicle.model ?? selectedVehicle.licensePlate}
                    className="h-64 w-full object-contain p-6"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-car.png";
                    }}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.model ?? selectedVehicle.licensePlate}
                  </h3>
                  <p className="mt-1 text-lg text-gray-600">
                    {selectedVehicle.manufacturer}
                  </p>
                </div>

                {/* UPDATED: Status badges - keep existing style, add booking badge */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {(() => {
                    const code = (selectedVehicle.status || "").toString();
                    const label =
                      code === "AVAILABLE" ? "Available" : "Under Maintenance";
                    const colorClass =
                      code === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800";
                    const dotClass =
                      code === "AVAILABLE" ? "bg-green-500" : "bg-red-500";

                    return (
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${colorClass}`}
                      >
                        <span className={`h-3 w-3 rounded-full ${dotClass}`} />
                        {label}
                      </span>
                    );
                  })()}

                  {/* NEW: Booking status badge */}
                  {selectedVehicle.hasActiveBooking && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                      <span className="h-3 w-3 rounded-full bg-blue-500" />
                      Currently Booked
                    </span>
                  )}
                </div>

                {/* Rest of drawer content - UNCHANGED */}
                <div className="mt-2 grid gap-3">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v4a1 1 0 001 1h3m10-6v4a1 1 0 01-1 1h-3M7 21h10M7 3h10"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Number Plate
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-lg font-bold text-gray-900">
                        {selectedVehicleRaw?.licensePlate ??
                          selectedVehicle.licensePlate}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.31.448 6.122 1.243M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Vehicle ID
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-sm text-gray-900">
                        {selectedVehicleRaw?.id ?? selectedVehicle.id}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M3 12h18M3 17h18"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Model
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                        {selectedVehicleRaw?.carModel?.model ??
                          selectedVehicle.model ??
                          "—"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M12 3v18"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Manufacturer
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {selectedVehicleRaw?.carModel?.manufacturer ??
                          selectedVehicle.manufacturer ??
                          "—"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Location
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {selectedVehicleRaw?.currentLocation ??
                          selectedVehicle.currentLocation ??
                          "—"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14v7"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Mileage
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {formatNumber(
                          selectedVehicleRaw?.mileageKm ??
                            selectedVehicle.mileageKm,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-3.314 0-6 1.343-6 3v4h12v-4c0-1.657-2.686-3-6-3z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Daily Price
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {formatCurrency(
                          selectedVehicleRaw?.dailyPrice ??
                            selectedVehicle.dailyPrice,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Available From
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {formatDate(
                          selectedVehicleRaw?.availableFrom ??
                            selectedVehicle.availableFrom,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-1 flex items-center gap-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Available Until
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm text-gray-900">
                        {formatDate(
                          selectedVehicleRaw?.availableUntil ??
                            selectedVehicle.availableUntil,
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-3 items-start gap-4">
                      <div className="col-span-1 flex items-start gap-3">
                        <svg
                          className="mt-1 h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m2 0a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h.01"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">
                          Maintenance Note
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-sm whitespace-pre-wrap text-gray-900">
                        {selectedVehicleRaw?.maintenanceNote ??
                          selectedVehicle.maintenanceNote ??
                          "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVehicleRaw && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      Full backend payload
                    </h4>
                    <pre className="max-h-64 overflow-auto rounded-md bg-gray-800 p-3 text-xs text-white">
                      {JSON.stringify(selectedVehicleRaw, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="mt-8">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">
                    Vehicle Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Registration
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Singapore registered vehicle
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/manager/eagle-view?vehicle=${encodeURIComponent(
                        selectedVehicle.licensePlate ?? "",
                      )}`}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md"
                      onClick={() => setSelectedVehicle(null)}
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Last Known Location
                        </p>
                        <p className="mt-1 text-sm font-medium text-indigo-600">
                          View on Eagle View →
                        </p>
                      </div>
                    </Link>

                    {selectedVehicle.status === "AVAILABLE" && (
                      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">
                            Ready for Booking
                          </p>
                          <p className="mt-1 text-sm text-green-700">
                            This vehicle is available for immediate rental
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedVehicle.status === "UNDER_MAINTENANCE" && (
                      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">
                            Under Maintenance
                          </p>
                          <p className="mt-1 text-sm text-red-700">
                            Vehicle is currently being serviced
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {selectedVehicle.status === "AVAILABLE" &&
                    !selectedVehicle.hasActiveBooking && (
                      <button className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                        Book This Vehicle
                      </button>
                    )}
                  <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                    View Full History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FleetAdminListPage;
