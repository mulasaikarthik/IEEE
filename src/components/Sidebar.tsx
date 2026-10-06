import {
  Bot,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPinned,
  MessageSquareWarning,
  Sparkles,
  X,
} from "lucide-react";
import type { SectionId } from "../store/CityStore";
import { useCity } from "../store/CityStore";
import { cn } from "../utils/cn";

export const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "City health overview" },
  { id: "map", label: "Live Map", icon: MapPinned, hint: "Sensor network" },
  { id: "sustainability", label: "Sustainability", icon: Leaf, hint: "Index & impact" },
  { id: "advisor", label: "AI Advisor", icon: Bot, hint: "Recommended actions" },
  { id: "reports", label: "Citizen Reports", icon: MessageSquareWarning, hint: "Community signals" },
  { id: "simulator", label: "Future Simulator", icon: Sparkles, hint: "Scenario modelling" },
];

export default function Sidebar({
  mobileOpen,
  onCloseMobile,
  onExit,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onExit: () => void;
}) {
  const { section, go, live } = useCity();

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-eco-500/30 bg-eco-500/10 text-lg">
            🌍
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">EcoCity AI</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Command Center
            </div>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="mt-7 flex-1 space-y-1 px-3">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Operations
        </div>
        {NAV.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                go(item.id);
                onCloseMobile();
              }}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-eco-500/15 to-transparent text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-[2.5px] -translate-y-1/2 rounded-r-full bg-eco-400 transition-all duration-300",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                )}
              />
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active ? "text-eco-400" : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              <span className="flex-1">
                <span className="block text-[13.5px] font-medium leading-tight">{item.label}</span>
                <span className="block text-[10.5px] leading-tight text-slate-600">{item.hint}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 px-4 pb-5">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            System Status
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full",
                  live ? "animate-ping bg-eco-400/70" : "bg-amber-400/50",
                )}
              />
              <span
                className={cn("relative h-2 w-2 rounded-full", live ? "bg-eco-400" : "bg-amber-400")}
              />
            </span>
            <span className="text-xs text-slate-300">
              {live ? "All systems operational" : "Live feed paused"}
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
            {[
              ["Nodes", "4,820"],
              ["Zones", "7"],
              ["Uptime", "99.8%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-white/[0.03] py-1.5">
                <div className="num text-[11px] font-semibold text-slate-200">{v}</div>
                <div className="text-[9px] uppercase tracking-wide text-slate-600">{k}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-eco-500/30 to-cyan-500/20 text-xs font-semibold text-eco-200">
            CA
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">City Administrator</div>
            <div className="truncate text-[11px] text-slate-500">Greenport Municipal Corp.</div>
          </div>
          <button
            onClick={onExit}
            title="Exit to landing screen"
            aria-label="Exit to landing screen"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-ink-900/80 backdrop-blur-xl lg:block">
        {body}
      </aside>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[70] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[264px] border-r border-white/[0.07] bg-ink-900 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {body}
        </aside>
      </div>
    </>
  );
}

export function MobileNav() {
  const { section, go } = useCity();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-ink-900/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1.5 py-1.5">
        {NAV.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 transition-colors",
                active ? "text-eco-400" : "text-slate-500",
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="text-[9.5px] font-medium leading-none">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
