import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface DashboardSummary {
  todayMood:         { mood: string; note?: string } | null;
  journalCount:      number;
  weekJournalCount:  number;
  streak:            number;
  habitsCompleted:   number;
  habitsTotal:       number;
  meditationMinutes: number;
  recentActivity:    {
    type:  "mood" | "journal" | "gratitude";
    label: string;
    time:  string;
  }[];
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/dashboard/summary`, {
    method:  "GET",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load dashboard.");
  return json;
};