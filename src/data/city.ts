export type MarkerCategory =
  | "waste"
  | "energy"
  | "air"
  | "water"
  | "traffic"
  | "ev"
  | "green"
  | "transport";

export type MarkerStatus = "normal" | "attention" | "critical" | "infra";

export interface CityMarker {
  id: string;
  label: string;
  category: MarkerCategory;
  status: MarkerStatus;
  x: number; // percent of map width
  y: number; // percent of map height
  zone: string;
  metrics: { label: string; value: string; accent?: boolean }[];
  prediction: string;
  action: string;
  extra?: string;
}

export const CATEGORY_META: Record<
  MarkerCategory,
  { label: string; icon: string; short: string }
> = {
  waste: { label: "Smart Waste Bin", icon: "🗑", short: "Waste" },
  energy: { label: "Smart Street Light", icon: "💡", short: "Energy" },
  air: { label: "Air Quality Station", icon: "🌫", short: "Air" },
  water: { label: "Water Monitoring Station", icon: "💧", short: "Water" },
  traffic: { label: "Traffic Junction", icon: "🚦", short: "Traffic" },
  ev: { label: "EV Charging Station", icon: "🔋", short: "EV" },
  green: { label: "Green Zone", icon: "🌳", short: "Green Zones" },
  transport: { label: "Public Transport Hub", icon: "🚌", short: "Transport" },
};

export const STATUS_COLOR: Record<MarkerStatus, { hex: string; label: string; tw: string }> = {
  normal: { hex: "#34d399", label: "Normal", tw: "text-eco-400" },
  attention: { hex: "#fbbf24", label: "Attention", tw: "text-amber-400" },
  critical: { hex: "#f87171", label: "Critical", tw: "text-red-400" },
  infra: { hex: "#22d3ee", label: "Infrastructure", tw: "text-cyber-400" },
};

