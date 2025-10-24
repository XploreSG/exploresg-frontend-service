import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
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
  HeartIcon,
  Bars3BottomLeftIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { createRoot } from "react-dom/client";
import CollectButton from "../components/CollectButton";
import { useCollection } from "../hooks/useCollection";

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
  placeId: string;
}

type FilterType = "all" | PlaceType | "collections";
type SortType = "name" | "rating";

const ExplorePage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  // Local map loading state (use a small inline loader instead of the global overlay)
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<{
    name: string;
    top: number;
  } | null>(null);
  const { collectedItems } = useCollection();

  // Get filtered and sorted places based on active filter
  const filteredPlaces = useMemo(() => {
    const filtered = allPlacesGeoJSON.features.filter((feature) => {
      const properties = feature.properties;
      if (!properties) return false;

      // Apply type filter
      let matchesFilter = false;
      if (activeFilter === "all") {
        matchesFilter = true;
      } else if (activeFilter === "collections") {
        matchesFilter = collectedItems.some(
          (item) => item.id === properties.id,
        );
      } else {
        matchesFilter = properties.type === activeFilter;
      }

      // Apply search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        properties.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        properties.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        properties.location
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        properties.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      const propsA = a.properties;
      const propsB = b.properties;

      if (!propsA || !propsB) return 0;

      if (sortBy === "name") {
        return (propsA.name || "").localeCompare(propsB.name || "");
      } else if (sortBy === "rating") {
        const ratingA = parseFloat(propsA.rating) || 0;
        const ratingB = parseFloat(propsB.rating) || 0;
        return ratingB - ratingA; // Descending order (highest first)
      }

      return 0;
    });
  }, [activeFilter, searchQuery, collectedItems, sortBy]);

  // Function to zoom to a specific place
  const zoomToPlace = useCallback(
    (coordinates: [number, number], placeId: string) => {
      if (!mapInstance.current) return;

      // Fly to the location
      mapInstance.current.flyTo({
        center: coordinates,
        zoom: 15,
        duration: 1500,
      });

      // Find and open the marker's popup
      const markerData = markersRef.current.find((m) => m.placeId === placeId);
      if (markerData) {
        // Close all other popups first
        markersRef.current.forEach((m) => {
          if (m !== markerData && m.popup.isOpen()) {
            m.popup.remove();
            m.element.classList.remove("marker-active");
          }
        });

        // Open this marker's popup
        markerData.popup
          .setLngLat(markerData.marker.getLngLat())
          .addTo(mapInstance.current);
        markerData.element.classList.add("marker-active");
      }
    },
    [],
  );

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
  const filterMarkers = useCallback(
    (filterType: FilterType) => {
      if (!mapInstance.current) return;

      const visibleMarkers: MarkerData[] = [];

      markersRef.current.forEach((markerData) => {
        let shouldShow = false;

        if (filterType === "all") {
          shouldShow = true;
        } else if (filterType === "collections") {
          // Show only collected items
          shouldShow = collectedItems.some(
            (item) => item.id === markerData.placeId,
          );
        } else {
          // Filter by type
          shouldShow = markerData.type === filterType;
        }

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
    },
    [collectedItems],
  );

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

      // Store marker data with type and placeId
      const markerData: MarkerData = {
        marker,
        element: el,
        popup,
        type: properties?.type as PlaceType,
        placeId: properties?.id || "",
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

      {/* Toggle Button - Outside sidebar, on the right side, on top */}
      <button
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className={`absolute top-6 z-40 rounded-l-md bg-indigo-600 p-2 text-white shadow-lg backdrop-blur transition-all duration-500 hover:bg-indigo-700 ${
          sidebarExpanded ? "right-80" : "right-20"
        }`}
        aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${
            sidebarExpanded ? "rotate-0" : "rotate-180"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dynamic Sidebar - Top Right */}
      <div
        className={`absolute top-0 right-0 z-30 transition-all duration-500 ease-out ${
          sidebarExpanded ? "w-80" : "w-20"
        }`}
      >
        {/* Hovered Place Name - Pops out on left side of sidebar */}
        {!sidebarExpanded && hoveredPlace && (
          <div
            className="animate-slide-in-left pointer-events-none absolute right-full mr-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-xl backdrop-blur transition-all duration-300 ease-out"
            style={{ top: `${hoveredPlace.top}px` }}
          >
            <p className="text-sm font-semibold whitespace-nowrap text-gray-900">
              {hoveredPlace.name}
            </p>
          </div>
        )}

        {/* Expanded Content */}
        <div
          className={`transition-all duration-500 ease-out ${
            sidebarExpanded
              ? "translate-x-0 scale-100 opacity-100"
              : "pointer-events-none translate-x-8 scale-95 opacity-0"
          }`}
        >
          <div className="mr-6 space-y-3">
            {/* Search Bar */}
            <div className="rounded-md bg-white/80 p-3 shadow backdrop-blur">
              <label htmlFor="search-places" className="sr-only">
                Search places
              </label>
              <input
                id="search-places"
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Sort Buttons */}
            <div className="rounded-md bg-white/80 p-2 shadow backdrop-blur">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSortBy("name")}
                  className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-semibold transition-all ${
                    sortBy === "name"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Bars3BottomLeftIcon className="h-3.5 w-3.5" />
                  <span>Name</span>
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-semibold transition-all ${
                    sortBy === "rating"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <StarIcon className="h-3.5 w-3.5" />
                  <span>Rating</span>
                </button>
              </div>
            </div>

            {/* Places List */}
            <div
              className="places-list overflow-y-auto rounded-md bg-white/90 shadow-lg backdrop-blur"
              style={{
                maxHeight: "calc(100vh - 16rem)",
              }}
            >
              <div className="space-y-2 p-2">
                {filteredPlaces.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {searchQuery ? "No places found" : "No places available"}
                  </div>
                ) : (
                  filteredPlaces.map((feature) => {
                    const props = feature.properties;
                    if (!props) return null;

                    return (
                      <button
                        key={props.id}
                        onClick={() =>
                          zoomToPlace(
                            feature.geometry.coordinates as [number, number],
                            props.id,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg border-2 border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-md"
                      >
                        {/* Place Thumbnail */}
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                          <img
                            src={props.image || "/placeholder.jpg"}
                            alt={props.name || "Place"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/64x64?text=No+Image";
                            }}
                          />
                        </div>

                        {/* Place Info */}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-semibold text-gray-900">
                            {props.name}
                          </div>
                          <div className="truncate text-xs text-gray-600">
                            {props.location}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium text-white ${
                                props.type === "attraction"
                                  ? "bg-purple-600"
                                  : props.type === "event"
                                    ? "bg-cyan-600"
                                    : props.type === "food"
                                      ? "bg-orange-600"
                                      : "bg-gray-600"
                              }`}
                            >
                              {props.type}
                            </span>
                            {props.rating && (
                              <span className="flex items-center gap-0.5 text-xs text-yellow-600">
                                <span>★</span>
                                <span className="font-semibold">
                                  {props.rating}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsed Thumbnails Strip - Visible when collapsed */}
        {!sidebarExpanded && (
          <div
            className="thumbnail-strip absolute top-0 right-0 overflow-y-auto rounded-l-lg bg-white/90 shadow-lg backdrop-blur transition-all duration-300"
            style={{
              maxHeight: "100vh",
              width: "80px",
            }}
          >
            <div className="flex flex-col items-center gap-2 p-2">
              {filteredPlaces.slice(0, 20).map((feature) => {
                const props = feature.properties;
                if (!props) return null;

                return (
                  <button
                    key={props.id}
                    onClick={() => {
                      zoomToPlace(
                        feature.geometry.coordinates as [number, number],
                        props.id,
                      );
                      setSidebarExpanded(true);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect =
                        e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
                      const relativeTop = parentRect
                        ? rect.top - parentRect.top
                        : 0;
                      setHoveredPlace({ name: props.name, top: relativeTop });
                    }}
                    onMouseLeave={() => setHoveredPlace(null)}
                    className="group relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 bg-white transition-all duration-200 hover:scale-110 hover:border-indigo-400 hover:shadow-lg"
                    title={props.name}
                  >
                    <img
                      src={props.image || "/placeholder.jpg"}
                      alt={props.name || "Place"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/56x56?text=No+Image";
                      }}
                    />
                    {/* Type indicator dot */}
                    <div
                      className={`absolute right-1 bottom-1 h-2 w-2 rounded-full border border-white shadow-sm transition-transform duration-200 group-hover:scale-125 ${
                        props.type === "attraction"
                          ? "bg-purple-600"
                          : props.type === "event"
                            ? "bg-cyan-600"
                            : props.type === "food"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Slide in animation for name pop-out */
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.2s ease-out;
        }

        /* Minimalist scrollbar for places list */
        .places-list::-webkit-scrollbar {
          width: 6px;
        }
        .places-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .places-list::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 3px;
        }
        .places-list::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.6);
        }
        /* Firefox */
        .places-list {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
        }

        /* Minimalist scrollbar for thumbnail strip */
        .thumbnail-strip::-webkit-scrollbar {
          width: 4px;
        }
        .thumbnail-strip::-webkit-scrollbar-track {
          background: transparent;
        }
        .thumbnail-strip::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        .thumbnail-strip::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        /* Firefox */
        .thumbnail-strip {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
      `}</style>

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

          {/* My Collections Filter */}
          <button
            onClick={() => handleFilterChange("collections")}
            className={`relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl drop-shadow-2xl transition-all duration-200 ${
              activeFilter === "collections"
                ? "bg-rose-600 text-white shadow-lg ring-2 ring-rose-900/20"
                : "bg-rose-100/60 text-rose-600 backdrop-blur-sm hover:bg-rose-200/80"
            }`}
            aria-label="Show my collections"
          >
            <HeartIcon className="h-6 w-6" />
            <span className="text-xs font-semibold">Mine</span>
            {collectedItems.length > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                {collectedItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
