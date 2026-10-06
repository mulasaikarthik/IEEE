import type { SectionId } from "../store/CityStore";
import { useCity } from "../store/CityStore";
import { DemoTag } from "./ui";

const COLS: { title: string; items: { label: string; target: SectionId }[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Dashboard", target: "dashboard" },
      { label: "Live Map", target: "map" },
      { label: "AI Advisor", target: "advisor" },
    ],
  },
  {
    title: "Modules",
    items: [
      { label: "Waste · Energy", target: "dashboard" },
      { label: "Water · Air", target: "dashboard" },
      { label: "Future Simulator", target: "simulator" },
    ],
  },
];

export default function Footer() {
  const { go, setChatOpen } = useCity();

  return (
    <footer className="mt-8 border-t border-white/[0.07] px-1 pb-4 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-sm">
          <button
            onClick={() => go("dashboard")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="text-base">🌍</span>
            <span className="text-[14px] font-semibold text-white">EcoCity AI</span>
          </button>
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
            AI-powered urban intelligence for sustainable cities. City data → AI analysis →
            recommendation → action → measurable impact.
          </p>
          <button
            onClick={() => setChatOpen(true)}
            className="mt-2.5 text-[11.5px] font-medium text-eco-400 transition-colors hover:text-eco-300"
          >
            🤖 Ask EcoCity AI →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[12px] text-slate-500 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-slate-600">
                {c.title}
              </div>
              {c.items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => go(it.target)}
                  className="block text-left transition-colors hover:text-eco-300"
                >
                  {it.label}
                </button>
              ))}
            </div>
          ))}
          <div>
            <div className="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-slate-600">Status</div>
            <div>Simulated feed</div>
            <div>7 zones · 4,820 nodes</div>
            <div>Uptime 99.8%</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-4">
        <span className="text-[11.5px] text-slate-600">
          © 2026 EcoCity AI · All data on this site is simulated for demonstration purposes.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <DemoTag text="Prototype" />
          <DemoTag text="Demo Data" />
          <DemoTag text="Built for Innovation Challenge" />
        </div>
      </div>
    </footer>
  );
}
