import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Journal {
  id: string; title: string; content: string;
  createdAt: string; updatedAt: string; userId: string;
}
export interface CreateJournalData { title: string; content: string; }
export interface UpdateJournalData { title?: string; content?: string; }

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const createJournal = async (data: CreateJournalData): Promise<Journal> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/journals`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create journal entry.");
  return json.journal;
};

export const getJournals = async (): Promise<Journal[]> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/journals`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch journals.");
  return json.journals;
};

export const getJournalById = async (id: string): Promise<Journal> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/journals/${id}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch journal.");
  return json.journal;
};

export const updateJournal = async (id: string, data: UpdateJournalData): Promise<Journal> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/journals/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update journal.");
  return json.journal;
};

export const deleteJournal = async (id: string): Promise<void> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/journals/${id}`, { method: "DELETE", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete journal.");
};