import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────

export interface MeditationSession {
  id: string;
  duration: number; // minutes
  createdAt: string;
  userId: string;
}

export interface SessionsResponse {
  sessions: MeditationSession[];
  weeklyMinutes: number;
}

// ── Shared headers ─────────────────────────────────────

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── API calls ──────────────────────────────────────────

// POST /api/meditation — called when timer completes
export const saveSession = async (duration: number): Promise<MeditationSession> => {
  const res = await fetchWithAuth(`${API_BASE}/api/meditation`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ duration }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to save session.");
  return json.session;
};

// GET /api/meditation
export const getSessions = async (): Promise<SessionsResponse> => {
  const res = await fetchWithAuth(`${API_BASE}/api/meditation`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch sessions.");
  return json;
};