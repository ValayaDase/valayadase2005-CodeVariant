import initialVenues from "@/data/venues.json";

const STORAGE_KEYS = {
  REPORTS: "spotwise_demo_reports_v1",
  SAVED: "spotwise_demo_saved_venues_v1",
  CHAT: "spotwise_demo_chat_v1",
  PREFERENCES: "spotwise_demo_preferences_v1",
};

/**
 * Safely parse JSON from localStorage
 */
function getStorage(key, fallback = []) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

/**
 * Safely write JSON to localStorage
 */
function setStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
}

/**
 * Get all venues merged with local community reports
 */
export function getAllVenues() {
  const venues = JSON.parse(JSON.stringify(initialVenues));
  const localReports = getStorage(STORAGE_KEYS.REPORTS, []);

  if (localReports.length === 0) return venues;

  // Merge local user-submitted reports into venue models
  return venues.map((venue) => {
    const matchingReports = localReports.filter((r) => r.venueId === venue.id);
    if (matchingReports.length > 0) {
      return {
        ...venue,
        sampleReports: [...matchingReports, ...(venue.sampleReports || [])],
        lastUpdated: matchingReports[0].timestampIso || venue.lastUpdated,
      };
    }
    return venue;
  });
}

/**
 * Get single venue by ID
 */
export function getVenueById(id) {
  const venues = getAllVenues();
  return venues.find((v) => v.id === id) || null;
}

/**
 * Save a new user community report
 */
export function saveVenueReport(venueId, reportData) {
  const existingReports = getStorage(STORAGE_KEYS.REPORTS, []);
  const newReport = {
    id: `rep-user-${Date.now()}`,
    venueId,
    author: reportData.author || "You (Demo User)",
    timestamp: "Just now",
    timestampIso: new Date().toISOString(),
    crowd: reportData.crowd,
    noise: reportData.noise,
    wifi: reportData.wifi,
    outlets: reportData.outlets,
    note: reportData.note || "",
    status: "Verified Local Report",
    provenance: "Local Browser Session",
  };

  const updatedReports = [newReport, ...existingReports];
  setStorage(STORAGE_KEYS.REPORTS, updatedReports);
  return newReport;
}

/**
 * Get all user submitted demo reports
 */
export function getAllReports() {
  const localReports = getStorage(STORAGE_KEYS.REPORTS, []);
  const venues = initialVenues;

  return localReports.map((report) => {
    const venue = venues.find((v) => v.id === report.venueId);
    return {
      ...report,
      venueName: venue ? venue.name : "Unknown Venue",
      venueCategory: venue ? venue.categoryLabel : "Workspace",
      neighborhood: venue ? venue.neighborhood : "",
    };
  });
}

/**
 * Saved / Bookmarked venues
 */
export function getSavedVenueIds() {
  return getStorage(STORAGE_KEYS.SAVED, []);
}

export function isVenueSaved(venueId) {
  const saved = getSavedVenueIds();
  return saved.includes(venueId);
}

export function toggleSavedVenue(venueId) {
  const current = getSavedVenueIds();
  let updated;
  if (current.includes(venueId)) {
    updated = current.filter((id) => id !== venueId);
  } else {
    updated = [venueId, ...current];
  }
  setStorage(STORAGE_KEYS.SAVED, updated);
  return updated.includes(venueId);
}

export function getSavedVenues() {
  const savedIds = getSavedVenueIds();
  const all = getAllVenues();
  return all.filter((v) => savedIds.includes(v.id));
}

/**
 * Venue Chat Storage
 */
const DEFAULT_PRELOADED_MESSAGES = {
  "glasshouse-atelier": [
    {
      id: "msg-1",
      author: "Oliver W.",
      role: "Nomad Member",
      time: "10:14 AM",
      text: "Is the outdoor garden terrace open today? Sunny out!",
    },
    {
      id: "msg-2",
      author: "Maya Lin",
      role: "Spotwise Scout",
      time: "10:20 AM",
      text: "Yes, terrace is open and shaded! Very breezy and quiet.",
    },
    {
      id: "msg-3",
      author: "David K.",
      role: "Researcher",
      time: "11:05 AM",
      text: "Just arrived in the east wing. Plentiful desks with power outlets right now.",
    },
  ],
  "heritage-reading-room": [
    {
      id: "msg-hr-1",
      author: "Clara S.",
      role: "PhD Candidate",
      time: "09:30 AM",
      text: "Reminder that carrel 14-22 have the best north natural light.",
    },
    {
      id: "msg-hr-2",
      author: "Dr. James",
      role: "Fellow",
      time: "10:45 AM",
      text: "Absolute silence today. Please keep laptops on soft typing cushions.",
    },
  ],
};

export function getVenueChatMessages(venueId) {
  const storedChat = getStorage(STORAGE_KEYS.CHAT, {});
  if (storedChat[venueId]) {
    return storedChat[venueId];
  }
  return DEFAULT_PRELOADED_MESSAGES[venueId] || [
    {
      id: "welcome-1",
      author: "Spotwise Guide",
      role: "Host",
      time: "Today",
      text: "Welcome to the venue channel! Leave real-time tips on desk availability, playlist volume, or coffee recommendations.",
    },
  ];
}

export function sendVenueChatMessage(venueId, text, author = "You") {
  const storedChat = getStorage(STORAGE_KEYS.CHAT, {});
  const currentMessages = getVenueChatMessages(venueId);

  const newMsg = {
    id: `msg-${Date.now()}`,
    author,
    role: "Demo User",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    text,
    isLocal: true,
  };

  const updatedMessages = [...currentMessages, newMsg];
  storedChat[venueId] = updatedMessages;
  setStorage(STORAGE_KEYS.CHAT, storedChat);
  return newMsg;
}

/**
 * User Preferences Storage
 */
export const DEFAULT_PREFERENCES = {
  activity: "Deep Work",
  noisePreference: "Quiet",
  budget: "$$",
  requiredFacilities: ["wifi", "power_outlets", "ergonomic_seating"],
  defaultDay: "Today",
  defaultTime: "morning",
};

export function getUserPreferences() {
  return getStorage(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
}

export function saveUserPreferences(prefs) {
  setStorage(STORAGE_KEYS.PREFERENCES, prefs);
  return prefs;
}
