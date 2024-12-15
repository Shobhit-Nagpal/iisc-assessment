import { Dispatch, SetStateAction, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
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
import { useToast } from "@/hooks/use-toast";

interface MapProps {
  mode: "input" | "click";
  path: number[][];
  origin: [number, number] | null;
  destination: [number, number] | null;
  altPaths: number[][][];
  onLoading: Dispatch<SetStateAction<boolean>>;
  onCoordinatesChange: Dispatch<SetStateAction<number[][]>>;
  onAltCoordinatesChange: Dispatch<SetStateAction<number[][][]>>;
  onOriginChange: Dispatch<SetStateAction<[number, number] | null>>;
  onDestinationChange: Dispatch<SetStateAction<[number, number] | null>>;
}

export function Map({
  mode,
  path,
  altPaths,
  origin,
  destination,
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
  onOriginChange,
  onDestinationChange,
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
          onDestinationChange={onDestinationChange}
          onOriginChange={onOriginChange}
          origin={origin}
          destination={destination}
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
  onOriginChange: Dispatch<SetStateAction<[number, number] | null>>;
  onDestinationChange: Dispatch<SetStateAction<[number, number] | null>>;
  origin: [number, number] | null;
  destination: [number, number] | null;
}

function LocationMarker({
  origin,
  destination,
  onLoading,
  onCoordinatesChange,
  onAltCoordinatesChange,
  onOriginChange,
  onDestinationChange,
}: LocationMarkerProps) {
  const { toast } = useToast();

  useMapEvents({
    async click(e) {
      try {
        onLoading(true);
        const { lat, lng } = e.latlng;
        if (!origin) {
          onOriginChange([lat, lng]);
        } else if (!destination) {
          onDestinationChange([lat, lng]);
          const data = await getPath(
            { lat: origin[0], lon: origin[1] },
            { lat: lat, lon: lng },
          );
          const allPaths = data.paths;

          if (allPaths.length === 0) {
            toast({
              title: "No paths found",
              variant: "destructive",
            });
            return;
          }

          const shortestPath = allPaths.shift();
          onCoordinatesChange(shortestPath);
          onAltCoordinatesChange(allPaths);
        }
      } catch (err) {
        const error = err as Error;
        toast({
          title: error.message,
          variant: "destructive",
        });
      } finally {
        onLoading(false);
      }
    },
  });

  return (
    <>
      {origin && (
        <Marker position={origin}>
          <Popup>Origin</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </>
  );
}
