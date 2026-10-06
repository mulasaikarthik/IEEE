import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, Battery, Lightbulb, Zap } from "lucide-react";
import { ENERGY_CURVE } from "../data/city";
import { useCity } from "../store/CityStore";
import { AnimatedNumber, Badge, Button, DemoTag, MeterBar, Panel, SectionHeader } from "./ui";
import { ChartTooltip, axisProps } from "./charts";

export default function EnergyPanel() {
  const { metrics, pushToast } = useCity();
  const [brightness, setBrightness] = useState(100);
  const [optimised, setOptimised] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const h = window.setInterval(() => {
      setBrightness((b) => {
        if (b <= 40) {
          window.clearInterval(h);
          setRunning(false);
          setOptimised(true);
          return 40;
        }
        return b - 3;
      });
    }, 45);
    return () => window.clearInterval(h);
  }, [running]);

  const simulate = () => {
    if (optimised) {
      setOptimised(false);
      setBrightness(100);
      return;
    }
    setRunning(true);
    pushToast({
      kind: "success",
      title: "Adaptive dimming engaged",
      body: "Cluster Avenue 9 · 46 lamps · 60% saving.",
    });
  };

  const optimisedUsage = Math.max(20, metrics.energyUsage * 0.68);
  const savedPct = ((metrics.energyUsage - optimisedUsage) / metrics.energyUsage) * 100;

  return (
    <Panel className="p-4 sm:p-5">
      <SectionHeader
        eyebrow="Energy"
        title="AI Energy Optimization"
        subtitle="Grid load shaping, adaptive lighting and off-peak scheduling."
        right={<DemoTag />}
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {[
          {
            label: "Current Energy Usage",
            value: metrics.energyUsage,
            suffix: " kW",
            icon: Zap,
            color: "text-amber-300",
            d: 0,
          },
          {
            label: "Optimized Usage",
            value: optimisedUsage,
            suffix: " kW",
            icon: Battery,
            color: "text-eco-300",
            d: 0,
          },
          { label: "Energy Saved", value: savedPct, suffix: "%", icon: Zap, color: "text-eco-300", d: 0 },
          {
            label: "Est. Monthly Saving",
            value: 1.84,
            prefix: "₹",
            suffix: "L",
            icon: Banknote,
            color: "text-cyan-300",
            d: 2,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
          >
            <s.icon className={`mb-2 h-4 w-4 ${s.color}`} />
            <AnimatedNumber
              value={s.value}
              decimals={s.d}
              prefix={s.prefix}
              suffix={s.suffix}
              className="text-xl font-semibold text-white"
            />
            <div className="mt-0.5 text-[11px] leading-tight text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Traditional vs AI-optimized consumption
            </span>
            <Badge tone="eco">−32% peak</Badge>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENERGY_CURVE} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="trad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="opt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="t" {...axisProps} />
                <YAxis {...axisProps} width={46} />
                <Tooltip content={<ChartTooltip unit=" kW" />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                  iconType="circle"
                  iconSize={7}
                />
                <Area
                  type="monotone"
                  dataKey="traditional"
                  name="Traditional"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  fill="url(#trad)"
                  animationDuration={1100}
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  name="AI Optimized"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#opt)"
                  animationDuration={1300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* street light */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 transition-all duration-300"
                style={{
                  background: `rgba(251,191,36,${0.06 + (brightness / 100) * 0.22})`,
                  boxShadow: `0 0 ${brightness / 4}px rgba(251,191,36,${brightness / 320})`,
                }}
              >
                <Lightbulb className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-white">Street Light #102</div>
                <div className="text-[11px] text-slate-500">Zone 5 · Avenue 9 · 46 lamp cluster</div>
              </div>
            </div>
            <Badge tone={optimised ? "eco" : "amber"}>{optimised ? "Optimised" : "Inefficient"}</Badge>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {[
              ["Traffic", "Low", "text-slate-200"],
              ["Current brightness", `${brightness.toFixed(0)}%`, "text-amber-300"],
              ["AI recommended", "40%", "text-eco-300"],
              ["Estimated energy saving", optimised ? "60% achieved" : "60%", "text-eco-300"],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between text-[12.5px]">
                <span className="text-slate-400">{k}</span>
                <span className={`num font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <MeterBar value={brightness} color={optimised ? "#34d399" : "#fbbf24"} />
            <div className="mt-1 flex justify-between text-[10px] text-slate-600">
              <span>0%</span>
              <span>Lamp output</span>
              <span>100%</span>
            </div>
          </div>

          <Button
            size="sm"
            variant={optimised ? "ghost" : "primary"}
            className="mt-3.5 w-full"
            onClick={simulate}
            disabled={running}
          >
            {running ? "Dimming…" : optimised ? "Revert to baseline" : "Simulate Optimization"}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
