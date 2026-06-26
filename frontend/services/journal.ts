import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────

export interface Journal {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateJournalData {
  title: string;
  content: string;
}

export interface UpdateJournalData {
  title?: string;
  content?: string;
}

// ── Shared headers ─────────────────────────────────────

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── API calls ──────────────────────────────────────────

// POST /api/journals
export const createJournal = async (data: CreateJournalData): Promise<Journal> => {
  const res = await fetch(`${API_BASE}/api/journals`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create journal entry.");
  return json.journal;
};

// GET /api/journals
export const getJournals = async (): Promise<Journal[]> => {
  const res = await fetch(`${API_BASE}/api/journals`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch journal entries.");
  return json.journals;
};

// GET /api/journals/:id
export const getJournalById = async (id: string): Promise<Journal> => {
  const res = await fetch(`${API_BASE}/api/journals/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch journal entry.");
  return json.journal;
};

// PUT /api/journals/:id
export const updateJournal = async (
  id: string,
  data: UpdateJournalData
): Promise<Journal> => {
  const res = await fetch(`${API_BASE}/api/journals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update journal entry.");
  return json.journal;
};

// DELETE /api/journals/:id
export const deleteJournal = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/journals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete journal entry.");
};