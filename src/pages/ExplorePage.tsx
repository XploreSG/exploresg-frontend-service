import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Don't forget to import the CSS
import "./Explore.css";
import { places } from "../data/places.geojson";

// ❗️ PASTE YOUR MAPBOX ACCESS TOKEN HERE
mapboxgl.accessToken = "pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA";

const ExplorePage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return; // Wait for the container to be created

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11", // Map style
      center: [103.8198, 1.3521], // Centered on Singapore
      zoom: 11, // Initial zoom level
    });

    // Add markers to the map
    places.features.forEach((marker) => {
      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`,
      );

      // Create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";

      // Make a marker for each feature and add it to the map.
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // The empty dependency array ensures this effect runs only once

  return <div ref={mapContainer} className="map-container" />;
};

export default ExplorePage;
