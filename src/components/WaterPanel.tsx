import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Droplets, GaugeCircle, Search, Waves, Wrench } from "lucide-react";
import { WATER_FLOW } from "../data/city";
import { useCity } from "../store/CityStore";
import {
  AnimatedNumber,
  Badge,
  Button,
  DemoTag,
  MeterBar,
  Modal,
  Panel,
  SectionHeader,
} from "./ui";
import { ChartTooltip, axisProps } from "./charts";

export default function WaterPanel() {
  const { metrics, pushToast, applyAction } = useCity();
  const [open, setOpen] = useState(false);

  const stats = [
    {
      label: "Water Consumption",
      value: metrics.waterUse,
      suffix: "M L/day",
      d: 2,
      icon: Droplets,
      color: "text-cyan-300",
    },
    {
      label: "Water Efficiency",
      value: metrics.waterEff,
      suffix: "%",
      d: 0,
      icon: GaugeCircle,
      color: "text-eco-300",
    },
    { label: "Leak Detection", value: 2, suffix: " suspected", d: 0, icon: AlertTriangle, color: "text-amber-300" },
    { label: "Tank Level", value: metrics.tankLevel, suffix: "%", d: 0, icon: Waves, color: "text-cyan-300" },
  ];

  return (
    <Panel className="p-4 sm:p-5">
      <SectionHeader
        eyebrow="Water"
        title="Smart Water Network"
        subtitle="Flow anomaly detection across 148 simulated network segments."
        right={<DemoTag />}
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
          >
            <s.icon className={`mb-2 h-4 w-4 ${s.color}`} />
            <div className="flex items-baseline gap-0.5">
              <AnimatedNumber value={s.value} decimals={s.d} className="text-xl font-semibold text-white" />
              <span className="text-[11px] text-slate-500">{s.suffix}</span>
            </div>
            <div className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Zone 4 consumption vs expected pattern (M L/day)
            </span>
            <Badge tone="amber">+23% deviation</Badge>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WATER_FLOW} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="t" {...axisProps} />
                <YAxis {...axisProps} width={48} domain={[1.5, 2.4]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                <Line
                  type="monotone"
                  dataKey="normal"
                  name="Expected"
                  stroke="#64748b"
                  strokeWidth={1.8}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual"
                  stroke="#22d3ee"
                  strokeWidth={2.4}
                  dot={{ r: 2.5, fill: "#22d3ee", strokeWidth: 0 }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-[13px] font-semibold text-white">
              Possible leak detected in Zone 4
            </span>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">
            Current consumption is <span className="num font-semibold text-amber-300">23%</span> above its
            normal simulated pattern. Night-flow has not dropped below 310 L/min for 3 consecutive nights.
          </p>

          <div className="mt-3 space-y-2">
            {[
              ["Segment", "D-12 · South Grid"],
              ["Confidence", "82%"],
              ["Estimated loss", "48,000 L/day"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[11.5px]">
                <span className="text-slate-500">{k}</span>
                <span className="num text-slate-200">{v}</span>
              </div>
            ))}
          </div>
          <MeterBar value={82} color="#fbbf24" className="mt-3" />

          <Button size="sm" variant="primary" className="mt-3.5 w-full" onClick={() => setOpen(true)}>
            <Search className="h-3.5 w-3.5" />
            Investigate
          </Button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} className="max-w-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-amber-400">Leak investigation</div>
            <h3 className="mt-1 text-lg font-semibold text-white">Segment D-12 · Zone 4 South Grid</h3>
          </div>
          <Badge tone="amber">Confidence 82%</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            ["Pressure", "2.1 bar", "−0.6 vs normal"],
            ["Night flow", "310 L/min", "should be <90"],
            ["Pipe age", "28 yrs", "AC main"],
            ["Last repair", "2019", "joint failure"],
          ].map(([k, v, n]) => (
            <div key={k} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
              <div className="num text-[14px] font-semibold text-white">{v}</div>
              <div className="text-[10px] text-slate-600">{n}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-3.5">
          <div className="mb-1.5 text-[11.5px] font-semibold text-cyan-300">AI reasoning</div>
          <p className="text-[12.5px] leading-relaxed text-slate-300">
            Three independent signals agree: sustained night flow, a 0.6 bar pressure drop between nodes
            WTR-12 and WTR-18, and 11 citizen reports of damp pavement within 400 m. The model ranks a
            joint failure on the 28-year-old AC main as the most likely cause.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={() => {
              applyAction({
                id: "leak-crew",
                label: "Dispatch inspection crew to segment D-12",
                effect: { waterEff: 4, sustainability: 0.8, waterUse: -0.08 },
                toast: "Crew 4 dispatched · ETA 35 min",
              });
              setOpen(false);
            }}
          >
            <Wrench className="h-3.5 w-3.5" />
            Dispatch inspection crew
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              pushToast({
                kind: "info",
                title: "Segment scheduled",
                body: "D-12 added to tomorrow's acoustic survey.",
              });
              setOpen(false);
            }}
          >
            Schedule acoustic survey
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-slate-600">
          Prototype interaction · no real work orders are created.
        </p>
      </Modal>
    </Panel>
  );
}
