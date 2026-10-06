import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  Crosshair,
  Layers,
  Maximize2,
  Navigation,
  X,
  Zap,
} from "lucide-react";
import {
  CATEGORY_META,
  CITY_MARKERS,
  STATUS_COLOR,
  type CityMarker,
  type MarkerCategory,
} from "../data/city";
import { useCity, type Metrics } from "../store/CityStore";
import { Badge, Button, DemoTag, Panel, StatusDot } from "./ui";
import { cn } from "../utils/cn";

const FILTERS: { id: "all" | MarkerCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "traffic", label: "Traffic" },
  { id: "waste", label: "Waste" },
  { id: "air", label: "Air" },
  { id: "water", label: "Water" },
  { id: "energy", label: "Energy" },
  { id: "ev", label: "EV" },
  { id: "green", label: "Green Zones" },
  { id: "transport", label: "Transport" },
];

/* deterministic pseudo-random */
const rnd = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function MapBase() {
  const blocks = useMemo(() => {
    const out: { x: number; y: number; w: number; h: number; o: number }[] = [];
    let i = 0;
    for (let gx = 0; gx < 11; gx++) {
      for (let gy = 0; gy < 7; gy++) {
        i++;
        const bx = 40 + gx * 82 + rnd(i) * 10;
        const by = 30 + gy * 80 + rnd(i, 2) * 10;
        if (bx > 820 && by > 300) continue; // bay area
        if (bx > 880) continue;
        out.push({
          x: bx,
          y: by,
          w: 34 + rnd(i, 3) * 30,
          h: 26 + rnd(i, 4) * 26,
          o: 0.05 + rnd(i, 5) * 0.09,
        });
      }
    }
    return out;
  }, []);

  const hRoads = [78, 170, 262, 354, 446, 538];
  const vRoads = [110, 215, 320, 425, 530, 635, 740];

  return (
    <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bay" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c3b49" />
          <stop offset="100%" stopColor="#06202a" />
        </linearGradient>
        <radialGradient id="glowGreen" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowRed" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* base */}
      <rect width="1000" height="620" fill="#080b10" />

      {/* bay / coastline */}
      <path
        d="M1000,250 C930,300 900,360 890,430 C882,500 900,560 940,620 L1000,620 Z"
        fill="url(#bay)"
      />
      <path
        d="M1000,250 C930,300 900,360 890,430 C882,500 900,560 940,620"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.35"
        strokeWidth="1.6"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${960 - i * 18},${300 + i * 60} q 20 30 -4 60`}
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      ))}

      {/* river */}
      <path
        d="M120,0 C150,120 110,200 170,300 C220,390 200,470 250,620"
        fill="none"
        stroke="#0e7490"
        strokeOpacity="0.45"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* green zones */}
      <g>
        <ellipse cx="180" cy="120" rx="95" ry="62" fill="#10b981" fillOpacity="0.12" />
        <ellipse cx="180" cy="120" rx="95" ry="62" fill="none" stroke="#34d399" strokeOpacity="0.3" strokeDasharray="4 5" />
        <ellipse cx="500" cy="430" rx="62" ry="40" fill="#10b981" fillOpacity="0.07" />
        <ellipse cx="760" cy="150" rx="70" ry="44" fill="#10b981" fillOpacity="0.1" />
      </g>

      {/* city blocks */}
      <g>
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="3"
            fill="#ffffff"
            fillOpacity={b.o}
            stroke="#ffffff"
            strokeOpacity={b.o * 0.9}
          />
        ))}
      </g>

      {/* roads */}
      <g stroke="#94a3b8" strokeOpacity="0.16" strokeWidth="2.4" strokeLinecap="round">
        {hRoads.map((y) => (
          <line key={`h${y}`} x1="20" y1={y} x2={y > 300 ? 880 : 960} y2={y} />
        ))}
        {vRoads.map((x) => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="600" />
        ))}
      </g>

      {/* arterial + ring road */}
      <g>
        <path
          d="M20,354 L880,354"
          stroke="#e2e8f0"
          strokeOpacity="0.22"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="500"
          cy="330"
          rx="330"
          ry="220"
          fill="none"
          stroke="#e2e8f0"
          strokeOpacity="0.18"
          strokeWidth="4"
        />
        {/* animated traffic flow */}
        <ellipse
          cx="500"
          cy="330"
          rx="330"
          ry="220"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="10 40"
          className="animate-dash"
        />
        <path
          d="M20,354 L880,354"
          stroke="#34d399"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="12 46"
          className="animate-dash"
        />
      </g>

      {/* hotspot glows */}
      <circle cx="530" cy="300" r="130" fill="url(#glowRed)" />
      <circle cx="180" cy="120" r="120" fill="url(#glowGreen)" />

      {/* zone labels */}
      {[
        ["ZONE 1", 110, 60],
        ["ZONE 2", 300, 180],
        ["ZONE 3", 420, 250],
        ["ZONE 4", 540, 360],
        ["ZONE 5", 690, 230],
        ["ZONE 6", 760, 110],
        ["ZONE 7", 790, 500],
      ].map(([t, x, y]) => (
        <text
          key={t as string}
          x={x as number}
          y={y as number}
          fill="#64748b"
          fontSize="11"
          letterSpacing="2"
          fontFamily="JetBrains Mono, monospace"
        >
          {t}
        </text>
      ))}
    </svg>
  );
}

const ACTION_EFFECT: Record<MarkerCategory, Partial<Metrics>> = {
  waste: { wasteEff: 3, binsToCollect: -6, binFill: -48, sustainability: 0.7 },
  energy: { energyEff: 3, energyUsage: -7, sustainability: 0.6 },
  air: { aqi: -5, zone4Aqi: -16, sustainability: 0.8, co2: 0.6 },
  water: { waterEff: 3.5, waterUse: -0.07, sustainability: 0.6 },
  traffic: { traffic: -8, zone4Traffic: -12, aqi: -4, sustainability: 0.9 },
  ev: { energyUsage: -4, co2: 0.5, sustainability: 0.5 },
  green: { sustainability: 1.1, aqi: -3, co2: 0.8 },
  transport: { traffic: -6, zone4Traffic: -8, sustainability: 0.8 },
};

function MarkerPopup({ m, onClose }: { m: CityMarker; onClose: () => void }) {
  const { applyAction, applied, go, pushToast } = useCity();
  const s = STATUS_COLOR[m.status];
  const meta = CATEGORY_META[m.category];
  const actionId = `node-${m.id}`;
  const done = applied.some((a) => a.id === actionId);
  const noAction = m.action.toLowerCase().startsWith("no action");
  const flipX = m.x > 58;
  const flipY = m.y > 55;
  return (
    <div
      className="absolute z-30 w-[260px] animate-scale-in sm:w-[286px]"
      style={{
        left: `${m.x}%`,
        top: `${m.y}%`,
        transform: `translate(${flipX ? "calc(-100% - 18px)" : "18px"}, ${flipY ? "calc(-100% + 14px)" : "-14px"})`,
      }}
    >
      <div className="panel overflow-hidden rounded-2xl border-white/10 backdrop-blur-xl">
        <div
          className="flex items-start gap-2.5 border-b border-white/[0.07] px-3.5 py-3"
          style={{ background: `linear-gradient(90deg, ${s.hex}18, transparent)` }}
        >
          <span className="text-lg leading-none">{meta.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold uppercase tracking-wide text-white">
              {m.label}
            </div>
            <div className="truncate text-[11px] text-slate-400">{m.zone}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/[0.05]">
          {m.metrics.map((mt) => (
            <div key={mt.label} className="bg-ink-850 px-3.5 py-2.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{mt.label}</div>
              <div
                className={cn("num mt-0.5 text-[13.5px] font-semibold", mt.accent ? "" : "text-slate-200")}
                style={mt.accent ? { color: s.hex } : undefined}
              >
                {mt.value}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 px-3.5 py-3">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              <Zap className="h-3 w-3" /> AI Prediction
            </div>
            <p className="text-[12px] leading-snug text-slate-300">{m.prediction}</p>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-eco-400">
              Recommended Action
            </div>
            <p className="text-[12px] leading-snug text-slate-300">{m.action}</p>
          </div>
          {m.extra && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-400">
              <Navigation className="h-3 w-3 text-cyan-400" />
              {m.extra}
            </div>
          )}

          <div className="flex gap-2 pt-0.5">
            <Button
              size="sm"
              variant={done ? "outline" : noAction ? "ghost" : "primary"}
              className="flex-1"
              disabled={done}
              onClick={() => {
                if (noAction) {
                  pushToast({
                    kind: "info",
                    title: `${m.id} is healthy`,
                    body: "Node kept under routine monitoring.",
                  });
                  return;
                }
                applyAction({
                  id: actionId,
                  label: `${m.id} · ${m.action}`,
                  effect: ACTION_EFFECT[m.category],
                  toast: m.action,
                });
              }}
            >
              {done ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Dispatched
                </>
              ) : noAction ? (
                "Keep monitoring"
              ) : (
                "Dispatch action"
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => go("advisor")} title="Open AI Advisor">
              <BrainCircuit className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CityMap({ compact = false }: { compact?: boolean }) {
  const { focusMarker, setFocusMarker, metrics } = useCity();
  const [filter, setFilter] = useState<"all" | MarkerCategory>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (focusMarker) {
      setFilter("all");
      setSelected(focusMarker);
    }
  }, [focusMarker]);

  const visible = CITY_MARKERS.filter((m) => filter === "all" || m.category === filter);
  const active = CITY_MARKERS.find((m) => m.id === selected) ?? null;
  const criticals = CITY_MARKERS.filter((m) => m.status === "critical").length;

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-eco-400" />
          <div>
            <div className="text-[13.5px] font-semibold text-white">City Sensor Network</div>
            <div className="text-[11px] text-slate-500">
              {visible.length} nodes shown · {criticals} critical
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="red" icon={<StatusDot color="#f87171" />}>
            LIVE SIMULATION
          </Badge>
          <DemoTag text="Fictional city layout" />
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.07] px-4 py-2.5">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id);
                setSelected(null);
                setFocusMarker(null);
              }}
              className={cn(
                "whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11.5px] font-medium transition-all duration-200",
                on
                  ? "border-eco-500/40 bg-eco-500/15 text-eco-300"
                  : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:text-slate-200",
              )}
            >
              {f.id !== "all" && <span className="mr-1">{CATEGORY_META[f.id as MarkerCategory].icon}</span>}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* map */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-ink-950",
          compact ? "h-[320px] sm:h-[380px]" : "h-[420px] sm:h-[520px] lg:h-[600px]",
        )}
      >
        <MapBase />
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eco-400/40 to-transparent" />

        {/* scanning sweep */}
        <div className="pointer-events-none absolute inset-y-0 w-24 animate-sweep bg-gradient-to-r from-transparent via-cyan-400/[0.045] to-transparent" />

        {visible.map((m) => {
          const s = STATUS_COLOR[m.status];
          const meta = CATEGORY_META[m.category];
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelected(isActive ? null : m.id);
                setFocusMarker(null);
              }}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              aria-label={m.label}
            >
              {(m.status === "critical" || isActive) && (
                <span
                  className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ring"
                  style={{ background: `${s.hex}55` }}
                />
              )}
              <span
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full border text-[12px] transition-all duration-200",
                  isActive ? "scale-125" : "group-hover:scale-115",
                )}
                style={{
                  background: `${s.hex}1f`,
                  borderColor: `${s.hex}99`,
                  boxShadow: isActive ? `0 0 0 3px ${s.hex}25, 0 6px 18px -6px ${s.hex}` : `0 2px 10px -4px ${s.hex}`,
                }}
              >
                {meta.icon}
              </span>
              {hovered === m.id && !isActive && (
                <span className="pointer-events-none absolute left-1/2 top-9 z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-ink-900/95 px-2 py-1 text-[10.5px] text-slate-200 shadow-lg">
                  {m.id} · {s.label}
                </span>
              )}
            </button>
          );
        })}

        {active && <MarkerPopup m={active} onClose={() => setSelected(null)} />}

        {/* legend */}
        <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-white/[0.08] bg-ink-900/85 p-2.5 backdrop-blur-md">
          <div className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {(Object.keys(STATUS_COLOR) as (keyof typeof STATUS_COLOR)[]).map((k) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[k].hex }} />
                <span className="text-[10.5px] text-slate-400">{STATUS_COLOR[k].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* live readout */}
        <div className="absolute right-3 top-3 z-10 hidden rounded-xl border border-white/[0.08] bg-ink-900/85 px-3 py-2 backdrop-blur-md sm:block">
          <div className="mb-1 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Crosshair className="h-3 w-3" /> City Telemetry
          </div>
          {[
            ["AQI", metrics.aqi.toFixed(0), "#22d3ee"],
            ["Congestion", `${metrics.traffic.toFixed(0)}%`, "#fbbf24"],
            ["Grid Load", `${metrics.energyUsage.toFixed(0)} kW`, "#34d399"],
          ].map(([k, v, c]) => (
            <div key={k} className="flex items-center justify-between gap-5 py-0.5">
              <span className="text-[11px] text-slate-400">{k}</span>
              <span className="num text-[11.5px] font-semibold" style={{ color: c as string }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {!active && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 hidden items-center gap-1.5 rounded-lg border border-white/[0.08] bg-ink-900/80 px-2.5 py-1.5 text-[10.5px] text-slate-400 backdrop-blur-md md:flex">
            <Maximize2 className="h-3 w-3" /> Click any node for AI analysis
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-2.5">
        <span className="text-[11px] text-slate-500">
          {filter === "all" ? "Showing all node categories" : `Filtered: ${FILTERS.find((f) => f.id === filter)?.label}`}
          {active ? ` · selected ${active.id}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const crit = CITY_MARKERS.find((m) => m.status === "critical");
              if (crit) {
                setFilter("all");
                setSelected(crit.id);
              }
            }}
          >
            Focus critical node
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={filter === "all" && !selected}
            onClick={() => {
              setFilter("all");
              setSelected(null);
              setFocusMarker(null);
            }}
          >
            Reset view
          </Button>
        </div>
      </div>
    </Panel>
  );
}
