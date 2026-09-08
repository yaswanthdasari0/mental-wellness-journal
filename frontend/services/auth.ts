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
  user: { id: string; name: string; email: string; };
}

// ── Token / user helpers ───────────────────────────────

export const saveToken = (token: string): void => {
  localStorage.setItem("mindspace_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("mindspace_token");
};

export const saveUser = (user: AuthResponse["user"]): void => {
  localStorage.setItem("mindspace_user", JSON.stringify(user));
};

export const getUser = (): AuthResponse["user"] | null => {
  try {
    const raw = localStorage.getItem("mindspace_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// ── Clear ALL user-specific data on logout/login ───────
// This prevents old account's avatar/prefs showing on new account

export const clearAuth = (): void => {
  // Auth data
  localStorage.removeItem("mindspace_token");
  localStorage.removeItem("mindspace_user");
  // Avatar — account-specific, must clear so new account starts fresh
  localStorage.removeItem("mindspace_avatar");
  // Preferences — reset to defaults for new account
  localStorage.removeItem("mindspace_prefs");
  // Clear cookie used by Next.js middleware
  document.cookie = "mindspace_token=; path=/; max-age=0";
};

// ── API calls ──────────────────────────────────────────

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const res  = await fetch(`${API_BASE}/api/auth/signup`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Signup failed.");
  return json;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res  = await fetch(`${API_BASE}/api/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed.");
  return json;
};