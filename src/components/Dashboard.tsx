import {
  Activity,
  ArrowRight,
  Brain,
  Cpu,
  Droplets,
  Gauge,
  Leaf,
  Recycle,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { useCity } from "../store/CityStore";
import KPICard from "./KPICard";
import Reveal from "./Reveal";
import CityMap from "./CityMap";
import AIAdvisor from "./AIAdvisor";
import WastePanel from "./WastePanel";
import EnergyPanel from "./EnergyPanel";
import AirPanel from "./AirPanel";
import WaterPanel from "./WaterPanel";
import { Badge, Button, DemoTag, Panel, StatusDot } from "./ui";

const FLOW = [
  { icon: Cpu, label: "City Data" },
  { icon: Brain, label: "AI Analysis" },
  { icon: Activity, label: "Recommendation" },
  { icon: ShieldCheck, label: "Action" },
  { icon: Leaf, label: "Measurable Impact" },
];

export default function Dashboard() {
  const { metrics, history, go, tick, live, setFocusMarker } = useCity();

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-5">
      {/* intelligence loop strip */}
      <Panel className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {FLOW.map((f, i) => (
            <div key={f.label} className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5">
                <f.icon className="h-3.5 w-3.5 text-eco-400" />
                <span className="text-[11.5px] font-medium text-slate-300">{f.label}</span>
              </div>
              {i < FLOW.length - 1 && <ArrowRight className="h-3 w-3 text-slate-700" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={live ? "red" : "slate"} icon={<StatusDot color={live ? "#f87171" : "#64748b"} />}>
            {live ? "LIVE SIMULATION" : "SIMULATION PAUSED"}
          </Badge>
          <Button size="sm" variant="ghost" onClick={tick}>
            Simulate Live Update
          </Button>
        </div>
      </Panel>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          icon={Leaf}
          label="Sustainability Score"
          value={metrics.sustainability}
          suffix="/ 100"
          trend={6.4}
          trendNote="vs last month"
          statusLabel="Improving"
          tone="eco"
          data={history.sustainability}
          delay={0}
          onClick={() => go("sustainability")}
          linkLabel="Open sustainability index"
        />
        <KPICard
          icon={Wind}
          label="Air Quality"
          value={metrics.aqi}
          suffix="AQI"
          trend={-3.1}
          trendNote={metrics.aqi <= 50 ? "Good" : metrics.aqi <= 100 ? "Good · moderate" : "Poor"}
          statusLabel={metrics.aqi > 100 ? "Watch" : "Good"}
          tone={metrics.aqi > 100 ? "amber" : "cyan"}
          data={history.aqi}
          delay={60}
          onClick={() => jumpTo("panel-air")}
          linkLabel="Environmental intelligence"
        />
        <KPICard
          icon={Gauge}
          label="Energy Efficiency"
          value={metrics.energyEff}
          suffix="%"
          trend={9.2}
          trendNote="grid optimisation"
          statusLabel="Optimal"
          tone="eco"
          data={history.energyEff}
          delay={120}
          onClick={() => jumpTo("panel-energy")}
          linkLabel="Energy optimization"
        />
        <KPICard
          icon={Droplets}
          label="Water Efficiency"
          value={metrics.waterEff}
          suffix="%"
          trend={4.8}
          trendNote="2 leaks flagged"
          statusLabel="Attention"
          tone="cyan"
          data={history.waterEff}
          delay={180}
          onClick={() => jumpTo("panel-water")}
          linkLabel="Water network"
        />
        <KPICard
          icon={Recycle}
          label="Waste Management"
          value={metrics.wasteEff}
          suffix="%"
          trend={11.3}
          trendNote="route efficiency"
          statusLabel="Strong"
          tone="eco"
          data={history.wasteEff}
          delay={240}
          onClick={() => jumpTo("panel-waste")}
          linkLabel="Waste intelligence"
        />
        <KPICard
          icon={Activity}
          label="CO₂ Reduction"
          value={metrics.co2}
          suffix="%"
          decimals={1}
          trendNote="This month"
          statusLabel="On track"
          tone="eco"
          data={history.co2}
          delay={300}
          onClick={() => go("simulator")}
          linkLabel="Model future impact"
        />
      </div>

      {/* advisor + map */}
      <Reveal className="grid gap-5 xl:grid-cols-[1.08fr_1fr]">
        <AIAdvisor />
        <div className="space-y-5">
          <CityMap compact />
          <Panel className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="text-[13px] font-semibold text-white">Need the full command view?</div>
              <div className="text-[11.5px] text-slate-500">
                Open the live map for all 4,820 simulated nodes and filters.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DemoTag />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFocusMarker("AQ-07");
                  go("map");
                }}
              >
                Jump to Zone 4 hotspot
              </Button>
              <Button size="sm" variant="cyan" onClick={() => go("map")}>
                Open Live Map
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Panel>
        </div>
      </Reveal>

      <Reveal className="scroll-mt-24" id="panel-waste">
        <WastePanel />
      </Reveal>
      <Reveal className="scroll-mt-24" id="panel-energy">
        <EnergyPanel />
      </Reveal>
      <Reveal className="scroll-mt-24" id="panel-air">
        <AirPanel />
      </Reveal>
      <Reveal className="scroll-mt-24" id="panel-water">
        <WaterPanel />
      </Reveal>
    </div>
  );
}
