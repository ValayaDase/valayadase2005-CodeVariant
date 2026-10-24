/**
 * Suitability Engine - Calculates Focus Fit Score (0-100) and rationale
 * Independent of React components for pure testability and maintainability.
 */

const FACILITY_LABELS = {
  wifi: "Fast Wi-Fi",
  power_outlets: "Power Outlets",
  ergonomic_seating: "Ergonomic Chairs",
  quiet_zone: "Silent Focus Zone",
  coffee: "Coffee & Tea",
  soundproof_booths: "Call Pods",
  outdoor_terrace: "Outdoor Terrace",
  accessible: "Accessible Entry",
};

export function calculateSuitability(venue, filters = {}) {
  const {
    activity = "Deep Work",
    noisePreference = "Quiet",
    budget = "Any",
    day = "Monday",
    time = "morning",
    requiredFacilities = [],
  } = filters;

  let totalScore = 0;
  const matchReasons = [];
  const missingFactors = [];

  // 1. Activity & Noise Compatibility (Max 35 points)
  let noiseScore = 0;
  const venueNoise = venue.noiseLevel || "Moderate";
  const decibels = venue.baseDecibels || 35;

  if (activity === "Deep Work" || activity === "Studying") {
    if (noisePreference === "Quiet" || noisePreference === "Any") {
      if (venueNoise === "Quiet") {
        noiseScore = 35;
        matchReasons.push(`Acoustically calibrated for silence (${decibels} dB average)`);
      } else if (venueNoise === "Moderate") {
        noiseScore = 20;
        missingFactors.push(`Ambient murmur is higher (${decibels} dB) than ideal for deep focus`);
      } else {
        noiseScore = 8;
        missingFactors.push(`Lively venue atmosphere (${decibels} dB) may disrupt concentration`);
      }
    } else if (noisePreference === "Moderate") {
      noiseScore = venueNoise === "Moderate" ? 35 : 22;
      matchReasons.push("Matches preferred moderate energy level");
    } else {
      noiseScore = 25;
    }
  } else if (activity === "Meeting") {
    if (venue.facilities?.includes("soundproof_booths")) {
      noiseScore = 35;
      matchReasons.push("Equipped with soundproof call pods for client conversations");
    } else if (venueNoise === "Moderate" || venueNoise === "Lively") {
      noiseScore = 28;
      matchReasons.push("Conversational atmosphere acceptable for group discussions");
    } else {
      noiseScore = 12;
      missingFactors.push("Strict quiet policy prohibits voice calls and team discussions");
    }
  } else {
    // Casual Work
    noiseScore = venueNoise === "Moderate" ? 35 : 30;
    matchReasons.push("Great general productivity ambiance");
  }
  totalScore += noiseScore;

  // 2. Day & Time Slot Crowd Suitability (Max 30 points)
  let crowdScore = 0;
  const daySchedule = venue.crowdSchedule?.[day];
  const timeSlot = daySchedule?.[time];

  if (timeSlot) {
    const crowdPct = timeSlot.crowd;
    if (crowdPct <= 25) {
      crowdScore = 30;
      matchReasons.push(`Optimal quiet window: only ~${crowdPct}% occupancy estimated for ${day} ${time}`);
    } else if (crowdPct <= 50) {
      crowdScore = 24;
      matchReasons.push(`Comfortable desk availability (~${crowdPct}% crowd)`);
    } else if (crowdPct <= 75) {
      crowdScore = 14;
      missingFactors.push(`High occupancy expected (~${crowdPct}% capacity) on ${day} ${time}`);
    } else {
      crowdScore = 6;
      missingFactors.push(`Peak rush alert: ~${crowdPct}% capacity, seats may be scarce`);
    }
  } else {
    // Missing schedule data
    crowdScore = 12;
    missingFactors.push(`Crowd telemetry for ${day} ${time} is unknown`);
  }
  totalScore += crowdScore;

  // 3. Required Facilities Matching (Max 25 points)
  let facilityScore = 25;
  if (requiredFacilities.length > 0) {
    const venueFacs = venue.facilities || [];
    let matchedCount = 0;
    const missingFacilities = [];

    requiredFacilities.forEach((fac) => {
      if (venueFacs.includes(fac)) {
        matchedCount++;
      } else {
        missingFacilities.push(FACILITY_LABELS[fac] || fac);
      }
    });

    const ratio = matchedCount / requiredFacilities.length;
    facilityScore = Math.round(ratio * 25);

    if (missingFacilities.length === 0) {
      matchReasons.push(`All ${requiredFacilities.length} required facilities verified`);
    } else {
      missingFactors.push(`Missing: ${missingFacilities.join(", ")}`);
    }
  } else {
    // No required facilities requested - reward overall richness
    const count = (venue.facilities || []).length;
    facilityScore = Math.min(25, count * 4);
    if (venue.facilities?.includes("wifi") && venue.facilities?.includes("power_outlets")) {
      matchReasons.push("Equipped with fast fiber and desk power");
    }
  }
  totalScore += facilityScore;

  // 4. Budget Compatibility (Max 10 points)
  let budgetScore = 10;
  if (budget && budget !== "Any") {
    const venueBudget = venue.budget || "$$";
    const hierarchy = { Free: 0, $: 1, "$$": 2, "$$$": 3 };
    const userMax = hierarchy[budget] ?? 2;
    const venueCost = hierarchy[venueBudget] ?? 2;

    if (venueCost <= userMax) {
      budgetScore = 10;
      matchReasons.push(`Fits within budget (${venueBudget})`);
    } else {
      budgetScore = 2;
      missingFactors.push(`Exceeds preferred budget (${venueBudget} vs ${budget})`);
    }
  } else {
    budgetScore = 10;
  }
  totalScore += budgetScore;

  // Bound between 0 and 100
  const finalScore = Math.max(10, Math.min(100, Math.round(totalScore)));

  // Determine badge grade
  let grade = "Moderate Fit";
  let gradeTheme = "amber";
  if (finalScore >= 85) {
    grade = "Exceptional Fit";
    gradeTheme = "forest";
  } else if (finalScore >= 70) {
    grade = "Strong Fit";
    gradeTheme = "sage";
  } else if (finalScore < 50) {
    grade = "Low Fit";
    gradeTheme = "charcoal";
  }

  return {
    score: finalScore,
    grade,
    gradeTheme,
    matchReasons,
    missingFactors,
    breakdown: {
      noiseScore,
      crowdScore,
      facilityScore,
      budgetScore,
    },
  };
}
