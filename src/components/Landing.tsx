import {
  ArrowRight,
  Activity,
  Brain,
  Cpu,
  Droplets,
  Gauge,
  Leaf,
  MapPinned,
  PlayCircle,
  Recycle,
  ShieldCheck,
  Wind,
} from "lucide-react";
import heroImg from "../assets/city-hero.jpg";
import { Badge, Button, DemoTag, StatusDot } from "./ui";

const PIPELINE = [
  { icon: Cpu, label: "City Data", note: "4,820 simulated sensor nodes" },
  { icon: Brain, label: "AI Analysis", note: "Correlation + prediction engine" },
  { icon: Activity, label: "Recommendation", note: "Ranked, explainable actions" },
  { icon: ShieldCheck, label: "Action", note: "Dispatched to departments" },
  { icon: Leaf, label: "Measurable Impact", note: "Re-scored sustainability index" },
];

const HIGHLIGHTS = [
  { icon: Wind, value: "18.6%", label: "CO₂ reduced", color: "text-eco-400" },
  { icon: Gauge, value: "21%", label: "Energy saved", color: "text-cyan-400" },
  { icon: Droplets, value: "13%", label: "Water saved", color: "text-cyan-400" },
  { icon: Recycle, value: "17%", label: "Waste trips cut", color: "text-eco-400" },
];

export default function Landing({
  onEnter,
  onDemo,
  onReplayIntro,
}: {
  onEnter: () => void;
  onDemo: () => void;
  onReplayIntro?: () => void;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          className="animate-blur-in h-full w-full object-cover opacity-[0.38]"
          style={{ animationDuration: "1.6s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/85 to-ink-950" />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] animate-float rounded-full bg-eco-500/10 blur-[130px]" />
        <div
          className="absolute -right-32 top-40 h-[380px] w-[380px] animate-float rounded-full bg-cyan-500/10 blur-[130px]"
          style={{ animationDelay: "2s" }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-transparent via-eco-400/[0.04] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
        {/* nav */}
        <header className="animate-fade-up flex items-center justify-between">
          <div className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-eco-500/30 bg-eco-500/10 text-lg transition-transform duration-500 group-hover:rotate-12">
              🌍
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">EcoCity AI</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                Urban Intelligence
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <DemoTag text="Prototype · Simulated City Data" />
            {onReplayIntro && (
              <Button variant="ghost" size="sm" onClick={onReplayIntro} title="Replay intro sequence">
                ↻ Replay intro
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onEnter}>
              Sign in as City Admin
            </Button>
          </div>
        </header>

        {/* hero */}
        <main className="flex flex-1 flex-col justify-center py-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
                <Badge tone="eco" icon={<StatusDot />} className="mb-5">
                  Live simulation engine online
                </Badge>
              </div>

              <h1
                className="animate-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl"
                style={{ animationDelay: "140ms" }}
              >
                Building smarter,
                <br />
                <span className="bg-gradient-to-r from-eco-300 via-eco-400 to-cyan-400 bg-clip-text text-transparent">
                  greener cities
                </span>{" "}
                with AI.
              </h1>

              <p
                className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
                style={{ animationDelay: "260ms" }}
              >
                Real-time urban intelligence for a more sustainable tomorrow. EcoCity AI doesn't just
                monitor a city — it understands what is happening and recommends what the city should
                do next.
              </p>

              <div
                className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "380ms" }}
              >
                <Button
                  variant="primary"
                  className="group px-5 py-2.5 text-[0.95rem] hover:shadow-[0_14px_38px_-10px_rgba(16,185,129,0.95)]"
                  onClick={onEnter}
                >
                  Enter City Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  className="group px-5 py-2.5 text-[0.95rem]"
                  onClick={onDemo}
                >
                  <PlayCircle className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Explore Demo
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {HIGHLIGHTS.map((h, i) => (
                  <div
                    key={h.label}
                    className="panel animate-fade-up group rounded-xl px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-eco-500/30"
                    style={{ animationDelay: `${500 + i * 90}ms` }}
                  >
                    <h.icon
                      className={`mb-1.5 h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${h.color}`}
                    />
                    <div className="num text-lg font-semibold text-white">{h.value}</div>
                    <div className="text-[11px] text-slate-500">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* pipeline card */}
            <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
              <div className="panel rounded-3xl p-6 transition-shadow duration-500 hover:shadow-[0_40px_90px_-50px_rgba(16,185,129,0.6)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-400/80">
                      How it works
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">The intelligence loop</div>
                  </div>
                  <MapPinned className="h-5 w-5 text-slate-600" />
                </div>

                <div className="space-y-2.5">
                  {PIPELINE.map((p, i) => (
                    <div key={p.label} className="group relative flex items-center gap-3.5">
                      <div className="relative flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-eco-500/40 group-hover:bg-eco-500/10">
                          <p.icon className="h-4 w-4 text-eco-300" />
                        </div>
                        {i < PIPELINE.length - 1 && (
                          <div className="absolute top-10 h-[14px] w-px bg-gradient-to-b from-eco-500/50 to-transparent" />
                        )}
                      </div>
                      <div className="flex-1 rounded-xl border border-transparent px-2 py-1.5 transition-colors group-hover:border-white/[0.07] group-hover:bg-white/[0.02]">
                        <div className="text-sm font-medium text-white">{p.label}</div>
                        <div className="text-xs text-slate-500">{p.note}</div>
                      </div>
                      <span className="num text-[11px] text-slate-600">0{i + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-eco-500/20 bg-eco-500/[0.06] p-3.5">
                  <div className="flex items-start gap-2.5">
                    <Brain className="mt-0.5 h-4 w-4 shrink-0 text-eco-300" />
                    <p className="text-xs leading-relaxed text-slate-300">
                      <span className="font-semibold text-eco-300">Live example:</span> Zone 4 shows 91%
                      congestion and 168 AQI at the same time. EcoCity AI recommends a transit boost and
                      Route B diversion — projected 16% congestion relief.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] py-5 text-xs text-slate-500">
          <span>© 2026 EcoCity AI · AI-powered urban intelligence for sustainable cities.</span>
          <div className="flex items-center gap-2">
            <DemoTag text="Prototype" />
            <DemoTag text="Demo Data" />
            <DemoTag text="Built for Innovation Challenge" />
          </div>
        </footer>
      </div>
    </div>
  );
}
