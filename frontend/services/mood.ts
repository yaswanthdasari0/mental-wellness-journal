import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────

export interface Mood {
  id: string;
  mood: string;
  note?: string;
  date: string;
  createdAt: string;
  userId: string;
}

export interface CreateMoodData {
  mood: string;
  note?: string;
}

export interface UpdateMoodData {
  mood?: string;
  note?: string;
}

// ── Shared headers ─────────────────────────────────────

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── API calls ──────────────────────────────────────────

// POST /api/moods
export const createMood = async (data: CreateMoodData): Promise<Mood> => {
  const res = await fetch(`${API_BASE}/api/moods`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to log mood.");
  return json.mood;
};

// GET /api/moods
export const getMoods = async (): Promise<Mood[]> => {
  const res = await fetch(`${API_BASE}/api/moods`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch moods.");
  return json.moods;
};

// GET /api/moods/:id
export const getMoodById = async (id: string): Promise<Mood> => {
  const res = await fetch(`${API_BASE}/api/moods/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch mood.");
  return json.mood;
};

// PUT /api/moods/:id
export const updateMood = async (
  id: string,
  data: UpdateMoodData
): Promise<Mood> => {
  const res = await fetch(`${API_BASE}/api/moods/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update mood.");
  return json.mood;
};

// DELETE /api/moods/:id
export const deleteMood = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/moods/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete mood.");
};