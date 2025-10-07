import React, { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../config/api";
import MockFleetSimulator, { type Vehicle } from "../services/mockFleetService";

const HEADER_TOTAL_REM = 7.5; // role banner + navbar approx in rem -> used in calc

const EagleViewPage: React.FC = () => {
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

    const simulator = new MockFleetSimulator(18, 2000);

    const sub = simulator.subscribe((vehicles: Vehicle[]) => {
      const map = mapInstance.current;
      if (!map) return;

      const currentVehicleIds = new Set(vehicles.map((v) => v.id));

      vehicles.forEach((v) => {
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
  }, []);

  useEffect(() => {
    markersRef.current.forEach((entry, id) => {
      const { vehicle } = entry;
      const popupEl = entry.popup.getElement();
      const plate = (vehicle.numberPlate || "").toLowerCase();
      const isMatch =
        normalizedSearch.length > 0 && plate.includes(normalizedSearch);
      const isSelected = selectedVehicle?.id === id;

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
  }, [normalizedSearch, selectedVehicle]);

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

          <div className="absolute top-6 right-6 z-30 rounded-md bg-white/80 p-3 shadow backdrop-blur">
            <label htmlFor="search-plate" className="sr-only">
              Search vehicles
            </label>
            <input
              id="search-plate"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search number plate (e.g. SABC)"
              className="w-64 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
          `}</style>
        </>
      )}
    </div>
  );
};

export default EagleViewPage;
