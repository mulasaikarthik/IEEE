import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Fuel, Route, Timer, Trash2, Truck } from "lucide-react";
import { BINS } from "../data/city";
import { useCity } from "../store/CityStore";
import { AnimatedNumber, Badge, Button, DemoTag, MeterBar, Panel, SectionHeader } from "./ui";
import { ChartTooltip } from "./charts";
import { cn } from "../utils/cn";

const DONUT = [
  { name: "Normal", value: 1024, color: "#34d399" },
  { name: "Needs Attention", value: 213, color: "#fbbf24" },
  { name: "Collection Required", value: 47, color: "#f87171" },
];

const STATUS_TONE: Record<string, string> = {
  Critical: "red",
  Attention: "amber",
  Normal: "eco",
};

export default function WastePanel() {
  const { metrics, pushToast, applyAction, go } = useCity();
  const [optimizing, setOptimizing] = useState(false);
  const [route, setRoute] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const optimize = () => {
    setOptimizing(true);
    window.setTimeout(() => {
      setOptimizing(false);
      setRoute(true);
      pushToast({
        kind: "success",
        title: "Route optimised",
        body: "11.4 km and 1 vehicle trip saved on tonight's run.",
      });
    }, 1500);
  };

  const stats = [
    { label: "Total Smart Bins", value: 1284, icon: Trash2, tone: "text-cyan-300", suffix: "" },
    {
      label: "Bins Requiring Collection",
      value: metrics.binsToCollect,
      icon: Truck,
      tone: "text-amber-300",
      suffix: "",
    },
    {
      label: "Collection Efficiency",
      value: metrics.wasteEff,
      icon: Timer,
      tone: "text-eco-300",
      suffix: "%",
    },
    { label: "Estimated Trips Avoided", value: 126, icon: Route, tone: "text-eco-300", suffix: "" },
  ];

  return (
    <Panel className="p-4 sm:p-5">
      <SectionHeader
        eyebrow="Waste"
        title="Smart Waste Intelligence"
        subtitle="Fill-level forecasting across the municipal bin network."
        right={<DemoTag />}
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
          >
            <s.icon className={cn("mb-2 h-4 w-4", s.tone)} />
            <AnimatedNumber
              value={s.value}
              decimals={s.suffix === "%" ? 0 : 0}
              suffix={s.suffix}
              className="text-xl font-semibold text-white"
            />
            <div className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* donut */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Bin status split
          </div>
          <div className="h-[168px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DONUT}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  stroke="none"
                  animationDuration={900}
                >
                  {DONUT.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {DONUT.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11.5px]">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-400">{d.name}</span>
                <span className="num ml-auto font-semibold text-slate-200">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-3 py-2.5 font-semibold">Bin ID</th>
                  <th className="px-3 py-2.5 font-semibold">Location</th>
                  <th className="px-3 py-2.5 font-semibold">Fill Level</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">AI Prediction</th>
                </tr>
              </thead>
              <tbody>
                {BINS.map((b, i) => {
                  const fill = b.id === "BIN-024" ? metrics.binFill : b.fill;
                  return (
                    <tr
                      key={b.id}
                      style={{ animationDelay: `${i * 55}ms` }}
                      className={cn(
                        "animate-fade-up border-t border-white/[0.05] transition-colors duration-200 hover:bg-white/[0.045]",
                        i % 2 ? "bg-white/[0.012]" : "",
                      )}
                    >
                      <td className="num px-3 py-2.5 text-[12px] font-semibold text-white">{b.id}</td>
                      <td className="px-3 py-2.5 text-[12px] text-slate-300">
                        {b.location}
                        <span className="ml-1.5 text-[10.5px] text-slate-600">{b.zone}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="num w-9 text-[12px] font-semibold text-slate-200">
                            {fill.toFixed(0)}%
                          </span>
                          <MeterBar
                            value={fill}
                            color={fill > 80 ? "#f87171" : fill > 55 ? "#fbbf24" : "#34d399"}
                            className="w-16"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
                      </td>
                      <td className="num px-3 py-2.5 text-[12px] text-slate-400">Full in ~{b.eta}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
            <span className="text-[11px] text-slate-500">
              Predictions generated from simulated fill-rate curves.
            </span>
            <Button
              size="sm"
              variant={route ? "ghost" : "primary"}
              onClick={optimize}
              disabled={optimizing}
            >
              <Route className="h-3.5 w-3.5" />
              {optimizing ? "Optimising…" : route ? "Re-optimise route" : "Optimize Collection Route"}
            </Button>
          </div>

          {route && (
            <div className="border-t border-eco-500/25 bg-eco-500/[0.06] px-3.5 py-3 animate-fade-up">
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-eco-300" />
                <span className="text-[13px] font-semibold text-white">
                  Optimised route · Vehicle #07
                </span>
                <Badge tone="eco">AI generated</Badge>
              </div>
              <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-slate-300">
                {["Depot", "BIN-024", "BIN-212", "BIN-108", "BIN-077", "Transfer Stn"].map((n, i, arr) => (
                  <span key={n} className="flex items-center gap-1.5">
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 num">
                      {n}
                    </span>
                    {i < arr.length - 1 && <span className="text-eco-400">→</span>}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Distance", "18.6 km", "was 30.0 km"],
                  ["Time saved", "41 min", "per run"],
                  ["Fuel saved", "4.2 L", "diesel"],
                  ["CO₂ avoided", "11.1 kg", "per run"],
                ].map(([k, v, note]) => (
                  <div key={k} className="rounded-lg border border-white/[0.07] bg-ink-900/60 px-2.5 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
                    <div className="num text-[14px] font-semibold text-eco-300">{v}</div>
                    <div className="text-[10px] text-slate-600">{note}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={dispatched ? "outline" : "primary"}
                  disabled={dispatched}
                  onClick={() => {
                    setDispatched(true);
                    applyAction({
                      id: "waste-route",
                      label: "Dispatch Waste Vehicle #07 on optimised route",
                      effect: { wasteEff: 3.5, binsToCollect: -9, binFill: -52, sustainability: 1, co2: 0.6 },
                      toast: "Vehicle #07 en route · 6 stops · ETA 48 min",
                    });
                  }}
                >
                  <Truck className="h-3.5 w-3.5" />
                  {dispatched ? "Vehicle #07 dispatched" : "Dispatch Vehicle #07"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRoute(false);
                    setDispatched(false);
                  }}
                >
                  Discard route
                </Button>
                <Button size="sm" variant="ghost" onClick={() => go("map")}>
                  <Fuel className="h-3.5 w-3.5" />
                  View stops on map
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
