import { clearAuth } from "./auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(url, options);

  // Token expired or invalid — clear everything and redirect to login
  if (res.status === 401) {
    clearAuth();
    // Clear cookie too
    document.cookie = "mindspace_token=; path=/; max-age=0";
    window.location.href = "/login";
    // Throw so calling code stops execution
    throw new Error("Session expired. Please log in again.");
  }

  return res;
}