export const CITY_MARKERS: CityMarker[] = [
  {
    id: "BIN-024",
    label: "Smart Bin #024",
    category: "waste",
    status: "critical",
    x: 46,
    y: 57,
    zone: "Zone 4 · Central Market",
    metrics: [
      { label: "Fill Level", value: "91%", accent: true },
      { label: "Status", value: "Collection Required" },
      { label: "Last Emptied", value: "19h ago" },
      { label: "Odour Index", value: "High" },
    ],
    prediction: "Full within approximately 2 hours",
    action: "Dispatch Waste Vehicle #07",
    extra: "Estimated Route · 4.2 km",
  },
  {
    id: "BIN-108",
    label: "Smart Bin #108",
    category: "waste",
    status: "attention",
    x: 24,
    y: 33,
    zone: "Zone 2 · Harbour Road",
    metrics: [
      { label: "Fill Level", value: "67%", accent: true },
      { label: "Status", value: "Needs Attention" },
      { label: "Last Emptied", value: "9h ago" },
      { label: "Odour Index", value: "Low" },
    ],
    prediction: "Full within approximately 6 hours",
    action: "Queue for next scheduled route",
    extra: "Estimated Route · 2.6 km",
  },
  {
    id: "BIN-341",
    label: "Smart Bin #341",
    category: "waste",
    status: "normal",
    x: 71,
    y: 24,
    zone: "Zone 6 · Tech Park",
    metrics: [
      { label: "Fill Level", value: "32%", accent: true },
      { label: "Status", value: "Normal" },
      { label: "Last Emptied", value: "4h ago" },
      { label: "Odour Index", value: "None" },
    ],
    prediction: "Full within approximately 18 hours",
    action: "No action required",
    extra: "Trip avoided · saves 3.1 km",
  },
  {
    id: "AQ-07",
    label: "Air Station AQ-07",
    category: "air",
    status: "critical",
    x: 53,
    y: 48,
    zone: "Zone 4 · Civic Centre",
    metrics: [
      { label: "AQI", value: "168", accent: true },
      { label: "PM2.5", value: "98 µg/m³" },
      { label: "NO₂", value: "61 ppb" },
      { label: "Status", value: "Unhealthy" },
    ],
    prediction: "AQI likely to rise to 180 during evening peak",
    action: "Increase monitoring + recommend traffic reduction",
    extra: "Hotspot radius · 1.4 km",
  },
  {
    id: "AQ-02",
    label: "Air Station AQ-02",
    category: "air",
    status: "normal",
    x: 81,
    y: 62,
    zone: "Zone 7 · Beach Road",
    metrics: [
      { label: "AQI", value: "58", accent: true },
      { label: "PM2.5", value: "21 µg/m³" },
      { label: "NO₂", value: "17 ppb" },
      { label: "Status", value: "Good" },
    ],
    prediction: "Stable for the next 8 hours",
    action: "Maintain routine sampling",
  },
  {
    id: "WTR-12",
    label: "Water Node WTR-12",
    category: "water",
    status: "attention",
    x: 38,
    y: 71,
    zone: "Zone 4 · South Grid",
    metrics: [
      { label: "Flow Rate", value: "412 L/min", accent: true },
      { label: "Deviation", value: "+23% vs pattern" },
      { label: "Pressure", value: "2.1 bar" },
      { label: "Status", value: "Suspected Leak" },
    ],
    prediction: "Potential loss of 48,000 L/day if unresolved",
    action: "Dispatch inspection crew to segment D-12",
    extra: "Confidence · 82%",
  },
  {
    id: "WTR-04",
    label: "Reservoir WTR-04",
    category: "water",
    status: "infra",
    x: 15,
    y: 58,
    zone: "Zone 1 · West Reservoir",
    metrics: [
      { label: "Tank Level", value: "82%", accent: true },
      { label: "Inflow", value: "1.1 ML/day" },
      { label: "Turbidity", value: "0.8 NTU" },
      { label: "Status", value: "Healthy" },
    ],
    prediction: "Supply secure for 6.2 days at current draw",
    action: "No action required",
  },
  {
    id: "JNC-18",
    label: "Junction #18",
    category: "traffic",
    status: "critical",
    x: 58,
    y: 61,
    zone: "Zone 4 · Ring Road Cross",
    metrics: [
      { label: "Congestion", value: "91%", accent: true },
      { label: "Avg Speed", value: "9 km/h" },
      { label: "Queue Length", value: "640 m" },
      { label: "Signal Mode", value: "Fixed" },
    ],
    prediction: "Gridlock probability 74% in next 40 minutes",
    action: "Switch to adaptive signals + divert via Route B",
    extra: "Projected relief · 21%",
  },
  {
    id: "JNC-05",
    label: "Junction #05",
    category: "traffic",
    status: "attention",
    x: 33,
    y: 46,
    zone: "Zone 2 · Port Gate",
    metrics: [
      { label: "Congestion", value: "64%", accent: true },
      { label: "Avg Speed", value: "22 km/h" },
      { label: "Queue Length", value: "180 m" },
      { label: "Signal Mode", value: "Adaptive" },
    ],
    prediction: "Peak expected at 18:40",
    action: "Pre-stage adaptive timing plan",
  },
  {
    id: "SL-102",
    label: "Street Light #102",
    category: "energy",
    status: "attention",
    x: 65,
    y: 38,
    zone: "Zone 5 · Avenue 9",
    metrics: [
      { label: "Brightness", value: "100%", accent: true },
      { label: "Traffic", value: "Low" },
      { label: "AI Recommended", value: "40%" },
      { label: "Draw", value: "180 W" },
    ],
    prediction: "60% energy saving available until 05:30",
    action: "Apply adaptive dimming profile",
    extra: "Cluster · 46 lamps",
  },
  {
    id: "EV-09",
    label: "EV Hub #09",
    category: "ev",
    status: "infra",
    x: 76,
    y: 45,
    zone: "Zone 6 · Tech Park",
    metrics: [
      { label: "Ports Active", value: "11 / 14", accent: true },
      { label: "Load", value: "148 kW" },
      { label: "Queue", value: "2 vehicles" },
      { label: "Solar Share", value: "38%" },
    ],
    prediction: "Peak demand at 19:00, headroom sufficient",
    action: "Shift 2 slow chargers to off-peak pricing",
  },
  {
    id: "EV-03",
    label: "EV Hub #03",
    category: "ev",
    status: "infra",
    x: 29,
    y: 66,
    zone: "Zone 3 · Transit Plaza",
    metrics: [
      { label: "Ports Active", value: "6 / 10", accent: true },
      { label: "Load", value: "72 kW" },
      { label: "Queue", value: "0 vehicles" },
      { label: "Solar Share", value: "51%" },
    ],
    prediction: "Capacity stable through the evening",
    action: "No action required",
  },
  {
    id: "GRN-01",
    label: "Hill Park Green Belt",
    category: "green",
    status: "normal",
    x: 18,
    y: 20,
    zone: "Zone 1 · Northern Ridge",
    metrics: [
      { label: "Canopy Cover", value: "71%", accent: true },
      { label: "Area", value: "128 ha" },
      { label: "CO₂ Sink", value: "2.4 kt/yr" },
      { label: "Soil Moisture", value: "Good" },
    ],
    prediction: "Canopy health stable; irrigation adequate",
    action: "Maintain current plan",
  },
  {
    id: "GRN-04",
    label: "Zone 4 Micro-Forest",
    category: "green",
    status: "attention",
    x: 49,
    y: 68,
    zone: "Zone 4 · Civic South",
    metrics: [
      { label: "Canopy Cover", value: "12%", accent: true },
      { label: "Area", value: "9 ha" },
      { label: "CO₂ Sink", value: "0.1 kt/yr" },
      { label: "Heat Island", value: "+4.1 °C" },
    ],
    prediction: "Heat island intensity rising through summer",
    action: "Prioritise 1,200 native saplings in Zone 4",
    extra: "Projected AQI relief · 6 pts",
  },
  {
    id: "BUS-21",
    label: "Transit Hub #21",
    category: "transport",
    status: "infra",
    x: 42,
    y: 40,
    zone: "Zone 3 · Central Interchange",
    metrics: [
      { label: "Headway", value: "7 min", accent: true },
      { label: "Occupancy", value: "78%" },
      { label: "Fleet Online", value: "62 buses" },
      { label: "Electric Share", value: "44%" },
    ],
    prediction: "Demand surge expected after 17:30",
    action: "Increase frequency by 15% on corridors 4 & 9",
    extra: "Projected mode shift · +6%",
  },
  {
    id: "BUS-08",
    label: "Transit Hub #08",
    category: "transport",
    status: "normal",
    x: 68,
    y: 73,
    zone: "Zone 7 · Beach Terminus",
    metrics: [
      { label: "Headway", value: "11 min", accent: true },
      { label: "Occupancy", value: "41%" },
      { label: "Fleet Online", value: "18 buses" },
      { label: "Electric Share", value: "66%" },
    ],
    prediction: "Comfortable capacity all evening",
    action: "No action required",
  },
];

