import { clearAuth } from "./auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 401) {
    clearAuth();
    document.cookie = "mindspace_token=; path=/; max-age=0";

    // Only hard-redirect if we're not already on the landing page.
    // Without this guard, any authenticated call made from "/" (e.g. on
    // mount) will 401 -> redirect to "/" -> full reload -> same call runs
    // again -> 401 again -> redirect again, forever. That's almost
    // certainly what's causing the nonstop `GET /` requests.
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }

    throw new Error("Session expired. Please log in again.");
  }

  return res;
}