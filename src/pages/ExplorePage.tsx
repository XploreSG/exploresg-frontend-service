import React, { useRef, useEffect, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Explore.css";
import { allPlacesGeoJSON, type PlaceType } from "../data/places";
import { MAPBOX_TOKEN } from "../config/api";

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
    <div class="group relative w-full overflow-hidden rounded-xl shadow-lg" style="width: 270px; height: 480px;">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-b ${gradientColors} from-30% via-gray-300 via-60% to-gray-800 to-95%">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-slate-600/10 to-indigo-600/0"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex h-full flex-col p-4">
        <!-- Image Section -->
        <div class="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg">
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
            <div class="absolute top-0 left-0 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 px-2 py-1 shadow-lg drop-shadow-2xl">
              <div class="text-center text-xs font-bold text-white">${properties.status}</div>
            </div>
          `
              : ""
          }
          
          ${
            properties.price
              ? `
            <div class="absolute top-0 right-0 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-2 py-1 shadow-lg drop-shadow-2xl">
              <div class="text-center text-xs font-bold text-white">${properties.price}</div>
            </div>
          `
              : ""
          }
        </div>

        <!-- Content Section -->
        <div class="flex flex-1 flex-col">
          <!-- Header with Rating -->
          <div class="mb-2 flex items-start justify-between gap-2">
            <h3 class="line-clamp-2 flex-1 text-base font-semibold leading-tight text-white">
              ${properties.name || "Unknown"}
            </h3>
            <div class="flex flex-shrink-0 items-center gap-1 rounded-md bg-black/20 px-2 py-1 text-yellow-400 backdrop-blur-sm">
              <span class="text-sm">★</span>
              <span class="text-xs font-semibold">${properties.rating || "N/A"}</span>
            </div>
          </div>

          <!-- Description -->
          <p class="mb-3 line-clamp-3 text-sm text-gray-200">
            ${properties.description || ""}
          </p>

          <!-- Location -->
          <div class="mb-3 flex items-center gap-1 text-xs text-gray-300">
            <span>📍</span>
            <span class="font-medium">${properties.location || ""}</span>
          </div>

          <!-- Footer - Category & Reviews -->
          <div class="mt-auto flex items-center justify-between">
            <span class="text-xs text-gray-300">
              (${properties.reviews || 0} reviews)
            </span>
            <span class="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
              ${properties.category || ""}
            </span>
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
}

const ExplorePage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  // map load state is handled by global loader
  const activeMarkerRef = useRef<MarkerData | null>(null);
  const hoveredMarkerRef = useRef<MarkerData | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  // Local map loading state (use a small inline loader instead of the global overlay)
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Function to handle marker hover (show popup)
  const handleMarkerHover = useCallback((markerData: MarkerData) => {
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Don't show hover popup if this marker is already active (clicked)
    if (activeMarkerRef.current === markerData) {
      return;
    }

    // Close any existing hover popup
    if (
      hoveredMarkerRef.current &&
      hoveredMarkerRef.current !== activeMarkerRef.current
    ) {
      if (hoveredMarkerRef.current.popup.isOpen()) {
        hoveredMarkerRef.current.popup.remove();
      }
      hoveredMarkerRef.current.element.classList.remove("marker-hover");
    }

    // Set new hovered marker and show popup
    hoveredMarkerRef.current = markerData;
    markerData.element.classList.add("marker-hover");

    if (mapInstance.current) {
      markerData.popup
        .setLngLat(markerData.marker.getLngLat())
        .addTo(mapInstance.current);
    }
  }, []);

  // Function to handle marker hover leave (hide popup after delay)
  const handleMarkerHoverLeave = useCallback((markerData: MarkerData) => {
    // Don't hide if this marker is active (clicked)
    if (activeMarkerRef.current === markerData) {
      return;
    }

    // Set timeout to hide popup after a short delay
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (hoveredMarkerRef.current === markerData) {
        markerData.element.classList.remove("marker-hover");
        if (markerData.popup.isOpen()) {
          markerData.popup.remove();
        }
        hoveredMarkerRef.current = null;
      }
      hoverTimeoutRef.current = null;
    }, 300); // 300ms delay before hiding
  }, []);

  // Function to handle marker click (pin popup)
  const handleMarkerClick = useCallback((markerData: MarkerData) => {
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // If there's an active marker, deactivate it
    if (activeMarkerRef.current) {
      activeMarkerRef.current.element.classList.remove("marker-active");
      if (activeMarkerRef.current.popup.isOpen()) {
        activeMarkerRef.current.popup.remove();
      }
    }

    // If there's a hovered marker that's not the clicked one, hide it
    if (hoveredMarkerRef.current && hoveredMarkerRef.current !== markerData) {
      hoveredMarkerRef.current.element.classList.remove("marker-hover");
      if (hoveredMarkerRef.current.popup.isOpen()) {
        hoveredMarkerRef.current.popup.remove();
      }
      hoveredMarkerRef.current = null;
    }

    // If clicking the same active marker, deactivate it
    if (activeMarkerRef.current === markerData) {
      activeMarkerRef.current = null;
      return;
    }

    // Activate the new marker
    markerData.element.classList.add("marker-active");
    activeMarkerRef.current = markerData;

    // Show the popup (pinned)
    if (mapInstance.current) {
      markerData.popup
        .setLngLat(markerData.marker.getLngLat())
        .addTo(mapInstance.current);
    }
  }, []);

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

  // Memoized marker creation function
  const createMarker = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point>, index: number) => {
      const { geometry, properties } = feature;

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "marker";
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `View ${properties?.name || "place"}`);
      el.setAttribute("tabindex", "0");
      el.setAttribute("data-marker-id", index.toString());

      // Create popup with basic information card
      const popup = new mapboxgl.Popup(POPUP_CONFIG).setHTML(
        createPopupHTML(properties),
      );

      // Create marker instance with proper anchor
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      }).setLngLat(geometry.coordinates as [number, number]);

      // Store popup separately in markerData
      const markerData = { marker, element: el, popup };

      // Add click handler
      el.addEventListener("click", () => {
        handleMarkerClick(markerData);
      });

      // Add keyboard support
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleMarkerClick(markerData);
        }
      });

      // Add hover handlers for popup display
      el.addEventListener("mouseenter", () => {
        handleMarkerHover(markerData);
      });
      el.addEventListener("mouseleave", () => {
        handleMarkerHoverLeave(markerData);
      });

      return markerData;
    },
    [handleMarkerClick, handleMarkerHover, handleMarkerHoverLeave],
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

      mapInstance.current = map;
    } catch (error) {
      console.error("Failed to initialize map:", error);
      // hide local loader on any thrown error
      setIsMapLoading(false);
    }

    // Cleanup function
    return () => {
      // Clear hover timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      // Reset marker references
      activeMarkerRef.current = null;
      hoveredMarkerRef.current = null;

      // Remove all markers
      markersRef.current.forEach(({ marker, element }) => {
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
    </div>
  );
};

export default ExplorePage;