export const BINS = [
  { id: "BIN-024", location: "Central Market", fill: 91, status: "Critical", eta: "2 hours", zone: "Zone 4" },
  { id: "BIN-108", location: "Harbour Road", fill: 67, status: "Attention", eta: "6 hours", zone: "Zone 2" },
  { id: "BIN-341", location: "Tech Park", fill: 32, status: "Normal", eta: "18 hours", zone: "Zone 6" },
  { id: "BIN-212", location: "Civic Centre", fill: 84, status: "Critical", eta: "3 hours", zone: "Zone 4" },
  { id: "BIN-077", location: "Beach Road", fill: 54, status: "Attention", eta: "9 hours", zone: "Zone 7" },
  { id: "BIN-455", location: "University Gate", fill: 21, status: "Normal", eta: "22 hours", zone: "Zone 5" },
];

export const AQI_24H = [
  { t: "00", aqi: 58, pm25: 24 },
  { t: "02", aqi: 52, pm25: 21 },
  { t: "04", aqi: 49, pm25: 19 },
  { t: "06", aqi: 61, pm25: 26 },
  { t: "08", aqi: 88, pm25: 41 },
  { t: "10", aqi: 96, pm25: 45 },
  { t: "12", aqi: 84, pm25: 38 },
  { t: "14", aqi: 76, pm25: 34 },
  { t: "16", aqi: 92, pm25: 43 },
  { t: "18", aqi: 118, pm25: 56 },
  { t: "20", aqi: 104, pm25: 49 },
  { t: "22", aqi: 79, pm25: 35 },
];

