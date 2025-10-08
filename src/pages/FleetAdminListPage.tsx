import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { FLEET_API_BASE_URL } from "../config/api";
// import { CAR_DATA } from "../data/fleetData";
// import type { CarData } from "../services/mockFleetService";

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
  // Keep raw API items by id so we can show full backend payload in the drawer
  const [rawById, setRawById] = useState<Record<string, ApiFleetItem>>({});
  const [selectedVehicleRaw, setSelectedVehicleRaw] =
    useState<ApiFleetItem | null>(null);

  // Small formatting helpers
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
        header: "Number Plate",
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
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                status === "AVAILABLE"
                  ? "bg-green-100 text-green-800"
                  : status === "IN_USE"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "AVAILABLE"
                    ? "bg-green-500"
                    : status === "IN_USE"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              {status}
            </span>
          );
        },
      },
    ],
    [],
  );

  // Fetch fleet data from API (use same auth/header pattern as dashboard)
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
      .then((result) => {
        const content = (result.content || []) as ApiFleetItem[];
        const mapped: FleetTableData[] = content.map((item) => ({
          id: item.id,
          licensePlate: item.licensePlate,
          status: item.status,
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
        }));

        setData(mapped);
        setTotalCount(result.totalElements || 0);
        const map: Record<string, ApiFleetItem> = {};
        content.forEach((it) => (map[it.id] = it));
        setRawById(map);
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
  ]);

  // Create the table instance (manual pagination/sorting)
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

  // ...existing code...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and monitor your vehicle fleet
        </p>
      </div>
      {/* Main Table Card */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {/* Search and Filters */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Inputs */}
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
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading fleet data...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "flex cursor-pointer items-center gap-2 select-none hover:text-gray-700"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {{
                                  asc: "↑",
                                  desc: "↓",
                                }[header.column.getIsSorted() as string] ??
                                  "↕"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="font-medium">No vehicles found</p>
                        <p className="text-xs">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => {
                        setSelectedVehicle(row.original);
                        const raw = rawById[row.original.id];
                        setSelectedVehicleRaw(raw ?? null);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPageIndex((prev) => prev + 1)}
              disabled={(pageIndex + 1) * pageSize >= totalCount}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Showing {pageIndex * pageSize + 1} to{" "}
                {Math.min((pageIndex + 1) * pageSize, totalCount)} of{" "}
                {totalCount} results
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className="rounded-md border border-gray-300 py-1 pr-8 pl-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPageIndex(0)}
                  disabled={pageIndex === 0}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">First</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={pageIndex === 0}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pageIndex + 1} of{" "}
                  {Math.max(1, Math.ceil(totalCount / pageSize))}
                </span>
                <button
                  onClick={() => setPageIndex((prev) => prev + 1)}
                  disabled={(pageIndex + 1) * pageSize >= totalCount}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setPageIndex(
                      Math.max(0, Math.ceil(totalCount / pageSize) - 1),
                    )
                  }
                  disabled={(pageIndex + 1) * pageSize >= totalCount}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="sr-only">Last</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02zm-6 0a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Vehicle Details Drawer */}
      {selectedVehicle && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
            onClick={() => setSelectedVehicle(null)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-hidden bg-white shadow-xl transition-transform duration-300 ease-in-out sm:max-w-lg">
            {/* Drawer Header */}
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

            {/* Drawer Content - Scrollable */}
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 73px)" }}
            >
              <div className="p-6">
                {/* Vehicle Image */}
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

                {/* Vehicle Name & Model */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.model ?? selectedVehicle.licensePlate}
                  </h3>
                  <p className="mt-1 text-lg text-gray-600">
                    {selectedVehicle.manufacturer}
                  </p>
                </div>

                {/* Status Badge (map API codes to friendly labels/colors) */}
                <div className="mb-6">
                  {(() => {
                    const code = (selectedVehicle.status || "").toString();
                    const label =
                      code === "AVAILABLE"
                        ? "Available"
                        : code === "IN_USE"
                          ? "In Use"
                          : code === "UNDER_MAINTENANCE" ||
                              code === "MAINTENANCE"
                            ? "Under Maintenance"
                            : code;
                    const colorClass =
                      code === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : code === "IN_USE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800";
                    const dotClass =
                      code === "AVAILABLE"
                        ? "bg-green-500"
                        : code === "IN_USE"
                          ? "bg-amber-500"
                          : "bg-red-500";

                    return (
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${colorClass}`}
                      >
                        <span className={`h-3 w-3 rounded-full ${dotClass}`} />
                        {label}
                      </span>
                    );
                  })()}
                </div>

                {/* Details Table - prefer raw API fields when available */}
                <div className="mt-2 grid gap-3">
                  {/** Helper to render a label/value row with icon */}
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

                {/* Full backend payload (collapsible) */}
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

                {/* Additional Information Section */}
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

                    {selectedVehicle.status === "IN_USE" && (
                      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-900">
                            Currently Rented
                          </p>
                          <p className="mt-1 text-sm text-amber-700">
                            Vehicle is in active rental period
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedVehicle.status === "MAINTENANCE" && (
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

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  {selectedVehicle.status === "AVAILABLE" && (
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
