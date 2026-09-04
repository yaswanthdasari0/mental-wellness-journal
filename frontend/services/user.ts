import { getToken, saveUser } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// ── Shared headers ─────────────────────────────────────

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── API calls ──────────────────────────────────────────

// GET /api/user/profile
export const getProfile = async (): Promise<UserProfile> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/user/profile`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch profile.");
  return json.user;
};

// PUT /api/user/profile
export const updateProfile = async (data: {
  name?: string;
  email?: string;
}): Promise<UserProfile> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/user/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update profile.");

  // Keep localStorage in sync so Header avatar letter updates
  saveUser({ id: json.user.id, name: json.user.name, email: json.user.email });
  return json.user;
};

// PUT /api/user/password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/user/password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to change password.");
};