export const ENERGY_CURVE = [
  { t: "00", traditional: 54, optimized: 36 },
  { t: "03", traditional: 48, optimized: 30 },
  { t: "06", traditional: 62, optimized: 44 },
  { t: "09", traditional: 88, optimized: 61 },
  { t: "12", traditional: 94, optimized: 66 },
  { t: "15", traditional: 90, optimized: 62 },
  { t: "18", traditional: 112, optimized: 74 },
  { t: "21", traditional: 82, optimized: 52 },
];

export const WATER_FLOW = [
  { t: "Mon", normal: 1.72, actual: 1.75 },
  { t: "Tue", normal: 1.74, actual: 1.79 },
  { t: "Wed", normal: 1.71, actual: 1.84 },
  { t: "Thu", normal: 1.76, actual: 1.98 },
  { t: "Fri", normal: 1.78, actual: 2.12 },
  { t: "Sat", normal: 1.8, actual: 2.19 },
  { t: "Sun", normal: 1.75, actual: 2.16 },
];

export const SUSTAIN_TREND = [
  { m: "Feb", score: 61 },
  { m: "Mar", score: 64 },
  { m: "Apr", score: 66 },
  { m: "May", score: 69 },
  { m: "Jun", score: 72 },
  { m: "Jul", score: 74 },
  { m: "Aug", score: 78 },
];

export const DIMENSIONS = [
  { key: "Energy", value: 84, color: "#34d399" },
  { key: "Water", value: 71, color: "#22d3ee" },
  { key: "Waste", value: 89, color: "#34d399" },
  { key: "Transport", value: 64, color: "#fbbf24" },
  { key: "Air Quality", value: 73, color: "#22d3ee" },
  { key: "Greenery", value: 80, color: "#34d399" },
];

export const IMPACT = [
  { label: "CO₂ emissions reduced", value: 18.6 },
  { label: "Energy saved", value: 21 },
  { label: "Water saved", value: 13 },
  { label: "Waste trips reduced", value: 17 },
  { label: "Traffic congestion reduced", value: 16 },
];

export interface CitizenReport {
  id: string;
  type: string;
  icon: string;
  zone: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "Pending" | "In Progress" | "Resolved";
  time: string;
  ai?: boolean;
  dept: string;
  note: string;
}

export const REPORTS: CitizenReport[] = [
  {
    id: "#EC10279",
    type: "Garbage Overflow",
    icon: "🗑",
    zone: "Zone 4 · Central Market",
    priority: "HIGH",
    status: "In Progress",
    time: "12 min ago",
    ai: true,
    dept: "Waste Management",
    note: "Image classifier confirmed overflow with 94% confidence.",
  },
  {
    id: "#EC10276",
    type: "Water Leakage",
    icon: "💧",
    zone: "Zone 2 · Harbour Road",
    priority: "MEDIUM",
    status: "Pending",
    time: "48 min ago",
    dept: "Water Board",
    note: "Matched against flow anomaly on node WTR-12.",
  },
  {
    id: "#EC10271",
    type: "Broken Street Light",
    icon: "💡",
    zone: "Zone 5 · Avenue 9",
    priority: "LOW",
    status: "Pending",
    time: "2 hours ago",
    dept: "Electrical Works",
    note: "Lamp cluster reporting zero draw since 21:10.",
  },
  {
    id: "#EC10264",
    type: "Air Pollution Complaint",
    icon: "🌫",
    zone: "Zone 4 · Civic Centre",
    priority: "HIGH",
    status: "In Progress",
    time: "3 hours ago",
    ai: true,
    dept: "Pollution Control",
    note: "Correlated with AQ-07 hotspot reading of 168 AQI.",
  },
  {
    id: "#EC10259",
    type: "Illegal Dumping",
    icon: "🚧",
    zone: "Zone 3 · Canal Bank",
    priority: "MEDIUM",
    status: "Resolved",
    time: "Yesterday",
    dept: "Sanitation",
    note: "Cleared by crew 12; site now under camera watch.",
  },
  {
    id: "#EC10251",
    type: "Traffic Signal Fault",
    icon: "🚦",
    zone: "Zone 4 · Ring Road",
    priority: "HIGH",
    status: "Resolved",
    time: "Yesterday",
    dept: "Traffic Police",
    note: "Controller replaced; adaptive mode restored.",
  },
];

