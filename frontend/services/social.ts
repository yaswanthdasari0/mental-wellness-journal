import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SearchUser {
  id: string; name: string; username: string | null;
  bio: string | null; isPublic: boolean;
}

export interface PublicProfile {
  id: string; name: string; username: string | null;
  bio: string | null; isPublic: boolean; private?: boolean;
  memberSince?: string; isFollowing?: boolean;
  isOwnProfile?: boolean;
  followerCount?: number; followingCount?: number;
  stats?: { journals: number; habits: number; meditations: number };
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const searchUsers = async (q: string): Promise<SearchUser[]> => {
  if (q.trim().length < 2) return [];
  const res  = await fetchWithAuth(`${API_BASE}/api/social/search?q=${encodeURIComponent(q)}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};

export const getPublicProfile = async (username: string): Promise<PublicProfile> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/social/u/${username}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "User not found.");
  return json.profile;
};

export const followUser = async (userId: string): Promise<{ following: boolean; followerCount: number }> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/social/follow/${userId}`, { method: "POST", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const unfollowUser = async (userId: string): Promise<{ following: boolean; followerCount: number }> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/social/follow/${userId}`, { method: "DELETE", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const getFollowers = async (userId: string): Promise<SearchUser[]> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/social/followers/${userId}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};

export const getFollowing = async (userId: string): Promise<SearchUser[]> => {
  const res  = await fetchWithAuth(`${API_BASE}/api/social/following/${userId}`, { method: "GET", headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};