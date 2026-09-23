import { getToken } from "./auth";
import { fetchWithAuth } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SocialUser {
  id: string; name: string; username: string | null;
  bio: string | null; isPublic: boolean;
}

export interface PublicProfile {
  id: string; name: string; username: string | null;
  bio: string | null; isPublic: boolean; private?: boolean;
  memberSince?: string; isFollowing?: boolean; isOwnProfile?: boolean;
  hasPendingRequest?: boolean;
  followerCount?: number; followingCount?: number;
  stats?: { journals: number; habits: number; meditations: number };
}

export interface FollowRequest {
  id: string; createdAt: string; status: string;
  sender: SocialUser;
}

const h = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const searchUsers = async (q: string): Promise<SocialUser[]> => {
  if (q.trim().length < 2) return [];
  const res = await fetchWithAuth(`${API_BASE}/api/social/search?q=${encodeURIComponent(q)}`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};

export const getPublicProfile = async (username: string): Promise<PublicProfile> => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/u/${username}`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "User not found.");
  return json.profile;
};

export const followUser = async (userId: string) => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/follow/${userId}`, { method: "POST", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json as { following: boolean; requested: boolean; followerCount: number };
};

export const unfollowUser = async (userId: string) => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/follow/${userId}`, { method: "DELETE", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json as { following: boolean; requested: boolean; followerCount: number };
};

export const getFollowers = async (userId: string): Promise<SocialUser[]> => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/followers/${userId}`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};

export const getFollowing = async (userId: string): Promise<SocialUser[]> => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/following/${userId}`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};

export const getPendingRequests = async (): Promise<FollowRequest[]> => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/requests`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.requests;
};

export const respondToRequest = async (requestId: string, action: "accept" | "reject") => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/requests/${requestId}`, {
    method: "POST", headers: h(), body: JSON.stringify({ action }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
};

export const getSuggestions = async (): Promise<SocialUser[]> => {
  const res = await fetchWithAuth(`${API_BASE}/api/social/suggestions`, { method: "GET", headers: h() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.users;
};