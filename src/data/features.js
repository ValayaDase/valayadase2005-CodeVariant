export const coreFeatures = [
  {
    id: "space-discovery",
    title: "Space Discovery",
    tagline: "Sensory-verified work spaces",
    description:
      "Filter verified spaces by acoustic telemetry, ergonomic chair ratings, natural daylight levels, and artisan coffee quality. Never gamble your afternoon on an unpredictable cafe again.",
    metrics: [
      { label: "Acoustic Telemetry", value: "Verified <38 dB" },
      { label: "Seating Ergonomics", value: "Lumbar & Oak Craft" },
      { label: "Natural Illumination", value: "9.4 / 10 Daylight" },
      { label: "Outlets Density", value: "1:1 Desk Access" },
    ],
    highlight: "Real-time sensory telemetry mapped across 340+ curated spaces.",
  },
  {
    id: "quiet-when",
    title: "Quiet When",
    tagline: "Predictive noise & crowd curves",
    description:
      "Acoustic forecasting predicts noise spikes hours in advance. Know exactly when the espresso rush peaks, when group meetings clear out, and when the absolute calmest windows occur.",
    metrics: [
      { label: "Peak Noise Alert", value: "12:15 PM - 1:30 PM" },
      { label: "Golden Window", value: "8:00 AM - 11:30 AM (28 dB)" },
      { label: "Forecast Accuracy", value: "96.4% Historical" },
      { label: "Sensor Refresh", value: "Every 90 seconds" },
    ],
    highlight: "Hourly acoustic forecasts updated via ambient sound sensors.",
  },
  {
    id: "community-intelligence",
    title: "Community Intelligence",
    tagline: "Live telemetry from focused peers",
    description:
      "A network of mindful remote workers, researchers, and writers share real-time updates on outlet reliability, playlist decibels, ambient temperature, and seating availability.",
    metrics: [
      { label: "Active Contributors", value: "14,200+ Nomads" },
      { label: "Socket Verification", value: "Confirmed 12m ago" },
      { label: "Ambient Vibe", value: "Lo-fi / Ambient Strings" },
      { label: "Crowd Status", value: "Low murmur (18% full)" },
    ],
    highlight: "Crowd-verified data points with anti-noise accountability.",
  },
  {
    id: "suitability-engine",
    title: "Suitability Engine",
    tagline: "Task-aware space recommendation",
    description:
      "Select your current work state—deep coding sprint, editorial writing, client call, or reading—and our engine ranks venues matching your acoustic and privacy requirements.",
    metrics: [
      { label: "Deep Work Match", value: "99.2% Match Score" },
      { label: "Video Call Safe", value: "Soundproof booths ready" },
      { label: "Wi-Fi Fiber", value: "280 Mbps Latency 4ms" },
      { label: "Power Reliability", value: "100% Verified Uptime" },
    ],
    highlight: "Intent-based algorithmic matchmaking for your exact cognitive task.",
  },
];

export const sampleVenue = {
  name: "The Glasshouse Atelier & Library",
  neighborhood: "Greenwich Heritage Quarter",
  distance: "0.4 miles away",
  quietScore: "98/100",
  decibels: 28,
  decibelLabel: "Whisper quiet · Library ambient",
  crowdLevel: 18,
  crowdLabel: "Plenty of open desks",
  wifiSpeed: "280 Mbps",
  wifiType: "Low-latency fiber optic",
  powerAvailability: "92% tables equipped",
  seatingType: "Ergonomic wood & soft wool",
  coffeeRating: "Single-origin pour-over available",
  daylightRating: "Floor-to-ceiling north light",
  statusBadge: "Ideal for Deep Focus",
  sampleNotice: "Sample Venue Indicator · Simulated Live Telemetry",
};

export const problemStatements = [
  {
    id: "decibel-roulette",
    title: "The Decibel Roulette",
    subtitle: "When a peaceful spot turns into a chaotic blender choir",
    description:
      "You settle into a seat, open your code editor or manuscript, and ten minutes later a commercial espresso steam wand screams, followed by a loud group interview right next to you.",
    stat: "68%",
    statNote: "of workers abandon their cafe within 40 minutes due to unexpected noise spikes.",
    tag: "Acoustic Chaos",
  },
  {
    id: "phantom-outlets",
    title: "The Phantom Plug Hunt",
    subtitle: "Crawling under tables only to find dead wall sockets",
    description:
      "Your laptop battery hits 14%. You awkwardly squeeze behind armchairs and crawl under dusty benches only to discover the only outlet is broken or blocked by a fixture.",
    stat: "1 in 3",
    statNote: "remote workers experience battery anxiety during critical focus blocks.",
    tag: "Power Uncertainty",
  },
  {
    id: "peak-squeeze",
    title: "The Peak-Hour Commute Gamble",
    subtitle: "Walking 20 minutes across town just to find zero seats",
    description:
      "You packed your bag, braved the weather, and arrived with high ambitions, only to stare at a sea of occupied tables and laptop hoarders with empty cups.",
    stat: "42 min",
    statNote: "lost on average every week searching for an acceptable workspace.",
    tag: "Displaced Effort",
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Declare Your Focus Intent",
    description:
      "Choose your task mode—deep coding sprint, manuscript writing, quiet reading, or video consultations. Set your threshold for ambient sound, ergonomics, and power.",
    tag: "Intent Matching",
  },
  {
    step: "02",
    title: "Live Sensory Telemetry Scan",
    description:
      "Spotwise cross-references ambient decibel monitors, Wi-Fi speed logs, and community crowd reports to identify spaces currently inside their quietest window.",
    tag: "Acoustic Telemetry",
  },
  {
    step: "03",
    title: "Claim Your Spot & Enter Flow State",
    description:
      "Arrive with confidence. Know which table has outlets, what the ambient noise level is right now, and how long the quiet window is guaranteed to last.",
    tag: "Guaranteed Focus",
  },
];
