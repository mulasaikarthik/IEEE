import { useMemo, useState } from "react";
import { Bus, CarFront, Lightbulb, RotateCcw, Sparkles, Sun, TreePine } from "lucide-react";
import { AnimatedNumber, Badge, Button, DemoTag, Panel, SectionHeader } from "./ui";
import { useCity } from "../store/CityStore";
import { cn } from "../utils/cn";

interface Lever {
  id: "ev" | "solar" | "green" | "transit" | "light";
  label: string;
  min: number;
  max: number;
  unit: string;
  icon: typeof Sun;
  color: string;
}

const LEVERS: Lever[] = [
  { id: "ev", label: "EV Adoption", min: 20, max: 80, unit: "%", icon: CarFront, color: "#34d399" },
  { id: "solar", label: "Solar Capacity", min: 10, max: 50, unit: " MW", icon: Sun, color: "#fbbf24" },
  { id: "green", label: "Green Coverage", min: 20, max: 60, unit: "%", icon: TreePine, color: "#4ade80" },
  { id: "transit", label: "Public Transport Usage", min: 30, max: 90, unit: "%", icon: Bus, color: "#22d3ee" },
  { id: "light", label: "Smart Lighting Coverage", min: 20, max: 100, unit: "%", icon: Lightbulb, color: "#a78bfa" },
];

type Values = Record<Lever["id"], number>;
const BASE_VALUES: Values = { ev: 20, solar: 10, green: 20, transit: 30, light: 20 };

const PRESETS: { id: string; label: string; note: string; values: Values }[] = [
  { id: "baseline", label: "Baseline", note: "Today", values: BASE_VALUES },
  {
    id: "balanced",
    label: "Balanced 2030",
    note: "Funded plan",
    values: { ev: 45, solar: 26, green: 36, transit: 58, light: 65 },
  },
  {
    id: "ambitious",
    label: "Ambitious 2032",
    note: "Stretch target",
    values: { ev: 70, solar: 42, green: 52, transit: 80, light: 92 },
  },
  {
    id: "max",
    label: "Net-Zero Max",
    note: "All levers full",
    values: { ev: 80, solar: 50, green: 60, transit: 90, light: 100 },
  },
];

