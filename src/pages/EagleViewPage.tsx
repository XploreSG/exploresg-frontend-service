import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../config/api";
import MockFleetSimulator, {
  type Vehicle,
  type CarData,
} from "../services/mockFleetService";
import { CAR_DATA } from "../data/fleetData";
import { useFleetContext, type ApiFleetItem } from "../contexts/FleetContext";

const HEADER_TOTAL_REM = 7.5; // role banner + navbar approx in rem -> used in calc

const EagleViewPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<
    Map<
      string,
      {
        marker: mapboxgl.Marker;
        popup: mapboxgl.Popup;
        el: HTMLElement;
        vehicle: Vehicle;
      }
    >
  >(new Map());

  const [search, setSearch] = useState("");
  const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Available" | "In Use" | "Maintenance"
  >("All");

  // Consume shared fleet data (published by FleetAdminListPage)
  const { fleet } = useFleetContext();

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.warn("MAPBOX_TOKEN is not set. Map will not initialize.");
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [103.83, 1.34],
        zoom: 13,
      });

      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right",
      );
    }

    // Curated land-safe coordinates around Singapore (avoid sea areas)
    // These are representative points around Orchard, Marina Bay, Tiong Bahru, Toa Payoh, Bishan, Kallang
    const SINGAPORE_LAND_COORDS: { lat: number; lng: number }[] = [
      { lat: 1.3048, lng: 103.8318 }, // Tiong Bahru
      { lat: 1.3006, lng: 103.8414 }, // Outram Park
      { lat: 1.2903, lng: 103.852 }, // Chinatown area
      { lat: 1.2833, lng: 103.8607 }, // Marina Bay Sands
      { lat: 1.3039, lng: 103.8339 }, // Redhill
      { lat: 1.3228, lng: 103.8436 }, // Toa Payoh
      { lat: 1.3521, lng: 103.8198 }, // Bishan
      { lat: 1.3078, lng: 103.831 }, // Outram/Lower Delta
      { lat: 1.3, lng: 103.847 }, // Kampong Glam
      { lat: 1.2921, lng: 103.7764 }, // Sentosa (coast but safe)
      { lat: 1.311, lng: 103.8636 }, // Kallang
      { lat: 1.2956, lng: 103.8583 }, // Marina Boulevard
      { lat: 1.3157, lng: 103.8314 }, // Alexandra
      { lat: 1.333, lng: 103.7036 }, // West area (near Jurong East)
    ];

    // Deterministic chooser: pick one of the land coords by hashing id + index
    const pickLandCoord = (id: string, index: number) => {
      let h = 0;
      const key = `${id}-${index}`;
      for (let i = 0; i < key.length; i++) h = (h << 5) - h + key.charCodeAt(i);
      const idx = Math.abs(h) % SINGAPORE_LAND_COORDS.length;
      const base = SINGAPORE_LAND_COORDS[idx];
      // small jitter to avoid perfect overlap
      const jitter = ((Math.abs(h) % 100) / 10000) * 0.005; // tiny jitter
      return { lat: base.lat + jitter, lng: base.lng + jitter };
    };
    // Build seed vehicles from shared fleet (ApiFleetItem) or fallback to CAR_DATA
    type SourceItem = ApiFleetItem | CarData;
    const source = fleet && fleet.length > 0 ? (fleet as ApiFleetItem[]) : null;
    const sourceItems: SourceItem[] =
      source ?? (CAR_DATA as unknown as SourceItem[]);

    const isApiFleetItem = (it: SourceItem): it is ApiFleetItem =>
      (it as ApiFleetItem).licensePlate !== undefined ||
      (it as ApiFleetItem).id !== undefined;

    const seedVehicles: Vehicle[] = sourceItems.map((item, idx) => {
      const id = isApiFleetItem(item) ? item.id : `sim-${idx}`;
      const plate = isApiFleetItem(item)
        ? item.licensePlate
        : (item as CarData).numberPlate;
      const model = isApiFleetItem(item)
        ? (item.carModel?.model ??
          item.carModel?.manufacturer ??
          item.licensePlate ??
          "Vehicle")
        : ((item as CarData).model ?? (item as CarData).name ?? "Vehicle");
      const img = isApiFleetItem(item)
        ? (item.carModel?.imageUrl ?? "/assets/default-car.png")
        : `/assets/cars-logo/${(item as CarData).file}`;
      const rawStatus = (
        isApiFleetItem(item) ? item.status : (item as CarData).status
      ) as string | undefined;
      const normalize = (s?: string | null) => {
        const c = (s || "").toString();
        if (c === "AVAILABLE" || c === "Available") return "Available";
        if (
          c === "IN_USE" ||
          c === "In Use" ||
          c === "BOOKED" ||
          c === "Booked"
        )
          return "In Use";
        return c || "Available";
      };
      const status = normalize(rawStatus) as Vehicle["status"];
      // If API provided a location string with coordinates, try to parse it as "lat,lng"
      let lat: number;
      let lng: number;
      const supplied = isApiFleetItem(item) ? item.currentLocation : undefined;
      if (supplied && typeof supplied === "string" && supplied.includes(",")) {
        const parts = supplied.split(",").map((p) => p.trim());
        const maybeLat = Number(parts[0]);
        const maybeLng = Number(parts[1]);
        if (!Number.isNaN(maybeLat) && !Number.isNaN(maybeLng)) {
          lat = maybeLat;
          lng = maybeLng;
        } else {
          ({ lng, lat } = pickLandCoord(String(id), idx));
        }
      } else {
        ({ lng, lat } = pickLandCoord(String(id), idx));
      }
      return {
        id: String(id),
        numberPlate: plate,
        name: model,
        model: model,
        imageUrl: img,
        status: status as Vehicle["status"],
        lat,
        lng,
      } as Vehicle;
    });

    // Instantiate simulator (constructor expects CarData[]); use CAR_DATA then override vehicles
    const simulator = new MockFleetSimulator(CAR_DATA, undefined, 2000);
    // override internal vehicles snapshot (use unknown cast to avoid 'any')
    (simulator as unknown as { vehicles: Vehicle[] }).vehicles = seedVehicles;
    // Note: don't call private emit method directly (loses `this` binding).
    // subscribe() will immediately receive the current snapshot and start() will
    // trigger periodic updates.

    const sub = simulator.subscribe((vehicleData: Vehicle[]) => {
      const map = mapInstance.current;
      if (!map) return;

      setVehicles(vehicleData);
      const currentVehicleIds = new Set(vehicleData.map((v) => v.id));

      vehicleData.forEach((v) => {
        const entry = markersRef.current.get(v.id);

        if (entry) {
          entry.marker.setLngLat([v.lng, v.lat]);
          entry.vehicle = v; // Update vehicle data
          const popupElement = entry.popup
            .getElement()
            ?.querySelector(".popup-content");
          if (popupElement) {
            popupElement.textContent = v.numberPlate || "--";
          }
          entry.popup.setLngLat([v.lng, v.lat]);
        } else {
          const el = document.createElement("div");
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.borderRadius = "9999px";
          el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
          el.style.border = "2px solid white";
          el.style.background = "#4f46e5"; // Initial color
          el.style.cursor = "pointer";

          el.addEventListener("click", () => {
            setSelectedVehicle(v);
          });

          const popupNode = document.createElement("div");
          popupNode.className = "popup-label";

          const popupContent = document.createElement("span");
          popupContent.className = "popup-content";
          popupContent.textContent = v.numberPlate || "--";
          popupNode.appendChild(popupContent);

          const popup = new mapboxgl.Popup({
            offset: 12,
            closeButton: false,
            closeOnClick: false,
          })
            .setDOMContent(popupNode)
            .setLngLat([v.lng, v.lat])
            .addTo(map);

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([v.lng, v.lat])
            .addTo(map);

          markersRef.current.set(v.id, { marker, popup, el, vehicle: v });
        }
      });

      markersRef.current.forEach((value, id) => {
        if (!currentVehicleIds.has(id)) {
          value.marker.remove();
          value.popup.remove();
          markersRef.current.delete(id);
        }
      });
    });

    simulator.start();

    const map = mapInstance.current;
    const markers = markersRef.current;

    return () => {
      sub();
      simulator.stop();
      if (map) {
        map.remove();
      }
      mapInstance.current = null;
      markers.clear();
    };
  }, [fleet]);

  useEffect(() => {
    markersRef.current.forEach((entry, id) => {
      const { vehicle } = entry;
      const popupEl = entry.popup.getElement();
      const plate = (vehicle.numberPlate || "").toLowerCase();
      const isMatch =
        normalizedSearch.length > 0 && plate.includes(normalizedSearch);
      const isSelected = selectedVehicle?.id === id;

      // Check if vehicle passes status filter
      const passesStatusFilter =
        statusFilter === "All" || vehicle.status === statusFilter;

      // Check if vehicle passes search filter
      const passesSearchFilter =
        !normalizedSearch || plate.includes(normalizedSearch);

      // Show/hide marker based on filters
      const shouldShow = passesStatusFilter && passesSearchFilter;

      if (shouldShow) {
        entry.marker.getElement().style.display = "block";
        if (popupEl) {
          popupEl.style.display = "block";
        }
      } else {
        entry.marker.getElement().style.display = "none";
        if (popupEl) {
          popupEl.style.display = "none";
        }
        return; // Skip styling hidden markers
      }

      const popupLabel = popupEl?.querySelector<HTMLElement>(".popup-label");

      // Define colors
      const colors = {
        selected: {
          marker: "#ef4444", // red-500
          popupBg: "#ef4444",
          popupText: "white",
        },
        status: {
          Available: {
            marker: "#22c55e", // green-500
            popupBg: "#22c55e",
            popupText: "white",
          },
          "In Use": {
            marker: "#f59e0b", // amber-500
            popupBg: "#f59e0b",
            popupText: "white",
          },
          Maintenance: {
            marker: "#ef4444", // red-500
            popupBg: "#ef4444",
            popupText: "white",
          },
        },
        default: {
          marker: "#4f46e5", // indigo-600
          popupBg: "white",
          popupText: "#374151", // gray-700
        },
      };

      if (isSelected || isMatch) {
        entry.el.style.transform = "scale(1.6)";
        entry.el.style.background = colors.selected.marker;
        if (popupLabel) {
          popupLabel.style.backgroundColor = colors.selected.popupBg;
          popupLabel.style.color = colors.selected.popupText;
        }
      } else {
        entry.el.style.transform = "scale(1)";
        const statusColors =
          colors.status[vehicle.status as keyof typeof colors.status] ||
          colors.default;
        entry.el.style.background = statusColors.marker;
        if (popupLabel) {
          popupLabel.style.backgroundColor = statusColors.popupBg;
          popupLabel.style.color = statusColors.popupText;
        }
      }
    });
  }, [normalizedSearch, selectedVehicle, statusFilter]);

  // Filter vehicles based on search and status
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Filter by search
    if (normalizedSearch) {
      filtered = filtered.filter((v) =>
        (v.numberPlate || "").toLowerCase().includes(normalizedSearch),
      );
    }

    return filtered;
  }, [vehicles, normalizedSearch, statusFilter]);

  // Handle vehicle card click
  const handleVehicleCardClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // Center map on selected vehicle
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [vehicle.lng, vehicle.lat],
        zoom: 15,
        duration: 1000,
      });
    }
  };

  // Handle URL parameter for direct vehicle selection
  useEffect(() => {
    const vehicleParam = searchParams.get("vehicle");
    if (vehicleParam && vehicles.length > 0) {
      // Find vehicle by number plate
      const vehicle = vehicles.find(
        (v) => v.numberPlate?.toLowerCase() === vehicleParam.toLowerCase(),
      );

      if (vehicle) {
        // Select the vehicle
        setSelectedVehicle(vehicle);

        // Zoom to the vehicle on map
        if (mapInstance.current) {
          mapInstance.current.flyTo({
            center: [vehicle.lng, vehicle.lat],
            zoom: 16,
            duration: 1500,
          });
        }

        // Clear the URL parameter after handling
        searchParams.delete("vehicle");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, vehicles, setSearchParams]);

  return (
    <div className="relative h-full w-full">
      {!MAPBOX_TOKEN ? (
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold">Eagle View</h1>
          <div className="rounded-md border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
            MAPBOX_TOKEN is not configured. The map cannot be shown. Please set
            VITE_MAPBOX_TOKEN in your environment.
          </div>
        </div>
      ) : (
        <>
          <div
            style={{ height: `calc(100vh - ${HEADER_TOTAL_REM}rem)` }}
            className="w-full"
          >
            <div ref={mapContainer} className="h-full w-full" />
          </div>

          {/* Search Bar and Vehicle List Panel */}
          <div className="absolute top-6 right-6 z-30 w-80 space-y-3">
            {/* Search Bar */}
            <div className="rounded-md bg-white/80 p-3 shadow backdrop-blur">
              <label htmlFor="search-plate" className="sr-only">
                Search vehicles
              </label>
              <input
                id="search-plate"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search number plate (e.g. SABC)"
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="rounded-md bg-white/80 p-2 shadow backdrop-blur">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    statusFilter === "All"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("Available")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    statusFilter === "Available"
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setStatusFilter("In Use")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    statusFilter === "In Use"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  In Use
                </button>
                <button
                  onClick={() => setStatusFilter("Maintenance")}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                    statusFilter === "Maintenance"
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Out of Service
                </button>
              </div>
            </div>

            {/* Vehicle List */}
            <div
              className="vehicle-list overflow-y-auto rounded-md bg-white/90 shadow-lg backdrop-blur"
              style={{
                maxHeight: `calc(100vh - ${HEADER_TOTAL_REM}rem - 8rem)`,
              }}
            >
              <div className="space-y-2 p-2">
                {filteredVehicles.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {normalizedSearch
                      ? "No vehicles found"
                      : "No vehicles available"}
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleCardClick(vehicle)}
                      className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                        selectedVehicle?.id === vehicle.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Vehicle Thumbnail */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.name || "Vehicle"}
                          className="h-full w-full object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/default-car.png";
                          }}
                        />
                      </div>

                      {/* Vehicle Info */}
                      <div className="flex-1 text-left">
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {vehicle.numberPlate}
                        </div>
                        <div className="truncate text-xs text-gray-600">
                          {vehicle.name}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              vehicle.status === "Available"
                                ? "bg-green-500"
                                : vehicle.status === "In Use"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              vehicle.status === "Available"
                                ? "text-green-600"
                                : vehicle.status === "In Use"
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-indigo-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Detail Overlay */}
          {selectedVehicle && (
            <div className="absolute bottom-6 left-6 z-30 w-80 rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedVehicle.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedVehicle.model}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close vehicle details"
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

              <div className="mt-4">
                <img
                  src={selectedVehicle.imageUrl}
                  alt={`Image of ${selectedVehicle.name}`}
                  className="h-auto w-full rounded-md object-cover"
                />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">
                    Number Plate
                  </span>
                  <span className="font-mono text-gray-800">
                    {selectedVehicle.numberPlate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Status</span>
                  <span
                    className={`font-bold ${
                      selectedVehicle.status === "Available"
                        ? "text-green-600"
                        : selectedVehicle.status === "In Use"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {selectedVehicle.status}
                  </span>
                </div>
                {selectedVehicle.driver && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">Driver</span>
                    <span className="text-gray-800">
                      {selectedVehicle.driver}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <style>{`
            .mapboxgl-popup-content {
              padding: 0;
              border-radius: 0.375rem;
              background: transparent;
              box-shadow: none;
            }
            .popup-label { 
              white-space: nowrap; 
              padding: 0.25rem 0.75rem; 
              border-radius: 0.375rem;
              background-color: white;
              color: #374151;
              font-weight: 600;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              transition: background-color 0.2s, color 0.2s;
            }
            
            /* Minimalist scrollbar */
            .vehicle-list::-webkit-scrollbar {
              width: 6px;
            }
            .vehicle-list::-webkit-scrollbar-track {
              background: transparent;
            }
            .vehicle-list::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.4);
              border-radius: 3px;
            }
            .vehicle-list::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.6);
            }
            /* Firefox */
            .vehicle-list {
              scrollbar-width: thin;
              scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default EagleViewPage;
