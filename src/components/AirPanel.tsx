import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, MapPin, Wind } from "lucide-react";
import { AQI_24H } from "../data/city";
import { useCity } from "../store/CityStore";
import { AnimatedNumber, Badge, Button, DemoTag, Panel, SectionHeader, StatusDot } from "./ui";
import { ChartTooltip, axisProps } from "./charts";

function aqiTone(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "#34d399" };
  if (aqi <= 100) return { label: "Moderate", color: "#a3e635" };
  if (aqi <= 150) return { label: "Poor", color: "#fbbf24" };
  return { label: "Unhealthy", color: "#f87171" };
}

export default function AirPanel() {
  const { metrics, go, setFocusMarker } = useCity();
  const tone = aqiTone(metrics.aqi);
  const hotspot = aqiTone(metrics.zone4Aqi);

  const readings = [
    { label: "AQI", value: metrics.aqi, unit: "", color: tone.color, d: 0 },
    { label: "PM2.5", value: metrics.aqi * 0.44, unit: " µg/m³", color: "#22d3ee", d: 0 },
    { label: "PM10", value: metrics.aqi * 0.85, unit: " µg/m³", color: "#22d3ee", d: 0 },
    { label: "CO₂", value: 412, unit: " ppm", color: "#94a3b8", d: 0 },
    { label: "NO₂", value: 28, unit: " ppb", color: "#94a3b8", d: 0 },
  ];

  return (
    <Panel className="p-4 sm:p-5">
      <SectionHeader
        eyebrow="Air"
        title="Environmental Intelligence"
        subtitle="Continuous air-quality sampling across 32 simulated stations."
        right={
          <div className="flex items-center gap-2">
            <Badge tone={metrics.aqi > 100 ? "amber" : "eco"} icon={<StatusDot color={tone.color} />}>
              City average · {tone.label}
            </Badge>
            <DemoTag />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {readings.map((r) => (
          <div
            key={r.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
          >
            <div className="text-[10.5px] uppercase tracking-wider text-slate-500">{r.label}</div>
            <div className="mt-1 flex items-baseline gap-0.5" style={{ color: r.color }}>
              <AnimatedNumber value={r.value} decimals={r.d} className="text-xl font-semibold" />
              <span className="text-[11px] text-slate-500">{r.unit}</span>
            </div>
            <div className="mt-2 h-1 rounded-full" style={{ background: `${r.color}44` }}>
              <div
                className="h-1 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (r.value / (r.label === "CO₂" ? 600 : r.label === "AQI" ? 200 : 120)) * 100)}%`,
                  background: r.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              24-hour AQI & PM2.5 trend
            </span>
            <Wind className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={AQI_24H} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="pmG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="t" {...axisProps} />
                <YAxis {...axisProps} width={46} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                <ReferenceLine
                  y={100}
                  stroke="#fbbf24"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{ value: "Poor", fill: "#fbbf24", fontSize: 10, position: "right" }}
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  name="AQI"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#aqiG)"
                  animationDuration={1100}
                />
                <Area
                  type="monotone"
                  dataKey="pm25"
                  name="PM2.5"
                  stroke="#a78bfa"
                  strokeWidth={1.6}
                  fill="url(#pmG)"
                  animationDuration={1300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* hotspot */}
        <div className="relative overflow-hidden rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-500/20 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-[13px] font-semibold text-white">Pollution hotspot detected</span>
          </div>
          <div className="relative mt-3 flex items-end gap-4">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-slate-500">Zone 4</div>
              <AnimatedNumber
                value={metrics.zone4Aqi}
                className="text-[2.1rem] font-semibold leading-none text-red-300"
              />
              <div className="mt-1 text-[11px] text-slate-400">AQI · {hotspot.label}</div>
            </div>
            <div className="flex-1 space-y-1.5 pb-1">
              {[
                ["PM2.5", "98 µg/m³"],
                ["NO₂", "61 ppb"],
                ["Radius", "1.4 km"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11.5px]">
                  <span className="text-slate-500">{k}</span>
                  <span className="num text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-3.5 rounded-lg border border-white/[0.08] bg-ink-900/50 p-3">
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-eco-400">
              AI Action
            </div>
            <p className="text-[12px] leading-relaxed text-slate-300">
              Increase monitoring cadence and recommend traffic reduction on the Ring Road corridor until
              AQI falls below 120.
            </p>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="relative mt-3 w-full"
            onClick={() => {
              setFocusMarker("AQ-07");
              go("map");
            }}
          >
            <MapPin className="h-3.5 w-3.5" />
            Locate on live map
          </Button>
        </div>
      </div>
    </Panel>
  );
}