export const CHAT_SUGGESTIONS = [
  "Why is Zone 4 high priority?",
  "How can we reduce energy consumption?",
  "Which bins need collection?",
  "What is affecting our sustainability score?",
];

export const CHAT_ANSWERS: { match: string[]; answer: string; bullets?: string[] }[] = [
  {
    match: ["zone 4", "priority", "hotspot", "why"],
    answer:
      "Zone 4 is flagged high priority because three stress signals are overlapping in the same 1.4 km radius right now.",
    bullets: [
      "Junction #18 congestion at 91% with 9 km/h average speed",
      "Station AQ-07 reading 168 AQI (Unhealthy) with PM2.5 at 98 µg/m³",
      "Green coverage of only 12%, driving a +4.1 °C heat island",
      "Bin #024 at 91% fill, adding localised odour complaints",
    ],
  },
  {
    match: ["energy", "electricity", "power", "consumption"],
    answer:
      "The largest simulated savings come from adaptive street lighting and load shifting at EV hubs.",
    bullets: [
      "Adaptive dimming across 4,820 lamps → 32% lighting load reduction",
      "Shift 18% of EV charging to 01:00–05:00 off-peak window",
      "Rooftop solar on 14 municipal buildings → 6.2 MW added capacity",
      "Projected monthly saving: ₹1.84L at current simulated tariffs",
    ],
  },
  {
    match: ["bin", "waste", "collection", "garbage"],
    answer: "Four bins cross the 80% dispatch threshold within the next 3 hours.",
    bullets: [
      "BIN-024 · Central Market · 91% · full in ~2 hours",
      "BIN-212 · Civic Centre · 84% · full in ~3 hours",
      "BIN-108 · Harbour Road · 67% · full in ~6 hours",
      "Optimised route saves 11.4 km and 1 vehicle trip",
    ],
  },
  {
    match: ["sustainability score", "score", "affecting"],
    answer:
      "Your score of 78/100 is held back mainly by transport and water sub-indices.",
    bullets: [
      "Transport 64 — private vehicle share is 61%",
      "Water 71 — 2 suspected leaks and 13% non-revenue water",
      "Air Quality 73 — Zone 4 hotspot pulls the city average down",
      "Strongest pillars: Waste 89 and Energy 84",
    ],
  },
  {
    match: ["traffic", "congestion", "road"],
    answer: "City-wide congestion is at 68%, concentrated on the Ring Road corridor.",
    bullets: [
      "Junction #18 is the critical bottleneck (91%)",
      "Route B diversion relieves an estimated 21% of through-traffic",
      "+15% bus frequency shifts an estimated 6% of trips off private cars",
    ],
  },
  {
    match: ["water", "leak"],
    answer: "Two leak candidates are active in the simulated network.",
    bullets: [
      "WTR-12 · Zone 4 South Grid · +23% above baseline · 82% confidence",
      "Segment B-07 · Zone 2 · minor night-flow anomaly · 48% confidence",
      "Potential recovery: 48,000 L/day if the Zone 4 segment is repaired",
    ],
  },
];

export const CHAT_FALLBACK = {
  answer:
    "I run on a simulated city dataset for this prototype, so I can reason over traffic, air quality, waste, water, energy, greenery and the sustainability score.",
  bullets: [
    "Try: “Why is Zone 4 high priority?”",
    "Try: “How can we reduce energy consumption?”",
    "Try: “Which bins need collection?”",
  ],
};
