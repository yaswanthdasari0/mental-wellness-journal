const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface SignupData  { name: string; email: string; password: string; }
export interface LoginData   { email: string; password: string; }
export interface AuthResponse {
  message: string; token: string;
  user: { id: string; name: string; email: string };
}

export const saveToken = (token: string): void => {
  localStorage.setItem("mindspace_token", token);
};
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mindspace_token");
};
export const saveUser = (user: AuthResponse["user"]): void => {
  localStorage.setItem("mindspace_user", JSON.stringify(user));
};
export const getUser = (): AuthResponse["user"] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("mindspace_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const logout = (): void => {
  localStorage.removeItem("mindspace_token");
  localStorage.removeItem("mindspace_user");
  localStorage.removeItem("mindspace_avatar");
  localStorage.removeItem("mindspace_prefs");
  localStorage.removeItem("mindspace_read_notifs");
  try {
    document.cookie = "mindspace_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch {}
  // Go to login page — reliable hard redirect
  window.location.href = "/login";
};

export const clearAuth = logout;

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const res  = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Signup failed.");
  return json;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res  = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed.");
  return json;
};