import { Coordinates } from "./coordinates";

export async function getGeoCodeData(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}` +
      `&viewbox=${Coordinates.WEST},${Coordinates.SOUTH},${Coordinates.EAST},${Coordinates.NORTH}` +
      `&bounded=1` +
      `&format=json`,
  );
  const data = await res.json();
  return data;
}
