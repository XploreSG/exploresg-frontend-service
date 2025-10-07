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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-2xl font-bold">Eagle View</h1>
      <p className="mb-4 text-sm text-gray-600">
        Fleet admin only map view for overseeing vehicles.
      </p>

      {!MAPBOX_TOKEN ? (
        <div className="rounded-md border border-dashed border-red-300 bg-red-50 p-4 text-sm text-red-700">
          MAPBOX_TOKEN is not configured. The map cannot be shown. Please set
          VITE_MAPBOX_TOKEN.
        </div>
      ) : (
        <div className="h-[70vh] w-full overflow-hidden rounded-md border">
          <div ref={mapContainer} className="h-full w-full" />
        </div>
      )}
    </div>
  );
};

export default EagleViewPage;
