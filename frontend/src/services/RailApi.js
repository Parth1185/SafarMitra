const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/train";

async function fetchJson(endpoint) {
  const url = `${BASE}${endpoint}`;
  console.log("Fetching trains from:", url);
  const res = await fetch(url);
  console.log("Response status:", res.status);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export const getTrain = (trainNo) => fetchJson(`/getTrain?trainNo=${trainNo}`);
export const betweenStations = (from, to) =>
  fetchJson(`/betweenStations?from=${from}&to=${to}`);
export const pnrStatus = (pnr) => fetchJson(`/pnrstatus?pnr=${pnr}`);
export const getRoute = (trainNo) => fetchJson(`/getRoute?trainNo=${trainNo}`);
export const stationLive = (code) => fetchJson(`/stationLive?code=${code}`);
