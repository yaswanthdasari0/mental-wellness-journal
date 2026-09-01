import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Gratitude {
  id: string; items: string[];
  date: string; createdAt: string; userId: string;
}
export interface CreateGratitudeData { items: string[]; }
export interface UpdateGratitudeData { items: string[]; }

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const createGratitude = async (data: CreateGratitudeData): Promise<Gratitude> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/gratitude`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to save gratitude entry.");
  return json.gratitude;
};

export const getGratitudes = async (): Promise<Gratitude[]> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/gratitude`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch gratitude entries.");
  return json.gratitudes;
};

export const getGratitudeById = async (id: string): Promise<Gratitude> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/gratitude/${id}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch gratitude entry.");
  return json.gratitude;
};

export const updateGratitude = async (id: string, data: UpdateGratitudeData): Promise<Gratitude> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/gratitude/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update gratitude entry.");
  return json.gratitude;
};

export const deleteGratitude = async (id: string): Promise<void> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/gratitude/${id}`, { method: "DELETE", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete gratitude entry.");
};