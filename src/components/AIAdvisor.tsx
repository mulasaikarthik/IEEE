import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  Check,
  ChevronRight,
  Gauge,
  Info,
  Leaf,
  Route,
  Sparkles,
  Thermometer,
  TrendingDown,
  Wind,
} from "lucide-react";
import { useCity, type Metrics } from "../store/CityStore";
import { Badge, Button, DemoTag, MeterBar, Panel, SectionHeader, StatusDot } from "./ui";
import { cn } from "../utils/cn";

interface Rec {
  id: string;
  title: string;
  priority: "Critical" | "High" | "Medium";
  impact: string;
  confidence: number;
  detail: string;
  effect: Partial<Metrics>;
}

const RECS: Rec[] = [
  {
    id: "transit",
    title: "Increase public transport frequency by 15%",
    priority: "Critical",
    impact: "−9% private vehicle trips on corridor 4",
    confidence: 92,
    detail:
      "Corridors 4 and 9 have 78% bus occupancy at a 7-minute headway. Adding 9 buses shifts an estimated 6% of car trips.",
    effect: { traffic: -7, zone4Traffic: -11, aqi: -5, sustainability: 2.1, co2: 1.8 },
  },
  {
    id: "reroute",
    title: "Divert traffic through alternate Route B",
    priority: "Critical",
    impact: "−21% queue length at Junction #18",
    confidence: 88,
    detail:
      "Route B currently runs at 38% capacity. Adaptive signal re-timing can absorb 1,400 vehicles/hour from the Ring Road cross.",
    effect: { traffic: -9, zone4Traffic: -14, aqi: -6, zone4Aqi: -22, sustainability: 1.6 },
  },
  {
    id: "green",
    title: "Prioritise tree / green coverage in Zone 4",
    priority: "High",
    impact: "−2.1 °C heat island over 18 months",
    confidence: 76,
    detail:
      "Zone 4 canopy cover is 12% against a city average of 34%. Planting 1,200 native saplings is the highest long-term lever.",
    effect: { sustainability: 2.4, aqi: -3, co2: 2.2, zone4Aqi: -12 },
  },
  {
    id: "monitor",
    title: "Increase environmental monitoring for the next 2 hours",
    priority: "Medium",
    impact: "Sampling interval 15 min → 3 min",
    confidence: 95,
    detail:
      "Higher-resolution sampling validates the intervention and feeds the model with post-action ground truth.",
    effect: { sustainability: 0.6, zone4Aqi: -6 },
  },
];

const PRIO: Record<string, string> = {
  Critical: "red",
  High: "amber",
  Medium: "cyan",
};