function FutureCity({ t }: { t: { ev: number; solar: number; green: number; transit: number; light: number } }) {
  const trees = Math.round(3 + t.green * 11);
  const panels = Math.round(t.solar * 9);
  const lampGlow = 0.12 + t.light * 0.55;
  const skyTop = `rgba(${Math.round(34 - t.green * 10)}, ${Math.round(42 + t.green * 24)}, ${Math.round(54 + t.green * 20)}, 1)`;
  const haze = 0.42 * (1 - (t.ev * 0.4 + t.transit * 0.35 + t.green * 0.25));

  const buildings = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const r = Math.abs(Math.sin(i * 91.7) * 1000) % 1;
        return { x: 20 + i * 48, w: 30 + r * 12, h: 60 + r * 120 };
      }),
    [],
  );

  return (
    <div className="relative h-[250px] w-full overflow-hidden rounded-xl border border-white/[0.07] sm:h-[290px]">
      <svg viewBox="0 0 720 300" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor="#090d12" />
          </linearGradient>
          <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b222e" />
            <stop offset="100%" stopColor="#0c1017" />
          </linearGradient>
        </defs>
        <rect width="720" height="300" fill="url(#sky)" />

        {/* smog haze */}
        <rect width="720" height="300" fill="#b45309" opacity={Math.max(0, haze)} />

        {/* stars appear as air clears */}
        {Array.from({ length: 26 }).map((_, i) => {
          const r = Math.abs(Math.sin(i * 42.3) * 100) % 1;
          return (
            <circle
              key={i}
              cx={(i * 53) % 720}
              cy={12 + r * 90}
              r={0.9 + r}
              fill="#e2e8f0"
              opacity={Math.max(0, 0.75 - haze * 2) * (0.4 + r * 0.6)}
            />
          );
        })}

        {/* buildings */}
        {buildings.map((b, i) => {
          const y = 250 - b.h;
          const hasPanel = i * 1.4 < panels / 3.2;
          return (
            <g key={i}>
              <rect x={b.x} y={y} width={b.w} height={b.h} rx="2" fill="url(#bld)" stroke="#263142" strokeWidth="0.8" />
              {/* windows */}
              {Array.from({ length: Math.floor(b.h / 18) }).map((_, wy) =>
                Array.from({ length: 2 }).map((__, wx) => (
                  <rect
                    key={`${wy}-${wx}`}
                    x={b.x + 6 + wx * (b.w / 2 - 1)}
                    y={y + 8 + wy * 18}
                    width="7"
                    height="7"
                    rx="1"
                    fill="#fbbf24"
                    opacity={((i + wy + wx) % 3 === 0 ? 0.55 : 0.18) * (1.1 - t.light * 0.35)}
                  />
                )),
              )}
              {hasPanel && (
                <g>
                  <rect x={b.x + 3} y={y - 5} width={b.w - 6} height="4" rx="1" fill="#0ea5e9" opacity="0.8" />
                  <rect x={b.x + 3} y={y - 5} width={b.w - 6} height="4" rx="1" fill="#22d3ee" opacity="0.35" />
                </g>
              )}
              {/* rooftop garden */}
              {t.green > 0.55 && i % 3 === 0 && (
                <rect x={b.x + 2} y={y - 3} width={b.w - 4} height="3" rx="1.5" fill="#34d399" opacity="0.75" />
              )}
            </g>
          );
        })}

        {/* ground */}
        <rect x="0" y="250" width="720" height="50" fill="#0a0e14" />
        <line x1="0" y1="252" x2="720" y2="252" stroke="#1e293b" strokeWidth="2" />
        <line
          x1="0"
          y1="268"
          x2="720"
          y2="268"
          stroke="#22d3ee"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="14 22"
          className="animate-dash"
        />

        {/* trees */}
        {Array.from({ length: trees }).map((_, i) => {
          const x = 14 + ((i * 47) % 700);
          const s = 0.8 + ((i * 13) % 5) / 10;
          return (
            <g key={i} transform={`translate(${x},248) scale(${s})`} opacity="0.95">
              <rect x="-1" y="-6" width="2" height="6" fill="#3f3f46" />
              <circle cx="0" cy="-10" r="6" fill="#16a34a" opacity="0.85" />
              <circle cx="-2.5" cy="-13" r="4" fill="#22c55e" opacity="0.8" />
            </g>
          );
        })}

        {/* street lamps */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 40 + i * 80;
          return (
            <g key={i}>
              <rect x={x} y="226" width="1.6" height="24" fill="#334155" />
              <circle cx={x + 0.8} cy="225" r="2.6" fill="#fde68a" opacity={lampGlow} />
              <circle cx={x + 0.8} cy="225" r="9" fill="#fbbf24" opacity={lampGlow * 0.16} />
            </g>
          );
        })}

        {/* vehicles */}
        {Array.from({ length: 7 }).map((_, i) => {
          const isEv = i / 7 < t.ev;
          const x = 30 + i * 96;
          return (
            <g key={i} transform={`translate(${x},272)`}>
              <rect x="0" y="-6" width="20" height="6" rx="2" fill={isEv ? "#34d399" : "#64748b"} opacity="0.9" />
              <rect x="4" y="-9" width="11" height="4" rx="1.5" fill={isEv ? "#6ee7b7" : "#94a3b8"} opacity="0.8" />
              {isEv && <circle cx="22" cy="-4" r="1.6" fill="#34d399" />}
            </g>
          );
        })}

        {/* buses scale with transit */}
        {Array.from({ length: Math.max(1, Math.round(t.transit * 4)) }).map((_, i) => (
          <g key={i} transform={`translate(${120 + i * 170},288)`}>
            <rect x="0" y="-11" width="40" height="11" rx="2.5" fill="#22d3ee" opacity="0.85" />
            {[0, 1, 2, 3].map((w) => (
              <rect key={w} x={4 + w * 9} y="-8.5" width="6" height="5" rx="1" fill="#0b1118" opacity="0.7" />
            ))}
          </g>
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2">
        <Badge tone="eco">Projected city · {new Date().getFullYear() + 6}</Badge>
        <DemoTag text="Illustrative" />
      </div>
    </div>
  );
}

export default function FutureSimulator() {
  const { metrics, pushToast, applyAction, go } = useCity();
  const [values, setValues] = useState<Values>(BASE_VALUES);
  const [preset, setPreset] = useState("baseline");
  const [committed, setCommitted] = useState(false);

  const t = useMemo(() => {
    const n = (l: Lever) => (values[l.id] - l.min) / (l.max - l.min);
    return {
      ev: n(LEVERS[0]),
      solar: n(LEVERS[1]),
      green: n(LEVERS[2]),
      transit: n(LEVERS[3]),
      light: n(LEVERS[4]),
    };
  }, [values]);

  const out = useMemo(() => {
    const co2 = t.ev * 22 + t.solar * 14 + t.green * 10 + t.transit * 18 + t.light * 4;
    const energy = t.solar * 24 + t.light * 20 + t.transit * 6;
    const traffic = t.transit * 28 + t.ev * 6 + t.green * 2;
    const water = t.green * 14;
    const score = Math.min(
      98,
      78 + t.ev * 4.4 + t.solar * 4.2 + t.green * 4.4 + t.transit * 4.2 + t.light * 2.8,
    );
    return { co2, energy, traffic, water, score };
  }, [t]);

  const changed = (Object.keys(values) as Lever["id"][]).some((k) => values[k] !== BASE_VALUES[k]);

  const rows = [
    { label: "CO₂ Emissions", delta: out.co2, color: "#34d399" },
    { label: "Energy Consumption", delta: out.energy, color: "#fbbf24" },
    { label: "Traffic Congestion", delta: out.traffic, color: "#22d3ee" },
  ];

  return (
    <div className="space-y-5">
      <Panel className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-eco-500/[0.08] blur-3xl" />
        <SectionHeader
          eyebrow="Decision support"
          title="Future City Simulator"
          subtitle="Explore how today's decisions could shape tomorrow's city."
          right={
            <div className="flex items-center gap-2">
              <DemoTag text="Model: simulated" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setValues(BASE_VALUES);
                  setPreset("baseline");
                  setCommitted(false);
                  pushToast({ kind: "info", title: "Simulation reset", body: "All levers back to baseline." });
                }}
                disabled={!changed}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Simulation
              </Button>
            </div>
          }
        />

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setValues(p.values);
                setPreset(p.id);
                setCommitted(false);
              }}
              className={cn(
                "rounded-xl border px-3 py-2 text-left transition-all duration-200",
                preset === p.id
                  ? "border-eco-500/40 bg-eco-500/12"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/15",
              )}
            >
              <div
                className={cn(
                  "text-[12.5px] font-medium",
                  preset === p.id ? "text-eco-300" : "text-slate-200",
                )}
              >
                {p.label}
              </div>
              <div className="text-[10.5px] text-slate-500">{p.note}</div>
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* levers */}
          <div className="space-y-3.5">
            {LEVERS.map((l) => {
              const pct = ((values[l.id] - l.min) / (l.max - l.min)) * 100;
              return (
                <div
                  key={l.id}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition-colors hover:border-white/15"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <l.icon className="h-4 w-4" style={{ color: l.color }} />
                      <span className="text-[13px] font-medium text-slate-200">{l.label}</span>
                    </div>
                    <span className="num text-[13px] font-semibold text-white">
                      {values[l.id]}
                      {l.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={l.min}
                    max={l.max}
                    value={values[l.id]}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, [l.id]: Number(e.target.value) }));
                      setPreset("custom");
                      setCommitted(false);
                    }}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none
                      [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink-900
                      [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink-900 [&::-moz-range-thumb]:bg-white"
                    style={{
                      background: `linear-gradient(90deg, ${l.color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
                    }}
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                    <span>
                      {l.min}
                      {l.unit}
                    </span>
                    <span>
                      {l.max}
                      {l.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* outcomes */}
          <div className="space-y-4">
            <FutureCity t={t} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Current City
                </div>
                {rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-1">
                    <span className="text-[12px] text-slate-400">{r.label}</span>
                    <span className="num text-[12.5px] font-semibold text-slate-300">100%</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-white/[0.07] pt-2">
                  <span className="text-[12px] text-slate-400">Sustainability</span>
                  <span className="num text-[13px] font-semibold text-slate-300">78</span>
                </div>
              </div>

              <div className="rounded-xl border border-eco-500/25 bg-eco-500/[0.06] p-3.5">
                <div className="mb-2.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-eco-400">
                  <Sparkles className="h-3 w-3" />
                  After Simulation
                </div>
                {rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-1">
                    <span className="text-[12px] text-slate-400">{r.label}</span>
                    <span className="num text-[12.5px] font-semibold" style={{ color: r.color }}>
                      ↓ <AnimatedNumber value={r.delta} decimals={0} suffix="%" />
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-eco-500/20 pt-2">
                  <span className="text-[12px] text-slate-400">Sustainability</span>
                  <span className="num text-[13px] font-semibold text-eco-300">
                    78 → <AnimatedNumber value={out.score} decimals={0} />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Water efficiency", `+${out.water.toFixed(0)}%`, "#22d3ee"],
                ["Green jobs", `${Math.round(900 + t.solar * 2400 + t.green * 1500)}`, "#34d399"],
                ["Annual saving", `₹${(2.1 + t.solar * 9 + t.light * 4).toFixed(1)} Cr`, "#fbbf24"],
                ["Payback", `${(9 - t.solar * 3.4).toFixed(1)} yrs`, "#a78bfa"],
              ].map(([k, v, c]) => (
                <div key={k} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                  <div className="num text-[15px] font-semibold" style={{ color: c }}>
                    {v}
                  </div>
                  <div className="text-[10.5px] leading-tight text-slate-500">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10">
            <Sparkles className="h-4.5 w-4.5 text-cyan-300" />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold text-white">
              Scenario verdict ·{" "}
              <span className={cn(out.score > 90 ? "text-eco-300" : "text-amber-300")}>
                {out.score > 92
                  ? "Transformational"
                  : out.score > 85
                    ? "Strong"
                    : out.score > 80
                      ? "Moderate"
                      : "Incremental"}
              </span>
            </div>
            <div className="text-[11.5px] text-slate-500">
              Current live score {metrics.sustainability.toFixed(0)} · scenario projects{" "}
              {out.score.toFixed(0)} by 2032 under simulated assumptions.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={committed ? "outline" : "primary"}
            size="sm"
            disabled={!changed || committed}
            onClick={() => {
              applyAction({
                id: `scenario-${Date.now()}`,
                label: `Scenario adopted · EV ${values.ev}% · Solar ${values.solar} MW · Green ${values.green}% · Transit ${values.transit}% · Lighting ${values.light}%`,
                effect: {
                  sustainability: Math.max(0, out.score - metrics.sustainability) * 0.45,
                  traffic: -out.traffic * 0.25,
                  energyUsage: -out.energy * 0.22,
                  aqi: -out.co2 * 0.18,
                  co2: out.co2 * 0.1,
                  waterEff: out.water * 0.2,
                },
                toast: `Projected score ${out.score.toFixed(0)} fed into the live city model.`,
              });
              setCommitted(true);
            }}
          >
            {committed ? "Scenario adopted" : "Adopt scenario in city plan"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => go("sustainability")}>
            View impact on index
          </Button>
          <DemoTag text="Prototype · Simulated City Data" />
        </div>
      </Panel>
    </div>
  );
}
