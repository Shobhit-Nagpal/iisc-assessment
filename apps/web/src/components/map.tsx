import { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates, MAX_BOUNDS } from "@/utils/coordinates";

export function Map() {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={Coordinates.CENTER}
      bounds={MAX_BOUNDS}
      maxBounds={MAX_BOUNDS}
      zoom={11}
      minZoom={10}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Will add required components here */}
    </MapContainer>
  );
}
