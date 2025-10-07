import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../config/api";
import MockFleetSimulator from "../services/mockFleetService";

const EagleViewPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.warn("MAPBOX_TOKEN is not set. Map will not initialize.");
      return;
    }

    // Ensure access token is set
    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [103.8198, 1.3521], // Singapore
        zoom: 11,
      });

      // Add navigation controls
      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right",
      );
    }

    // Set up mock fleet simulator and markers
    const simulator = new MockFleetSimulator(14, 2000);
    const markers = new Map<string, mapboxgl.Marker>();

    const unsubscribe = simulator.subscribe((vehicles) => {
      // For each vehicle, ensure a marker exists and update its position
      vehicles.forEach((v) => {
        const existing = markers.get(v.id);
        const el = document.createElement("div");
        el.className = "rounded-full bg-indigo-600 shadow-md ring-2 ring-white";
        el.style.width = "14px";
        el.style.height = "14px";

        if (existing) {
          existing.setLngLat([v.lng, v.lat]);
        } else if (mapInstance.current) {
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([v.lng, v.lat])
            .addTo(mapInstance.current);
          markers.set(v.id, marker);
        }
      });
    });

    simulator.start();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      // stop simulator and cleanup markers
      try {
        unsubscribe();
        simulator.stop();
      } catch {
        // ignore cleanup errors
      }
    };
  }, []);

  return (
    // Make the map immersive: full viewport height minus header (role banner + navbar)
    <div className="relative h-full w-full">
      {!MAPBOX_TOKEN ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-bold">Eagle View</h1>
          <div className="rounded-md border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
            MAPBOX_TOKEN is not configured. The map cannot be shown. Please set
            VITE_MAPBOX_TOKEN.
          </div>
        </div>
      ) : (
        <div
          // role banner height (3.5rem) + navbar height (4rem) = 7.5rem
          style={{ height: "calc(100vh - 7.5rem)" }}
          className="w-full overflow-hidden bg-gray-50"
        >
          {/* Map container fills the area */}
          <div ref={mapContainer} className="h-full w-full" />

          {/* Overlay title in the top-left corner */}
          <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-md bg-white/70 px-3 py-2 text-sm font-semibold text-gray-800 backdrop-blur-sm">
            Eagle View — Fleet overview
          </div>
        </div>
      )}
    </div>
  );
};

export default EagleViewPage;
