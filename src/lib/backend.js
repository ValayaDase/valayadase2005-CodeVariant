const DEMO_USER_KEY = "spotwise_demo_user_id";

export function getDemoUserId() {
  if (typeof window === "undefined") return "spotwise-demo";
  let id = window.localStorage.getItem(DEMO_USER_KEY);
  if (!id) {
    id = `guest-${window.crypto?.randomUUID?.() || Date.now()}`;
    window.localStorage.setItem(DEMO_USER_KEY, id);
  }
  return id;
}

export async function backendRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    cache: options.cache || "no-store",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "The Spotwise backend is unavailable.");
  }
  return payload;
}
