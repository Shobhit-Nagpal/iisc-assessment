const BASE_URL = import.meta.env.VITE_BASE_URL

if (!BASE_URL) {
  throw new Error("Base url not found");
}

export { BASE_URL };
