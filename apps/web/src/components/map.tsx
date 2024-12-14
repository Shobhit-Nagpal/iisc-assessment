import { useRef } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Coordinates, MAX_BOUNDS, normalizePath } from "@/utils/coordinates";

interface MapProps {
  path: number[][];
}

export function Map({ path }: MapProps) {
  const mapRef = useRef(null);

  const N_path = normalizePath(path);

  return (
    <MapContainer
      center={Coordinates.CENTER}
      bounds={MAX_BOUNDS}
      maxBounds={MAX_BOUNDS}
      scrollWheelZoom={false}
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
      {path.length > 0 && <Polyline positions={N_path} color="red" />}
    </MapContainer>
  );
}