export default function AIAdvisor({ variant = "card" }: { variant?: "card" | "page" }) {
  const { metrics, applied, applyAction, go, demoRunning, demoStep } = useCity();
  const [thinking, setThinking] = useState(false);
  const [analysed, setAnalysed] = useState(true);

  useEffect(() => {
    if (demoRunning && demoStep === 4) {
      setAnalysed(false);
      setThinking(true);
      const h = window.setTimeout(() => {
        setThinking(false);
        setAnalysed(true);
      }, 2600);
      return () => window.clearTimeout(h);
    }
  }, [demoRunning, demoStep]);

  const rerun = () => {
    setThinking(true);
    setAnalysed(false);
    window.setTimeout(() => {
      setThinking(false);
      setAnalysed(true);
    }, 1800);
  };

  const appliedCount = applied.length;
  const signals = [
    {
      icon: Activity,
      label: "Traffic",
      value: `${metrics.zone4Traffic.toFixed(0)}% congestion`,
      tone: metrics.zone4Traffic > 80 ? "red" : metrics.zone4Traffic > 65 ? "amber" : "eco",
      bar: metrics.zone4Traffic,
    },
    {
      icon: Wind,
      label: "Air Quality",
      value: `${metrics.zone4Aqi.toFixed(0)} AQI`,
      tone: metrics.zone4Aqi > 150 ? "red" : metrics.zone4Aqi > 100 ? "amber" : "eco",
      bar: Math.min(100, (metrics.zone4Aqi / 250) * 100),
    },
    { icon: Thermometer, label: "Temperature", value: "39 °C", tone: "amber", bar: 78 },
    { icon: Leaf, label: "Green Coverage", value: "Low · 12%", tone: "red", bar: 12 },
  ];

  return (
    <Panel className="overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] bg-gradient-to-r from-eco-500/[0.07] via-transparent to-transparent px-4 py-3.5 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-eco-500/30 bg-eco-500/10">
            <BrainCircuit className="h-5 w-5 text-eco-300" />
            <span className="absolute -right-0.5 -top-0.5">
              <StatusDot />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-white">🤖 AI City Advisor</h3>
              <Badge tone="eco">v2.4 · Urban LLM</Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Turning city data into actionable decisions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DemoTag text="Simulated inference" />
          <Button size="sm" variant="ghost" onClick={rerun} disabled={thinking}>
            <Sparkles className="h-3.5 w-3.5" />
            Re-run analysis
          </Button>
        </div>
      </div>

      {thinking && (
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4 animate-fade-in">
          <div className="flex items-end gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="dot-think h-1.5 w-1.5 rounded-full bg-eco-400"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-[13px] text-slate-300">
            Correlating 4 live signals across Zone 4 · scanning 18 months of simulated history…
          </span>
        </div>
      )}

      {analysed && (
        <div className="animate-fade-in">
          {/* situation */}
          <div className="border-b border-white/[0.07] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="red" icon={<StatusDot color="#f87171" />}>
                Priority Alert
              </Badge>
              <h4 className="text-[15px] font-semibold text-white sm:text-base">
                Zone 4 requires immediate attention.
              </h4>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {signals.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
                >
                  <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-slate-500">
                    <s.icon className="h-3 w-3" />
                    {s.label}
                  </div>
                  <div
                    className={cn(
                      "num mt-1 text-[15px] font-semibold",
                      s.tone === "red" ? "text-red-300" : s.tone === "amber" ? "text-amber-300" : "text-eco-300",
                    )}
                  >
                    {s.value}
                  </div>
                  <MeterBar
                    value={s.bar}
                    color={s.tone === "red" ? "#f87171" : s.tone === "amber" ? "#fbbf24" : "#34d399"}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* why */}
          <div className="border-b border-white/[0.07] px-4 py-4 sm:px-5">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-3.5">
              <div className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold text-cyan-300">
                <Info className="h-3.5 w-3.5" />
                Why is AI recommending this?
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-300">
                Traffic congestion and poor air quality are occurring simultaneously in Zone 4. Historical
                simulated patterns indicate that reducing vehicle concentration and increasing public
                transport availability can lower congestion and emissions. Low green coverage (12%) amplifies
                the heat island effect, which further concentrates pollutants at street level.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["Junction #18 feed", "Station AQ-07", "Transit Hub #21", "18-month pattern library"].map(
                  (src) => (
                    <span
                      key={src}
                      className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-slate-400"
                    >
                      {src}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* recommendations */}
          <div className="px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-[13px] font-semibold uppercase tracking-wider text-slate-300">
                AI Recommended Actions
              </h5>
              <span className="text-[11px] text-slate-500">
                {appliedCount}/{RECS.length} applied
              </span>
            </div>

            <div className="space-y-2.5">
              {RECS.map((r, i) => {
                const done = applied.some((a) => a.id === r.id);
                return (
                  <div
                    key={r.id}
                    className={cn(
                      "group rounded-xl border p-3.5 transition-all duration-300",
                      done
                        ? "border-eco-500/30 bg-eco-500/[0.07]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15",
                    )}
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <span
                        className={cn(
                          "num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                          done ? "bg-eco-500 text-ink-950" : "bg-white/[0.06] text-slate-400",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13.5px] font-medium text-white">{r.title}</span>
                          <Badge tone={PRIO[r.priority]}>{r.priority}</Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-eco-400" />
                            {r.impact}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Gauge className="h-3 w-3 text-cyan-400" />
                            Confidence {r.confidence}%
                          </span>
                        </div>
                        {variant === "page" && (
                          <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{r.detail}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={done ? "outline" : "primary"}
                        disabled={done}
                        onClick={() =>
                          applyAction({
                            id: r.id,
                            label: r.title,
                            effect: r.effect,
                            toast: r.impact,
                          })
                        }
                      >
                        {done ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Applied
                          </>
                        ) : (
                          <>Apply Simulation</>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {variant === "card" && (
              <button
                onClick={() => go("advisor")}
                className="mt-3.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-eco-300 transition-colors hover:text-eco-200"
              >
                Open full advisor workspace
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

export function AdvisorPage() {
  const { applied, resetCity, metrics } = useCity();
  const projected = [
    { label: "CO₂ emissions", base: 100, now: Math.max(60, 100 - applied.length * 4.2) },
    { label: "Traffic congestion", base: 100, now: Math.max(55, (metrics.traffic / 68) * 100) },
    { label: "Energy consumption", base: 100, now: Math.max(55, (metrics.energyUsage / 68) * 100) },
  ];
  return (
    <div className="space-y-5">
      <AIAdvisor variant="page" />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel className="p-5">
          <SectionHeader
            eyebrow="Decision ledger"
            title="Applied interventions"
            subtitle="Every action is logged with its simulated impact for post-review."
            right={
              <Button size="sm" variant="ghost" onClick={resetCity}>
                Reset city state
              </Button>
            }
          />
          {applied.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
              <Route className="mx-auto mb-2 h-6 w-6 text-slate-600" />
              <p className="text-sm text-slate-400">No interventions applied yet.</p>
              <p className="mt-1 text-xs text-slate-600">
                Apply a recommendation above to see simulated city-wide impact.
              </p>
            </div>
          ) : (
            <ol className="relative space-y-3 border-l border-white/[0.08] pl-5">
              {applied.map((a, i) => (
                <li key={a.id} className="relative animate-fade-up">
                  <span className="absolute -left-[26px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-eco-500/40 bg-ink-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-eco-400" />
                  </span>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5">
                    <div className="text-[13px] font-medium text-white">{a.label}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      Dispatched · simulated T+{(i + 1) * 4} min · status Active
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel className="p-5">
          <SectionHeader eyebrow="Projection" title="Versus baseline city" />
          <div className="space-y-4">
            {projected.map((p) => {
              const delta = Math.round(p.base - p.now);
              return (
                <div key={p.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="text-slate-300">{p.label}</span>
                    <span className={cn("num font-semibold", delta > 0 ? "text-eco-300" : "text-slate-400")}>
                      {delta > 0 ? `↓ ${delta}%` : "—"}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="absolute inset-y-0 left-0 w-full rounded-full bg-white/[0.08]" />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-eco-500 to-cyan-400 transition-[width] duration-700"
                      style={{ width: `${p.now}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-[12px] leading-relaxed text-slate-400">
            Projections are generated from a simulated city model built for this prototype. They are
            directional estimates, not municipal guarantees.
          </div>
        </Panel>
      </div>
    </div>
  );
}
