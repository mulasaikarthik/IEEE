import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Bot, Download, Leaf, Sparkles, Target } from "lucide-react";
import { DIMENSIONS, IMPACT, SUSTAIN_TREND } from "../data/city";
import { useCity } from "../store/CityStore";
import {
  AnimatedNumber,
  Badge,
  Button,
  DemoTag,
  Panel,
  Radial,
  SectionHeader,
  StatusDot,
} from "./ui";
import { ChartTooltip, axisProps } from "./charts";
import Reveal from "./Reveal";

export default function Sustainability() {
  const { metrics, applied, go, pushToast } = useCity();
  const boost = applied.length * 1.4;
  const dims = DIMENSIONS.map((d) => ({
    ...d,
    value: Math.min(100, Math.round(d.value + boost)),
  }));

  const trend = [...SUSTAIN_TREND, { m: "Now", score: Math.round(metrics.sustainability) }];

  const downloadReport = () => {
    const lines = [
      "EcoCity AI — Sustainability Report (PROTOTYPE / SIMULATED DATA)",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Composite sustainability score: ${metrics.sustainability.toFixed(1)} / 100`,
      "",
      "DIMENSIONS",
      ...dims.map((d) => `  ${d.key.padEnd(14)} ${d.value}`),
      "",
      "ENVIRONMENTAL IMPACT (last 30 simulated days)",
      ...IMPACT.map((i) => `  ${i.label.padEnd(30)} ${i.value}%`),
      "",
      "LIVE READINGS",
      `  AQI            ${metrics.aqi.toFixed(0)}`,
      `  Congestion     ${metrics.traffic.toFixed(0)}%`,
      `  Grid load      ${metrics.energyUsage.toFixed(0)} kW`,
      `  Water use      ${metrics.waterUse.toFixed(2)} M L/day`,
      "",
      `APPLIED INTERVENTIONS (${applied.length})`,
      ...(applied.length ? applied.map((a, i) => `  ${i + 1}. ${a.label}`) : ["  none"]),
      "",
      "Note: all values are simulated for demonstration purposes only.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecocity-ai-sustainability-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast({
      kind: "success",
      title: "Report exported",
      body: "Simulated sustainability summary downloaded.",
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* score */}
        <Panel className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-eco-500/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-eco-400/80">Composite index</div>
              <h2 className="mt-1 text-lg font-semibold text-white">City Sustainability Score</h2>
            </div>
            <Badge tone="eco" icon={<StatusDot />}>
              Live
            </Badge>
          </div>

          <div className="relative mt-5 flex flex-col items-center">
            <div className="relative">
              <Radial
                value={metrics.sustainability}
                size={210}
                stroke={14}
                color="#34d399"
                label="out of 100"
              />
              <div className="absolute inset-0 animate-float rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-eco-500/12 px-2 py-0.5 text-[11.5px] font-semibold text-eco-300">
                <ArrowUpRight className="h-3 w-3" />
                6.4% vs last month
              </span>
              <DemoTag text="Simulated estimate" />
            </div>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-slate-400">
              Weighted across energy, water, waste, transport, air quality and greenery. Scores above 75
              place the simulated city in the top national quartile.
            </p>
          </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2">
            {[
              ["Rank", "#4", "of 28 cities"],
              ["Target 2030", "92", "score"],
              ["Gap", `${(92 - metrics.sustainability).toFixed(0)}`, "points"],
            ].map(([k, v, n]) => (
              <div key={k} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 text-center">
                <div className="num text-[16px] font-semibold text-white">{v}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
                <div className="text-[10px] text-slate-600">{n}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" variant="ghost" onClick={downloadReport}>
              <Download className="h-3.5 w-3.5" />
              Export report
            </Button>
            <Button size="sm" variant="outline" onClick={() => go("simulator")}>
              <Sparkles className="h-3.5 w-3.5" />
              Model future
            </Button>
          </div>
        </Panel>

        {/* dimensions */}
        <div className="space-y-5">
          <Panel className="p-5">
            <SectionHeader
              eyebrow="Breakdown"
              title="Six sustainability dimensions"
              subtitle="Each pillar is scored 0–100 from its simulated sensor network."
              right={<DemoTag />}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {dims.map((d, i) => (
                <div
                  key={d.key}
                  className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-all duration-300 hover:border-white/15 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Radial value={d.value} size={82} stroke={7} color={d.color} />
                  <div className="mt-2 text-center text-[11.5px] font-medium text-slate-300">{d.key}</div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel className="p-5">
              <SectionHeader eyebrow="Trajectory" title="Score over time" />
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 6, right: 6, left: -26, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="m" {...axisProps} />
                    <YAxis {...axisProps} width={44} domain={[50, 100]} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Score"
                      stroke="#34d399"
                      strokeWidth={2.4}
                      fill="url(#scoreG)"
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel className="p-5">
              <SectionHeader eyebrow="Profile" title="Dimension radar" />
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dims} outerRadius="78%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="key"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                    />
                    <Radar
                      dataKey="value"
                      name="Score"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.22}
                      animationDuration={1100}
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* impact */}
      <Reveal>
      <Panel className="p-5">
        <SectionHeader
          eyebrow="Outcomes"
          title="Environmental Impact"
          subtitle="Prototype estimates produced by the simulated city model — not audited municipal figures."
          right={
            <Badge tone="eco" icon={<Sparkles className="h-3 w-3" />}>
              Last 30 simulated days
            </Badge>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {IMPACT.map((it, i) => (
            <div
              key={it.label}
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:border-eco-500/30 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Leaf className="mb-2 h-4 w-4 text-eco-400" />
              <div className="flex items-baseline gap-1">
                <AnimatedNumber
                  value={it.value + (applied.length ? 1.2 : 0)}
                  decimals={1}
                  className="text-2xl font-semibold text-white"
                />
                <span className="text-sm text-eco-300">%</span>
              </div>
              <div className="mt-1 text-[11.5px] leading-tight text-slate-500">{it.label}</div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-eco-500 to-cyan-400 transition-[width] duration-1000"
                  style={{ width: `${Math.min(100, it.value * 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] px-4 py-3">
          <Target className="h-4 w-4 shrink-0 text-cyan-300" />
          <p className="flex-1 text-[12.5px] leading-relaxed text-slate-300">
            At the current simulated improvement rate, the city reaches its 2030 target of 92 by{" "}
            <span className="font-semibold text-cyan-300">Q3 2029</span> — roughly 14 months ahead of the
            baseline plan.
          </p>
          <Button size="sm" variant="cyan" onClick={() => go("advisor")}>
            <Bot className="h-3.5 w-3.5" />
            See how to get there
          </Button>
        </div>
      </Panel>
      </Reveal>
    </div>
  );
}
