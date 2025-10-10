import { flexRender, type Table, type Row } from "@tanstack/react-table";

type Props<T> = {
  table: Table<T>;
  data: T[];
  columnsCount: number;
  loading: boolean;
  error: string | null;
  onRowClick: (row: Row<T>) => void;
};

const FleetTable = <T,>({
  table,
  data,
  columnsCount,
  loading,
  error,
  onRowClick,
}: Props<T>) => {
  return (
    <div className="relative overflow-x-auto">
      {/* Skeleton overlay: cross-fades with the table (dashboard pattern) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col gap-4 rounded-md bg-white/70 p-4 transition-opacity duration-300 ease-out ${
          loading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!loading}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-20 animate-pulse rounded bg-gray-300/70" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 animate-pulse rounded bg-gray-300/70" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200/70" />
          </div>
        </div>

        <div className="mt-2 rounded-md border border-gray-100 bg-white p-2">
          <div className="grid gap-3">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({
                length: Math.max(3, Math.min(columnsCount, 6)),
              }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 animate-pulse rounded bg-gray-300/70"
                />
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, r) => (
              <div key={r} className="grid grid-cols-6 gap-4">
                {Array.from({
                  length: Math.max(3, Math.min(columnsCount, 6)),
                }).map((_, c) => (
                  <div
                    key={c}
                    className="h-6 animate-pulse rounded bg-gray-200/70"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div
          className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
        >
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
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnsCount}
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
                    onClick={() => onRowClick(row)}
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
      )}
    </div>
  );
};

export default FleetTable;
