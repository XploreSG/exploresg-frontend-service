import React, { useMemo, useState } from "react";
import { StatCard } from "../components/fleet/StatCard";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { CAR_DATA } from "../data/fleetData";
import type { CarData } from "../services/mockFleetService";

// Extend CarData with ID for table usage
type FleetTableData = CarData & { id: string };

const FleetAdminListPage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetTableData | null>(
    null,
  );

  // Transform CAR_DATA to include IDs
  const data = useMemo<FleetTableData[]>(
    () =>
      CAR_DATA.map((car, index) => ({
        ...car,
        id: `fleet-${index + 1}`,
      })),
    [],
  );

  // Define table columns
  const columns = useMemo<ColumnDef<FleetTableData>[]>(
    () => [
      {
        accessorKey: "file",
        header: "Image",
        cell: (info) => (
          <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white">
            <img
              src={`/assets/cars-logo/${info.getValue() as string}`}
              alt={info.row.original.name}
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
        accessorKey: "name",
        header: "Vehicle Name",
        cell: (info) => (
          <div>
            <div className="font-semibold text-gray-900">
              {info.getValue() as string}
            </div>
            <div className="text-sm text-gray-500">
              {info.row.original.model}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "numberPlate",
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                status === "Available"
                  ? "bg-green-100 text-green-800"
                  : status === "In Use"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "Available"
                    ? "bg-green-500"
                    : status === "In Use"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              />
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
    ],
    [],
  );

  // Apply status filter before creating table
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: data.length,
      available: data.filter((v) => v.status === "Available").length,
      inUse: data.filter((v) => v.status === "In Use").length,
      maintenance: data.filter((v) => v.status === "Maintenance").length,
    };
  }, [data]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and monitor your vehicle fleet
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Fleet"
          value={stats.total}
          color="blue"
          subtitle="All vehicles in the fleet"
        />
        <StatCard
          title="Available"
          value={stats.available}
          color="green"
          subtitle="Ready for rental"
        />
        <StatCard
          title="In Use"
          value={stats.inUse}
          color="yellow"
          subtitle="Currently rented"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenance}
          color="red"
          subtitle="Being serviced"
        />
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {/* Search and Filters */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="flex-1 md:max-w-md">
              <label htmlFor="search" className="sr-only">
                Search fleet
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, model, or plate..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  statusFilter === "all"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter("Available")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  statusFilter === "Available"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Available ({stats.available})
              </button>
              <button
                onClick={() => setStatusFilter("In Use")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  statusFilter === "In Use"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                In Use ({stats.inUse})
              </button>
              <button
                onClick={() => setStatusFilter("Maintenance")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  statusFilter === "Maintenance"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Maintenance ({stats.maintenance})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                              }[header.column.getIsSorted() as string] ?? "↕"}
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
              {table.getRowModel().rows.length === 0 ? (
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
                    onClick={() => setSelectedVehicle(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {table.getFilteredRowModel().rows.length}
                </span>{" "}
                results
              </p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="rounded-md border border-gray-300 py-1 pr-8 pl-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {[5, 10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
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
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
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
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
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
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
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
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
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
                    src={`/assets/cars-logo/${selectedVehicle.file}`}
                    alt={selectedVehicle.name}
                    className="h-64 w-full object-contain p-6"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/default-car.png";
                    }}
                  />
                </div>

                {/* Vehicle Name & Model */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.name}
                  </h3>
                  <p className="mt-1 text-lg text-gray-600">
                    {selectedVehicle.model}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedVehicle.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : selectedVehicle.status === "In Use"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${
                        selectedVehicle.status === "Available"
                          ? "bg-green-500"
                          : selectedVehicle.status === "In Use"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    {selectedVehicle.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Number Plate
                      </span>
                      <span className="font-mono text-lg font-bold text-gray-900">
                        {selectedVehicle.numberPlate}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Vehicle ID
                      </span>
                      <span className="font-mono text-sm text-gray-900">
                        {selectedVehicle.id}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Model
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedVehicle.model}
                      </span>
                    </div>
                  </div>
                </div>

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
                      to={`/manager/eagle-view?vehicle=${encodeURIComponent(selectedVehicle.numberPlate)}`}
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

                    {selectedVehicle.status === "Available" && (
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

                    {selectedVehicle.status === "In Use" && (
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

                    {selectedVehicle.status === "Maintenance" && (
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
                  {selectedVehicle.status === "Available" && (
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
