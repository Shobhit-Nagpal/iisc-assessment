import L from "leaflet";
import { BASE_URL } from "./api";

const LAT_NORTH = 13.2827;
const LAT_SOUTH = 12.6933;

const LONG_EAST = 77.0849;
const LONG_WEST = 78.1602;

export const Coordinates = {
  NORTH: LAT_NORTH,
  SOUTH: LAT_SOUTH,
  EAST: LONG_EAST,
  WEST: LONG_WEST,
  NORTH_EAST: L.latLng(LAT_NORTH, LONG_EAST),
  SOUTH_WEST: L.latLng(LAT_SOUTH, LONG_WEST),
  CENTER: L.latLng(12.97, 77.56),
};

export const MAX_BOUNDS = L.latLngBounds(
  Coordinates.SOUTH_WEST,
  Coordinates.NORTH_EAST,
);

export function normalizePath(path: number[][]) {
  const normalizedPath = path.map((p) => L.latLng(p[0], p[1]));
  return normalizedPath;
}

export async function getPath(
  origin: { lon: number; lat: number },
  destination: { lon: number; lat: number },
) {

  if (!isInBounds(origin)) {
    throw new Error("Origin location is outside Bangalore city limits");
  }
  if (!isInBounds(destination)) {
    throw new Error("Destination location is outside Bangalore city limits");
  }

  const res = await fetch(`${BASE_URL}/paths`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      origin: {
        lon: origin.lon,
        lat: origin.lat,
      },
      destination: {
        lon: destination.lon,
        lat: destination.lat,
      },
    }),
  });
  return await res.json();
}

function isInBounds(point: { lat: number; lon: number }): boolean {
  return (
    point.lat >= LAT_SOUTH &&
    point.lat <= LAT_NORTH &&
    point.lon >= LONG_EAST &&
    point.lon <= LONG_WEST
  );
}
