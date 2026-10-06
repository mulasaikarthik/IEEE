import { Clapperboard, Square } from "lucide-react";
import { useCity } from "../store/CityStore";
import { Button } from "./ui";
import { cn } from "../utils/cn";

export default function DemoOverlay() {
  const { demoRunning, demoStep, demoSteps, stopDemo } = useCity();
  if (!demoRunning || demoStep < 0) return null;
  const step = demoSteps[demoStep];
  const final = demoStep === demoSteps.length - 1;
  const progress = ((demoStep + 1) / demoSteps.length) * 100;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[75] flex justify-center px-4 lg:bottom-6">
      <div className="panel pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border-eco-500/25 animate-fade-up">
        <div className="h-0.5 w-full bg-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-eco-400 to-cyan-400 transition-[width] duration-700 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-start gap-3 px-4 py-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
              final ? "border-eco-500/40 bg-eco-500/15" : "border-cyan-500/30 bg-cyan-500/10",
            )}
          >
            <Clapperboard className={cn("h-4 w-4", final ? "text-eco-300" : "text-cyan-300")} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="num text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Demo mode · step {demoStep + 1}/{demoSteps.length}
              </span>
              <span className="h-1 w-1 rounded-full bg-eco-400 animate-blink" />
            </div>
            <div className={cn("mt-0.5 text-[14px] font-semibold", final ? "text-eco-300" : "text-white")}>
              {step.title}
            </div>
            <div className="text-[11.5px] leading-snug text-slate-400">{step.detail}</div>

            {final && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[
                  ["CO₂", "↓ 12%"],
                  ["Traffic", "↓ 16%"],
                  ["Energy", "↓ 18%"],
                  ["Score", "78 → 88"],
                ].map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-lg border border-eco-500/25 bg-eco-500/10 px-2.5 py-1 text-[11.5px] text-eco-200"
                  >
                    <span className="text-slate-400">{k} </span>
                    <span className="num font-semibold">{v}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button size="sm" variant="ghost" onClick={stopDemo}>
            <Square className="h-3 w-3" />
            Stop
          </Button>
        </div>
      </div>
    </div>
  );
}
