/**
 * Custom SVG Botanical & Focus Marker Generators for Spotwise Leaflet Map
 */

// SVG Icon Glyphs
const ICONS = {
  library: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h7"/></svg>`,
  cafe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
  coworking: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/><path d="M7 16v4"/><path d="M17 16v4"/></svg>`,
  default: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8Z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

function getCategoryIcon(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("library") || c.includes("reading") || c.includes("archive")) {
    return ICONS.library;
  }
  if (c.includes("cafe") || c.includes("coffee") || c.includes("brew") || c.includes("pour")) {
    return ICONS.cafe;
  }
  if (c.includes("coworking") || c.includes("studio") || c.includes("loft") || c.includes("atelier")) {
    return ICONS.coworking;
  }
  return ICONS.default;
}

/**
 * Generates custom HTML divIcon for a Spotwise venue marker
 */
export function createVenueDivIcon(L, venue, { isSelected = false, fitScore = null } = {}) {
  const iconSvg = getCategoryIcon(venue.category);
  const nameSnippet = (venue.name || "Spot").split(" ").slice(0, 2).join(" ");
  const decibels = venue.baseDecibels ? `${venue.baseDecibels}dB` : "";
  const scoreDisplay = fitScore ? `${fitScore}%` : decibels;

  const bgStyle = isSelected
    ? "background: #26382B; color: #FAF8F3; border: 2px solid #819477; box-shadow: 0 0 0 5px rgba(129, 148, 119, 0.35), 0 14px 28px rgba(38, 56, 43, 0.4);"
    : "background: #FFFFFF; color: #20231F; border: 1.5px solid #E8E0D2; box-shadow: 0 6px 18px rgba(32, 35, 31, 0.12);";

  const iconBg = isSelected ? "background: #819477; color: #FFFFFF;" : "background: #F5F3EC; color: #26382B;";

  const html = `
    <div
      role="button"
      tabindex="0"
      aria-label="${venue.name}, ${venue.categoryLabel || "Workspace"}, ${scoreDisplay}"
      class="spotwise-marker-wrap ${isSelected ? "is-selected" : ""}"
      style="
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px 5px 6px;
        border-radius: 9999px;
        font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        transform: ${isSelected ? "scale(1.15) translateY(-4px)" : "scale(1)"};
        ${bgStyle}
        user-select: none;
      "
    >
      <!-- Botanical Glyph Pill -->
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        ${iconBg}
        flex-shrink: 0;
      ">
        ${iconSvg}
      </span>

      <!-- Name Snippet -->
      <span style="
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: -0.01em;
      ">
        ${nameSnippet}
      </span>

      <!-- Telemetry Badge (Fit Score or Decibels) -->
      ${
        scoreDisplay
          ? `
        <span style="
          padding: 1px 6px;
          border-radius: 9999px;
          font-size: 9.5px;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          background: ${isSelected ? "#1D2B20" : "#EBF0E9"};
          color: ${isSelected ? "#A1B597" : "#26382B"};
          letter-spacing: 0.02em;
        ">
          ${scoreDisplay}
        </span>
      `
          : ""
      }

      <!-- Bottom Pin Pointer Triangle -->
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${isSelected ? "#819477" : "#E8E0D2"};
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "spotwise-custom-leaflet-marker",
    iconSize: [160, 36],
    iconAnchor: [80, 38],
    popupAnchor: [0, -36],
  });
}

/**
 * Generates custom HTML divIcon for the User's current location with concentric radar rings
 */
export function createUserLocationDivIcon(L, { accuracy = 50, isManual = false } = {}) {
  const html = `
    <div
      role="img"
      aria-label="Your location (accuracy: within ${Math.round(accuracy)} meters)"
      style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <!-- Radar Pulse Ring -->
      <div style="
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: ${isManual ? "rgba(197, 140, 90, 0.4)" : "rgba(38, 56, 43, 0.35)"};
        animation: spotwise-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>

      <!-- Outer Ring -->
      <div style="
        position: absolute;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #FFFFFF;
        box-shadow: 0 4px 12px rgba(32, 35, 31, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Inner Core Beacon -->
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${isManual ? "#C58C5A" : "#26382B"};
          box-shadow: inset 0 0 0 2px #FFFFFF;
        "></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "spotwise-user-location-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
