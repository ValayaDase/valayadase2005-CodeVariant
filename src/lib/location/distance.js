/**
 * Spotwise Geographic Distance & Coordinate Utilities
 * Uses standard spherical Haversine formula to compute accurate straight-line distances.
 */

/**
 * Calculates straight-line distance in kilometers between two geographic coordinates.
 * Returns null if any coordinate is missing or invalid.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number" ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }

  // Earth's mean radius in kilometers
  const R = 6371;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 100) / 100; // Round to 2 decimal places
}

/**
 * Formats a geographic distance according to Spotwise application rules:
 * - Under 1 km: display in meters (e.g., "450 m straight-line")
 * - 1 km and above: display in kilometers with 1 decimal (e.g., "2.4 km straight-line")
 * - Missing/invalid: "Distance unavailable"
 */
export function formatDistance(distanceKm, { compact = false, labelType = "straight-line" } = {}) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return {
      text: "Distance unavailable",
      compact: "--",
      value: null,
      unit: "",
    };
  }

  const suffix = labelType ? ` ${labelType}` : "";

  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return {
      text: compact ? `${meters}m` : `${meters} m${suffix}`,
      compact: `${meters}m`,
      value: meters,
      unit: "m",
    };
  }

  const formattedKm = distanceKm.toFixed(1);
  return {
    text: compact ? `${formattedKm}km` : `${formattedKm} km${suffix}`,
    compact: `${formattedKm}km`,
    value: parseFloat(formattedKm),
    unit: "km",
  };
}

/**
 * Generates turn-by-turn navigation deep links to Google Maps / OpenStreetMap
 */
export function getDirectionsUrl(destination, origin = null) {
  if (!destination || typeof destination.lat !== "number" || typeof destination.lng !== "number") {
    return "#";
  }

  const destCoords = `${destination.lat},${destination.lng}`;

  if (origin && typeof origin.lat === "number" && typeof origin.lng === "number") {
    const originCoords = `${origin.lat},${origin.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destCoords}&travelmode=walking`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=walking`;
}
