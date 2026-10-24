"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useSyncExternalStore,
  useCallback,
} from "react";

const STORAGE_KEY = "spotwise_manual_location_v1";

export const CURATED_DISTRICTS = [
  {
    id: "bloomsbury",
    name: "Bloomsbury & Knowledge Quarter",
    description: "British Museum, UCL, Heritage Reading Rooms",
    lat: 51.5218,
    lng: -0.1268,
  },
  {
    id: "covent-garden",
    name: "Covent Garden & Strand",
    description: "Central London, Paper & Press, Theatres",
    lat: 51.5126,
    lng: -0.1235,
  },
  {
    id: "shoreditch",
    name: "Shoreditch & Silicon Roundabout",
    description: "Tech hubs, Nordic Brew, creative lofts",
    lat: 51.5245,
    lng: -0.0762,
  },
  {
    id: "south-bank",
    name: "South Bank & Bankside",
    description: "Tate Modern, Foundry Studios, Riverfront",
    lat: 51.5042,
    lng: -0.0982,
  },
  {
    id: "city-london",
    name: "City of London & Guildhall",
    description: "Athenaeum, quiet financial district libraries",
    lat: 51.5129,
    lng: -0.0938,
  },
  {
    id: "greenwich",
    name: "Greenwich Heritage & Observatory",
    description: "Glasshouse Study, Maritime Quarter, fig cafes",
    lat: 51.4816,
    lng: -0.0091,
  },
];

const LocationContext = createContext(null);

function subscribeLocation(callback) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("spotwise_location_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("spotwise_location_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLocationSnapshot() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

export function useUserLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useUserLocation must be used within a LocationProvider");
  }
  return ctx;
}

export function LocationProvider({ children }) {
  const [liveLocation, setLiveLocation] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle' | 'requesting' | 'granted' | 'denied' | 'timeout' | 'unavailable' | 'unsupported'
  const [errorMessage, setErrorMessage] = useState("");

  const storedJson = useSyncExternalStore(
    subscribeLocation,
    getLocationSnapshot,
    getServerSnapshot
  );

  const storedLocation = useMemo(() => {
    if (!storedJson) return null;
    try {
      const parsed = JSON.parse(storedJson);
      if (parsed?.lat && parsed?.lng) {
        return {
          lat: parsed.lat,
          lng: parsed.lng,
          accuracy: parsed.accuracy || 100,
          label: parsed.label || "Manual District Origin",
          source: "manual",
          districtId: parsed.districtId,
          timestamp: parsed.timestamp || 0,
        };
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  }, [storedJson]);

  const userLocation = liveLocation || storedLocation;

  // Request browser geolocation with explicit user permission
  const requestCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setErrorMessage("Geolocation is not supported by your browser. Please select a district manually.");
      return;
    }

    setStatus("requesting");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 50,
          label: "Your Exact Location",
          source: "gps",
          timestamp: Date.now(),
        };

        setLiveLocation(newLocation);
        setStatus("granted");
        setErrorMessage("");

        // Broadcast event so any interested component can react
        window.dispatchEvent(
          new CustomEvent("spotwise_location_changed", { detail: newLocation })
        );
      },
      (error) => {
        let msg = "Could not obtain location.";
        let errStatus = "unavailable";

        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errStatus = "denied";
            msg = "Location permission was denied. You can select a district manually below.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errStatus = "unavailable";
            msg = "Location signal is currently unavailable. Try selecting a nearby district.";
            break;
          case 3: // TIMEOUT
            errStatus = "timeout";
            msg = "Location request timed out. Please try again or select a district.";
            break;
          default:
            errStatus = "unavailable";
            msg = error.message || "An unexpected location error occurred.";
            break;
        }

        setStatus(errStatus);
        setErrorMessage(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Set manual fallback origin (e.g. Bloomsbury, Shoreditch, Greenwich)
  const setManualDistrict = useCallback((districtId) => {
    const district = CURATED_DISTRICTS.find((d) => d.id === districtId);
    if (!district) return;

    const loc = {
      lat: district.lat,
      lng: district.lng,
      accuracy: 250,
      label: district.name,
      source: "manual",
      districtId: district.id,
      timestamp: Date.now(),
    };

    setLiveLocation(null);
    setStatus("granted");
    setErrorMessage("");

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event("spotwise_location_updated"));
    window.dispatchEvent(new CustomEvent("spotwise_location_changed", { detail: loc }));
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLiveLocation(null);
    setStatus("idle");
    setErrorMessage("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("spotwise_location_updated"));
    window.dispatchEvent(new CustomEvent("spotwise_location_changed", { detail: null }));
  }, []);

  const value = {
    userLocation,
    status,
    errorMessage,
    isManual: userLocation?.source === "manual",
    isGps: userLocation?.source === "gps",
    hasLocation: Boolean(userLocation?.lat && userLocation?.lng),
    requestCurrentLocation,
    setManualDistrict,
    clearLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
