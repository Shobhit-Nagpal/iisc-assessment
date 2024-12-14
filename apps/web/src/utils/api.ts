export const BASE_URL = "http://localhost:8000";

export type TApiRequest = {
  origin: {
    lon: number;
    lat: number;
  };
  destination: {
    lon: number;
    lat: number;
  };
};
