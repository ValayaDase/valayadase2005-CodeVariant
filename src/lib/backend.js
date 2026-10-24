import { getSavedVenueIds, saveVenueId } from "@/lib/discovery/venue-data";

const DEMO_USER_KEY = "spotwise_demo_user_id";
const savedSyncRequests = new Map();

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

/** Merge browser-era saves into MongoDB, then hydrate the browser cache from MongoDB. */
export async function syncSavedVenueIds() {
  const userId = getDemoUserId();
  if (!savedSyncRequests.has(userId)) {
    const syncRequest = (async () => {
      const localIds = getSavedVenueIds();
      const { venueIds = [] } = await backendRequest(`/api/saved/${userId}`);
      const mergedIds = [...new Set([...venueIds, ...localIds])];

      await Promise.all(
        localIds
          .filter((venueId) => !venueIds.includes(venueId))
          .map((venueId) => backendRequest(`/api/saved/${venueId}`, {
            method: "PUT",
            body: JSON.stringify({ userId, saved: true }),
          }))
      );

      mergedIds.forEach(saveVenueId);
      return mergedIds;
    })();
    savedSyncRequests.set(userId, syncRequest);
    syncRequest.finally(() => savedSyncRequests.delete(userId)).catch(() => {});
  }
  return savedSyncRequests.get(userId);
}
