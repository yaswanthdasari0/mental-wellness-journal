// Base URL of your backend — change this when you deploy
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ── Token helpers ──────────────────────────────────────
// These run only on the client side (localStorage is browser-only)

export const saveToken = (token: string): void => {
  localStorage.setItem("mindspace_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("mindspace_token");
};

export const removeToken = (): void => {
  localStorage.removeItem("mindspace_token");
};

export const saveUser = (user: AuthResponse["user"]): void => {
  localStorage.setItem("mindspace_user", JSON.stringify(user));
};

export const getUser = (): AuthResponse["user"] | null => {
  const raw = localStorage.getItem("mindspace_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem("mindspace_user");
};

// Call this on logout — clears everything
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

// ── API calls ──────────────────────────────────────────

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    // Throw the backend error message so the form can display it
    throw new Error(json.message || "Signup failed. Please try again.");
  }

  return json;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Login failed. Please try again.");
  }

  return json;
};