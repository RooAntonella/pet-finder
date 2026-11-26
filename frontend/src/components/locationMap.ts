import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export function renderLocationMap() {
  return `
        <div id="location-map" class="location-map"></div>
    `;
}

export function setupLocationMap(
  onLocationChange: (lat: number, lng: number) => void,
  initialLocation?: { lat: number; lng: number },
) {
  const map = L.map("location-map").setView(
    initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : [-34.6037, -58.3816],
    13,
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const icon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  let marker: L.Marker | null = null;

  function setLocation(lat: number, lng: number) {
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng], {
        icon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const position = marker!.getLatLng();

        onLocationChange(position.lat, position.lng);
      });
    }

    onLocationChange(lat, lng);
  }

  map.on("click", (event: L.LeafletMouseEvent) => {
    setLocation(event.latlng.lat, event.latlng.lng);
  });

  if (initialLocation) {
    setLocation(initialLocation.lat, initialLocation.lng);
  }

  return {
    setLocation(lat: number, lng: number) {
      setLocation(lat, lng);
      map.setView([lat, lng], 15);
    },
    destroy() {
      map.remove();
    },
  };
}
