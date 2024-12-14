import L from "leaflet";

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
  const normalizedPath = path.map((p) => L.latLng(p[0], p[1]))
  return normalizedPath
}
