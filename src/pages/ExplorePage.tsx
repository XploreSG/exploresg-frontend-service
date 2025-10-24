import React, { useRef, useEffect, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Explore.css";
import { allPlacesGeoJSON, type PlaceType } from "../data/places";
import { MAPBOX_TOKEN } from "../config/api";
import {
  MapIcon,
  SparklesIcon,
  CalendarDaysIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { createRoot } from "react-dom/client";
import CollectButton from "../components/CollectButton";

// Use centralized MAPBOX_TOKEN that supports runtime env injection
mapboxgl.accessToken = MAPBOX_TOKEN;

// Constants for better maintainability
const MAP_CONFIG = {
  style: "mapbox://styles/mapbox/streets-v11",
  center: [103.8198, 1.3521] as [number, number],
  zoom: 11,
  minZoom: 9,
  maxZoom: 18,
} as const;

const POPUP_CONFIG = {
  offset: 25,
  closeButton: true,
  closeOnClick: false,
  maxWidth: "400px",
} as const;

// Type-based gradient themes (matching ContentCard)
const getTypeGradient = (type?: PlaceType): string => {
  switch (type) {
    case "attraction":
      return "from-violet-500/60 via-purple-500 to-emerald-600/40";
    case "event":
      return "from-blue-500/60 via-teal-500 to-emerald-600/40";
    case "food":
      return "from-orange-500/60 via-red-400 to-emerald-600/40";
    default:
      return "from-gray-500 via-slate-400 to-gray-600";
  }
};

// Get marker pin color based on type
const getMarkerColor = (type?: PlaceType): string => {
  switch (type) {
    case "attraction":
      return "#8b5cf6"; // Purple for attractions
    case "event":
      return "#06b6d4"; // Cyan/Teal for events
    case "food":
      return "#f97316"; // Orange for food
    default:
      return "#6b7280"; // Gray for default
  }
};

// switch (type) {
//   case "attraction":
//     // Attractions (Blue/Purple)
//     // return "from-blue-500 via-indigo-400 to-purple-600";
//     return "from-violet-500/30 via-purple-500 to-emerald-600/40";
//   case "event":
//     // Events (Red/Orange)
//     return "from-blue-500/30 via-teal-500 to-emerald-600/40";
//   case "food":
//     // Food (Green/Teal)
//     return "from-orange-500/30 via-red-400 to-emerald-600/40";
//   default:
//     // Default (Gray/Slate)
//     return "from-gray-500 via-slate-400 to-gray-600";
// }

// Generate ContentCard-styled HTML for popup
const createPopupHTML = (properties: GeoJSON.GeoJsonProperties): string => {
  if (!properties) return "";

  const gradientColors = getTypeGradient(properties.type as PlaceType);

  return `
    <div class="group relative w-full overflow-hidden rounded-xl shadow-lg" style="width: 380px; height: 180px;">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-r ${gradientColors} from-30% via-gray-300 via-60% to-gray-800 to-95%">
        <div class="absolute inset-0 bg-gradient-to-b from-blue-600/0 via-slate-600/10 to-indigo-600/0"></div>
      </div>

      <!-- Content - Horizontal Layout -->
      <div class="relative z-10 flex h-full flex-row p-3 gap-3">
        <!-- Image Section (Left Side) -->
        <div class="relative flex w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg">
          <img
            src="${properties.image || "/placeholder.jpg"}"
            alt="${properties.name}"
            class="h-full w-full object-cover drop-shadow-lg"
            onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'"
          />
          
          <!-- Shimmer Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>
          
          ${
            properties.status
              ? `
            <div class="absolute top-1 left-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 px-1.5 py-0.5 shadow-lg drop-shadow-2xl">
              <div class="text-center text-xs font-bold text-white">${properties.status}</div>
            </div>
          `
              : ""
          }
          
          ${
            properties.price
              ? `
            <div class="absolute top-1 right-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-1.5 py-0.5 shadow-lg drop-shadow-2xl">
              <div class="text-center text-xs font-bold text-white">${properties.price}</div>
            </div>
          `
              : ""
          }
        </div>

        <!-- Content Section (Right Side) -->
        <div class="flex flex-1 flex-col min-w-0">
          <!-- Header with Rating -->
          <div class="mb-1.5 flex items-start justify-between gap-2">
            <h3 class="line-clamp-2 flex-1 text-sm font-semibold leading-tight text-white">
              ${properties.name || "Unknown"}
            </h3>
            <div class="flex flex-shrink-0 items-center gap-1 rounded-md bg-black/20 px-1.5 py-0.5 text-yellow-400 backdrop-blur-sm">
              <span class="text-xs">★</span>
              <span class="text-xs font-semibold">${properties.rating || "N/A"}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="mb-2 line-clamp-3 text-xs text-gray-200">
            ${properties.description || ""}
          </p>

          <!-- Footer - Category & Location with Collect Button -->
          <div class="mt-auto flex items-end justify-between gap-2">
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <div class="flex items-center gap-1 text-xs text-gray-300">
                <span>📍</span>
                <span class="font-medium truncate">${properties.location || ""}</span>
              </div>
              <span class="self-start rounded-full bg-black/20 px-2 py-0.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                ${properties.category || ""}
              </span>
            </div>
            
            <!-- Collect Button Container -->
            <div class="flex-shrink-0" id="collect-button-${properties.id}"></div>
          </div>

          <!-- Animated Border -->
          <div class="absolute -bottom-4 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-400"></div>
        </div>
      </div>
    </div>
  `;
};

interface MarkerData {
  marker: mapboxgl.Marker;
  element: HTMLElement;
  popup: mapboxgl.Popup;
  type: PlaceType;
}

type FilterType = "all" | PlaceType;

const ExplorePage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  // Local map loading state (use a small inline loader instead of the global overlay)
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Function to update marker sizes based on zoom level
  const updateMarkerSizes = useCallback(() => {
    if (!mapInstance.current) return;

    const zoom = mapInstance.current.getZoom();
    const baseSize = 30;
    const minSize = 15;
    const maxSize = 40;

    // Calculate size based on zoom (zoom typically ranges from 9 to 18)
    const zoomFactor = Math.max(0.5, Math.min(1.5, (zoom - 8) / 10));
    const newSize = Math.max(minSize, Math.min(maxSize, baseSize * zoomFactor));

    markersRef.current.forEach(({ element }) => {
      element.style.width = `${newSize}px`;
      element.style.height = `${newSize}px`;
    });
  }, []);

  // Function to filter markers based on type
  const filterMarkers = useCallback((filterType: FilterType) => {
    if (!mapInstance.current) return;

    const visibleMarkers: MarkerData[] = [];

    markersRef.current.forEach((markerData) => {
      const shouldShow = filterType === "all" || markerData.type === filterType;

      if (shouldShow) {
        // Show marker
        markerData.marker.addTo(mapInstance.current!);
        visibleMarkers.push(markerData);
      } else {
        // Hide marker and close its popup
        markerData.popup.remove();
        markerData.element.classList.remove("marker-active");
        markerData.marker.remove();
      }
    });

    // Adjust map view to fit visible markers
    if (visibleMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      visibleMarkers.forEach((markerData) => {
        bounds.extend(markerData.marker.getLngLat());
      });

      mapInstance.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 150, left: 80, right: 80 },
        maxZoom: 14,
        duration: 800,
      });
    }
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterType: FilterType) => {
      setActiveFilter(filterType);
      filterMarkers(filterType);
    },
    [filterMarkers],
  );

  // Memoized marker creation function
  const createMarker = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point>, index: number) => {
      const { geometry, properties } = feature;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "marker";

      // Set marker color based on type
      const markerColor = getMarkerColor(properties?.type as PlaceType);
      el.style.backgroundColor = markerColor;

      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `View ${properties?.name || "place"}`);
      el.setAttribute("tabindex", "0");
      el.setAttribute("data-marker-id", index.toString());

      // Create popup with ContentCard styling
      const popup = new mapboxgl.Popup({
        ...POPUP_CONFIG,
        closeOnClick: false, // Don't close on map click
        closeButton: true, // Show close button
        closeOnMove: false, // Don't close when map moves
      }).setHTML(createPopupHTML(properties));

      // Mount collect button when popup opens
      popup.on("open", () => {
        const buttonContainer = document.getElementById(
          `collect-button-${properties?.id}`,
        );
        if (buttonContainer && properties) {
          const root = createRoot(buttonContainer);
          root.render(
            <CollectButton
              id={properties.id}
              name={properties.name}
              type={properties.type as PlaceType}
              variant="icon"
            />,
          );
        }
      });

      // Create marker instance with proper anchor
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      }).setLngLat(geometry.coordinates as [number, number]);

      // Store marker data with type
      const markerData: MarkerData = {
        marker,
        element: el,
        popup,
        type: properties?.type as PlaceType,
      };

      // Standard click behavior: toggle popup
      el.addEventListener("click", (e) => {
        e.stopPropagation();

        // Close all other popups
        markersRef.current.forEach((m) => {
          if (m !== markerData && m.popup.isOpen()) {
            m.popup.remove();
            m.element.classList.remove("marker-active");
          }
        });

        // Toggle this popup
        if (popup.isOpen()) {
          popup.remove();
          el.classList.remove("marker-active");
        } else {
          if (mapInstance.current) {
            popup.setLngLat(marker.getLngLat()).addTo(mapInstance.current);
            el.classList.add("marker-active");
          }
        }
      });

      // Keyboard support
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.click();
        }
      });

      // Listen for popup close to update marker state
      popup.on("close", () => {
        el.classList.remove("marker-active");
      });

      return markerData;
    },
    [],
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // mark local map loader visible while map initializes
    setIsMapLoading(true);

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        ...MAP_CONFIG,
      });

      // Add navigation controls
      map.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        "top-right",
      );

      // Add geolocate control
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "top-right",
      );

      // Add scale control
      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric",
        }),
        "bottom-left",
      );

      // Handle map load event
      map.on("load", () => {
        // hide local loader when map finished loading
        setIsMapLoading(false);

        // Add markers after map is loaded
        allPlacesGeoJSON.features.forEach((feature, index) => {
          const markerData = createMarker(feature, index);
          markerData.marker.addTo(map);
          markersRef.current.push(markerData);
        });

        // Initial marker size update
        updateMarkerSizes();

        // Fit map to markers bounds with padding
        if (allPlacesGeoJSON.features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          allPlacesGeoJSON.features.forEach((feature) => {
            bounds.extend(feature.geometry.coordinates as [number, number]);
          });
          map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 14,
          });
        }
      });

      // Handle zoom changes to resize markers
      map.on("zoom", updateMarkerSizes);

      // Handle errors
      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        setIsMapLoading(false);
      });

      // Close popups on map click
      map.on("click", () => {
        markersRef.current.forEach(({ popup, element }) => {
          if (popup.isOpen()) {
            popup.remove();
            element.classList.remove("marker-active");
          }
        });
      });

      // Close popups on escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          markersRef.current.forEach(({ popup, element }) => {
            if (popup.isOpen()) {
              popup.remove();
              element.classList.remove("marker-active");
            }
          });
        }
      };
      document.addEventListener("keydown", handleEscape);

      mapInstance.current = map;

      // Store the cleanup function for the escape listener
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    } catch (error) {
      console.error("Failed to initialize map:", error);
      // hide local loader on any thrown error
      setIsMapLoading(false);
    }

    // Cleanup function
    return () => {
      // Remove all markers
      markersRef.current.forEach(({ marker, element, popup }) => {
        popup.remove();
        marker.remove();
        element.remove();
      });
      markersRef.current = [];

      // Remove map instance
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // ensure local loader is hidden on unmount
      setIsMapLoading(false);
    };
  }, [createMarker, updateMarkerSizes]);

  return (
    <div className="explore-page relative">
      <div ref={mapContainer} className="map-container" />

      {/* Small, local inline loader centered over the map while it initializes */}
      {isMapLoading && (
        <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/70 p-3 shadow backdrop-blur-sm">
            <div className="animate-rotate-bounce">
              <img
                src="/icon_s.png"
                alt="Loading map"
                className="h-12 w-12 rounded-full bg-white p-2 shadow"
              />
            </div>
            <div className="text-sm text-gray-700">Loading map…</div>
          </div>
        </div>
      )}

      {/* Fixed Filter Bar at Bottom */}
      <div className="filter-bar fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
        <div className="flex items-center gap-3 rounded-full bg-white/30 px-6 py-3 shadow-2xl ring-1 ring-white/20 drop-shadow-2xl">
          {/* All Filter */}
          <button
            onClick={() => handleFilterChange("all")}
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl drop-shadow-2xl transition-all duration-200 ${
              activeFilter === "all"
                ? "bg-gray-700 text-white shadow-lg ring-2 ring-gray-900/20"
                : "bg-gray-100/60 text-gray-600 backdrop-blur-sm hover:bg-gray-200/80"
            }`}
            aria-label="Show all places"
          >
            <MapIcon className="h-6 w-6" />
            <span className="text-xs font-semibold">All</span>
          </button>

          {/* Attractions Filter */}
          <button
            onClick={() => handleFilterChange("attraction")}
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl drop-shadow-2xl transition-all duration-200 ${
              activeFilter === "attraction"
                ? "bg-purple-600 text-white shadow-lg ring-2 ring-purple-900/20"
                : "bg-purple-100/60 text-purple-600 backdrop-blur-sm hover:bg-purple-200/80"
            }`}
            aria-label="Show attractions"
          >
            <SparklesIcon className="h-6 w-6" />
            <span className="text-xs font-semibold">Places</span>
          </button>

          {/* Events Filter */}
          <button
            onClick={() => handleFilterChange("event")}
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl drop-shadow-2xl transition-all duration-200 ${
              activeFilter === "event"
                ? "bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-900/20"
                : "bg-cyan-100/60 text-cyan-600 backdrop-blur-sm hover:bg-cyan-200/80"
            }`}
            aria-label="Show events"
          >
            <CalendarDaysIcon className="h-6 w-6" />
            <span className="text-xs font-semibold">Events</span>
          </button>

          {/* Food Filter */}
          <button
            onClick={() => handleFilterChange("food")}
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl drop-shadow-2xl transition-all duration-200 ${
              activeFilter === "food"
                ? "bg-orange-600 text-white shadow-lg ring-2 ring-orange-900/20"
                : "bg-orange-100/60 text-orange-600 backdrop-blur-sm hover:bg-orange-200/80"
            }`}
            aria-label="Show food places"
          >
            <BuildingStorefrontIcon className="h-6 w-6" />
            <span className="text-xs font-semibold">Food</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
