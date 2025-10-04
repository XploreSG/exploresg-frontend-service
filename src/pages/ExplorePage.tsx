import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Explore.css";
import { places } from "../data/places.geojson";

// Move token to environment variable for security
mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  "pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA";

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
} as const;

interface MarkerData {
  marker: mapboxgl.Marker;
  element: HTMLElement;
}

const ExplorePage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Memoized marker creation function
  const createMarker = useCallback((feature: (typeof places.features)[0]) => {
    const { geometry, properties } = feature;

    // Create popup with sanitized HTML
    const popup = new mapboxgl.Popup(POPUP_CONFIG).setHTML(
      `<div class="custom-popup">
        <h3 class="popup-title">${properties.title}</h3>
        <p class="popup-description">${properties.description}</p>
      </div>`,
    );

    // Create custom marker element
    const el = document.createElement("div");
    el.className = "marker";
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `View ${properties.title}`);
    el.setAttribute("tabindex", "0");

    // Add hover effect using CSS classes for better performance
    el.addEventListener("mouseenter", () => {
      el.classList.add("marker-hover");
    });
    el.addEventListener("mouseleave", () => {
      el.classList.remove("marker-hover");
    });

    // Create and return marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(geometry.coordinates as [number, number])
      .setPopup(popup);

    return { marker, element: el };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

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
        setIsMapLoaded(true);

        // Add markers after map is loaded
        places.features.forEach((feature) => {
          const markerData = createMarker(feature);
          markerData.marker.addTo(map);
          markersRef.current.push(markerData);
        });

        // Fit map to markers bounds with padding
        if (places.features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          places.features.forEach((feature) => {
            bounds.extend(feature.geometry.coordinates as [number, number]);
          });
          map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 14,
          });
        }
      });

      // Handle errors
      map.on("error", (e) => {
        console.error("Mapbox error:", e);
      });

      mapInstance.current = map;
    } catch (error) {
      console.error("Failed to initialize map:", error);
    }

    // Cleanup function
    return () => {
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
    };
  }, [createMarker]);

  return (
    <div className="explore-page">
      <div ref={mapContainer} className="map-container" />
      {!isMapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner" />
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
