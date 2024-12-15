import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Coordinates,
  getPath,
  MAX_BOUNDS,
  normalizePath,
} from "@/utils/coordinates";

interface MapProps {
  mode: "input" | "click";
  path: number[][];
  altPaths: number[][][];
  onLoading: Dispatch<SetStateAction<boolean>>;
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
  onAltCoordinatesChange: Dispatch<SetStateAction<number[][][]>>;
}

export function Map({
  mode,
  path,
  altPaths,
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
}: MapProps) {
  const mapRef = useRef(null);
  const N_path = normalizePath(path);

  return (
    <MapContainer
      center={Coordinates.CENTER}
      bounds={MAX_BOUNDS}
      maxBounds={MAX_BOUNDS}
      scrollWheelZoom={true}
      zoom={11}
      minZoom={10}
      ref={mapRef}
      doubleClickZoom={true}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mode === "click" && path.length === 0 && (
        <LocationMarker
          onLoading={onLoading}
          onCoordinatesChange={onCoordinatesChange}
          onAltCoordinatesChange={onAltCoordinatesChange}
        />
      )}
      {altPaths.length > 0 &&
        altPaths.map((altPath, idx) => {
          const N_altPath = normalizePath(altPath);
          return <Polyline key={idx} positions={N_altPath} color="blue" />;
        })}
      {path.length > 0 && (
        <>
          <Marker position={N_path[0]} />
          <Marker position={N_path[N_path.length - 1]} />
          <Polyline positions={N_path} color="red" />
        </>
      )}
    </MapContainer>
  );
}

interface LocationMarkerProps {
  onLoading: Dispatch<SetStateAction<boolean>>;
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
  onAltCoordinatesChange: Dispatch<SetStateAction<number[][][]>>;
}

function LocationMarker({
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
}: LocationMarkerProps) {
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    async click(e) {
      try {
        onLoading(true);
        const { lat, lng } = e.latlng;
        if (!origin) {
          setOrigin([lat, lng]);
        } else if (!destination) {
          setDestination([lat, lng]);
          const data = await getPath(
            { lat: origin[0], lon: origin[1] },
            { lat: lat, lon: lng },
          );
          const allPaths = data.paths;

          if (allPaths.length === 0) {
            //Show toast here
            console.log("No paths found");
            return;
          }

          const shortestPath = allPaths.shift();
          onCoordinatesChange(shortestPath);
          onAltCoordinatesChange(allPaths);
        }
      } catch (err) {
        //Show toast
        console.error(err);
      } finally {
        onLoading(false);
      }
    },
  });

  return (
    <>
      {origin && (
        <Marker position={origin}>
          {/* You can add a popup here if needed */}
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          {/* You can add a popup here if needed */}
        </Marker>
      )}
    </>
  );
}
