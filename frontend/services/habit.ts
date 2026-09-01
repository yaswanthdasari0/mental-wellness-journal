import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface HabitCompletion { id: string; completedAt: string; habitId: string; }
export interface Habit {
  id: string; name: string; createdAt: string; userId: string;
  completions: HabitCompletion[]; completedToday: boolean; streak: number;
}
export interface CreateHabitData { name: string; }
export interface UpdateHabitData { name: string; }

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const createHabit = async (data: CreateHabitData): Promise<Habit> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/habits`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create habit.");
  return json.habit;
};

export const getHabits = async (): Promise<Habit[]> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/habits`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch habits.");
  return json.habits;
};

export const updateHabit = async (id: string, data: UpdateHabitData): Promise<Habit> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/habits/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update habit.");
  return json.habit;
};

export const deleteHabit = async (id: string): Promise<void> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/habits/${id}`, { method: "DELETE", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete habit.");
};

export const toggleHabit = async (id: string): Promise<{ completedToday: boolean; message: string }> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/habits/${id}/toggle`, { method: "POST", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to toggle habit.");
  return json;
};