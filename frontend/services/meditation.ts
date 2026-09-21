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
  // Tell any mounted SessionHistory to refresh its list and weekly total
  if (typeof window !== "undefined") window.dispatchEvent(new Event("meditation-saved"));
  return json.session;
};

// Fallback used only if the backend doesn't send weeklyMinutes (rolling 7 days)
const weeklyTotal = (sessions: MeditationSession[]): number => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return sessions
    .filter((s) => new Date(s.createdAt).getTime() >= cutoff)
    .reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
};

// GET /api/meditation — always returns { sessions: [], weeklyMinutes: number }
export const getSessions = async (): Promise<SessionsResponse> => {
  const res = await fetchWithAuth(`${API_BASE}/api/meditation`, {
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load sessions.");

  // Accept either { sessions, weeklyMinutes } or a bare array
  const sessions: MeditationSession[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.sessions)
      ? json.sessions
      : [];

  const weeklyMinutes =
    typeof json?.weeklyMinutes === "number" ? json.weeklyMinutes : weeklyTotal(sessions);

  return { sessions, weeklyMinutes };
};