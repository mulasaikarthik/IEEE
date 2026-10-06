import { useEffect, useState } from "react";
import { Activity, Brain, Cpu, Leaf, ShieldCheck } from "lucide-react";

const BOOT_LINES = [
  { t: 450, text: "Initialising urban intelligence core", tag: "SYS" },
  { t: 1100, text: "Linking 4,820 simulated sensor nodes", tag: "NET" },
  { t: 1750, text: "Calibrating air · water · waste · energy streams", tag: "ENV" },
  { t: 2400, text: "Loading 18-month pattern library", tag: "MDL" },
  { t: 3050, text: "AI advisory engine online", tag: "AI" },
  { t: 3700, text: "City command center ready", tag: "OK" },
];

const STAGES = [
  { icon: Cpu, label: "Data" },
  { icon: Brain, label: "Analysis" },
  { icon: Activity, label: "Recommend" },
  { icon: ShieldCheck, label: "Action" },
  { icon: Leaf, label: "Impact" },
];

const SKYLINE = [
  { x: 6, w: 10, h: 26 },
  { x: 19, w: 8, h: 40 },
  { x: 30, w: 12, h: 58 },
  { x: 45, w: 9, h: 34 },
  { x: 57, w: 11, h: 68 },
  { x: 71, w: 8, h: 44 },
  { x: 82, w: 12, h: 30 },
];

export default function Intro({ onDone }: { onDone: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [closing, setClosing] = useState(false);

  // Light-weight clock (~20fps) — enough for the progress bar and boot log,
  // while the heavy visuals run on pure CSS animations.
  useEffect(() => {
    const start = performance.now();
    const h = window.setInterval(() => setElapsed(performance.now() - start), 50);
    return () => window.clearInterval(h);
  }, []);

  const finish = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onDone, 720);
  };

  useEffect(() => {
    const end = window.setTimeout(finish, 4600);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(end);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleLines = BOOT_LINES.filter((l) => elapsed >= l.t);
  const activeStage = Math.min(STAGES.length - 1, Math.floor((elapsed - 900) / 650));
  const pct = Math.min(100, (elapsed / 4300) * 100);

  return (
    <div
      className={`fixed inset-0 z-[200] overflow-hidden bg-ink-950 ${closing ? "animate-curtain" : ""}`}
    >
      {/* layered background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-eco-500/[0.07] blur-[130px]" />
      <div className="absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />

      {/* scanning beam */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 animate-scan bg-gradient-to-b from-transparent via-eco-400/[0.07] to-transparent" />

      {/* floating particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const r = Math.abs(Math.sin(i * 37.7) * 100) % 1;
        return (
          <span
            key={i}
            className="animate-spark absolute h-1 w-1 rounded-full bg-eco-400/70"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${12 + r * 76}%`,
              animationDelay: `${r * 2}s`,
            }}
          />
        );
      })}

      <div className="relative flex h-full flex-col items-center justify-center px-6 py-10">
        {/* emblem */}
        <div className="relative mb-5 flex h-[104px] w-[104px] items-center justify-center sm:mb-7 sm:h-[132px] sm:w-[132px]">
          <span className="animate-ring-out absolute inset-0 rounded-full border border-eco-500/35" />
          <span
            className="animate-ring-out absolute inset-0 rounded-full border border-cyan-500/25"
            style={{ animationDelay: "0.9s" }}
          />

          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
            {/* orbit ring */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
            <g className="animate-radar" style={{ transformOrigin: "60px 60px" }}>
              <path
                d="M60,60 L60,8 A52,52 0 0,1 96,24 Z"
                fill="url(#sweepGrad)"
                opacity="0.5"
              />
            </g>
            <defs>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* drawn hex core */}
            <polygon
              points="60,20 94,40 94,80 60,100 26,80 26,40"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.6"
              strokeLinejoin="round"
              className="animate-draw"
              style={{ ["--len" as string]: "240" }}
            />

            {/* skyline inside */}
            <g className="translate-y-[2px]">
              {SKYLINE.map((b, i) => (
                <rect
                  key={i}
                  x={34 + b.x * 0.52}
                  y={82 - b.h * 0.52}
                  width={b.w * 0.52}
                  height={b.h * 0.52}
                  rx="1"
                  fill={i % 2 ? "#22d3ee" : "#34d399"}
                  fillOpacity={0.5}
                  className="animate-skyline"
                  style={{ animationDelay: `${700 + i * 90}ms`, transformOrigin: "center bottom" }}
                />
              ))}
              <line x1="34" y1="82" x2="86" y2="82" stroke="#475569" strokeWidth="1" />
            </g>
          </svg>

          <span className="relative z-10 translate-y-[1px] text-[26px] animate-blur-in">🌍</span>
        </div>

        {/* wordmark */}
        <h1
          className="animate-track-in text-center text-3xl font-semibold tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: "320ms" }}
        >
          EcoCity{" "}
          <span className="bg-gradient-to-r from-eco-300 via-eco-400 to-cyan-400 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p
          className="animate-rise mt-2.5 text-center text-[13px] tracking-[0.2em] text-slate-500 sm:text-sm"
          style={{ animationDelay: "800ms" }}
        >
          URBAN INTELLIGENCE PLATFORM
        </p>

        {/* pipeline stages */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:mt-8 sm:gap-2.5">
          {STAGES.map((s, i) => {
            const on = i <= activeStage;
            return (
              <div key={s.label} className="flex items-center gap-1.5 sm:gap-2.5">
                <div
                  className="flex flex-col items-center gap-1.5 transition-all duration-500"
                  style={{ opacity: on ? 1 : 0.28, transform: on ? "scale(1)" : "scale(0.92)" }}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-500 sm:h-10 sm:w-10 ${
                      on
                        ? "border-eco-500/45 bg-eco-500/12 shadow-[0_0_20px_-6px_rgba(52,211,153,0.8)]"
                        : "border-white/[0.07] bg-white/[0.02]"
                    }`}
                  >
                    <s.icon
                      className={`h-4 w-4 transition-colors duration-500 ${on ? "text-eco-300" : "text-slate-600"}`}
                    />
                  </div>
                  <span className="text-[9.5px] uppercase tracking-[0.12em] text-slate-500">
                    {s.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <span
                    className="mb-4 h-px w-4 transition-all duration-500 sm:w-7"
                    style={{
                      background: i < activeStage ? "#34d399" : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* boot log */}
        <div className="mt-6 h-[76px] w-full max-w-md sm:mt-8 sm:h-[88px]">
          <div className="space-y-1">
            {visibleLines.slice(-4).map((l) => (
              <div
                key={l.text}
                className="animate-rise flex items-center gap-2.5 text-[11px] sm:text-[11.5px]"
              >
                <span className="num w-9 shrink-0 rounded border border-white/[0.08] bg-white/[0.03] px-1 py-0.5 text-center text-[9px] text-eco-400">
                  {l.tag}
                </span>
                <span className="truncate text-slate-400">{l.text}</span>
                <span className="ml-auto text-eco-400">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* progress */}
        <div className="w-full max-w-md">
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-eco-400 to-cyan-400"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-eco-400 animate-blink" />
              Booting simulation
            </span>
            <span className="num">{Math.round(pct)}%</span>
          </div>
        </div>

        {/* skip */}
        <button
          onClick={finish}
          className="absolute bottom-7 right-6 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400 transition-all duration-200 hover:border-white/20 hover:text-white"
        >
          Skip intro →
        </button>

        <div className="absolute bottom-7 left-6 text-[10px] uppercase tracking-[0.14em] text-slate-700">
          Prototype · Simulated City Data
        </div>
      </div>
    </div>
  );
}
