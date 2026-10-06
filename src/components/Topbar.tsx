import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Clapperboard,
  Lightbulb,
  Menu,
  Pause,
  Play,
  RefreshCw,
  Siren,
  Sparkles,
  Square,
} from "lucide-react";
import { useCity, type NotifKind } from "../store/CityStore";
import { Badge, Button, DemoTag } from "./ui";
import { cn } from "../utils/cn";

const TITLES: Record<string, { title: string; sub: string }> = {
  dashboard: {
    title: "Good morning, City Administrator",
    sub: "Here's the current health of your city.",
  },
  map: { title: "Live City Intelligence", sub: "Real-time environmental and infrastructure monitoring." },
  sustainability: { title: "City Sustainability", sub: "Composite index across six urban dimensions." },
  advisor: { title: "AI City Advisor", sub: "Turning city data into actionable decisions." },
  reports: { title: "Citizen Reports", sub: "Community signals triaged by AI in real time." },
  simulator: {
    title: "Future City Simulator",
    sub: "Explore how today's decisions could shape tomorrow's city.",
  },
};

const NOTIF_STYLE: Record<NotifKind, { icon: typeof Bell; cls: string; label: string }> = {
  critical: { icon: Siren, cls: "text-red-400 bg-red-500/10 border-red-500/25", label: "Critical" },
  warning: {
    icon: AlertTriangle,
    cls: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    label: "Warning",
  },
  info: { icon: Lightbulb, cls: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25", label: "Optimization" },
  success: { icon: Sparkles, cls: "text-eco-400 bg-eco-500/10 border-eco-500/25", label: "Impact" },
};

function relTime(ts: number) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)}m ago`;
}

export default function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const {
    section,
    live,
    setLive,
    tick,
    lastUpdate,
    notifications,
    markAllRead,
    markRead,
    clearNotifications,
    go,
    demoRunning,
    startDemo,
    stopDemo,
  } = useCity();
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = window.setInterval(() => force((n) => n + 1), 5000);
    return () => window.clearInterval(h);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const meta = TITLES[section];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button
          onClick={onOpenMobileNav}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-300 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-white sm:text-lg">
            {meta.title}
          </h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">{meta.sub}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 md:flex">
            <span className="relative flex h-1.5 w-1.5">
              {live && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/80" />
              )}
              <span
                className={cn(
                  "relative h-1.5 w-1.5 rounded-full",
                  live ? "bg-red-400" : "bg-slate-500",
                )}
              />
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-slate-300">
              {live ? "LIVE" : "PAUSED"}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="num text-[11px] text-slate-500">{relTime(lastUpdate)}</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={tick}
            className="hidden sm:inline-flex"
            title="Push a new simulated sensor frame"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Simulate Live Update</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setLive(!live)}
            title={live ? "Pause live data" : "Resume live data"}
          >
            {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden xl:inline">{live ? "Pause Live Data" : "Resume"}</span>
          </Button>

          {/* notifications */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-300 transition-colors hover:bg-white/[0.08]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {open && (
              <div className="panel absolute right-0 top-12 z-50 w-[330px] overflow-hidden rounded-2xl animate-scale-in sm:w-[370px]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                  <span className="text-sm font-semibold text-white">
                    Notifications
                    {unread > 0 && <span className="ml-1.5 text-[11px] text-slate-500">{unread} new</span>}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={markAllRead}
                      disabled={unread === 0}
                      className="rounded-md px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={clearNotifications}
                      disabled={notifications.length === 0}
                      className="rounded-md px-2 py-1 text-[11px] text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="px-4 py-10 text-center">
                      <Bell className="mx-auto mb-2 h-5 w-5 text-slate-700" />
                      <p className="text-[12.5px] text-slate-500">You're all caught up.</p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        New simulated alerts will appear here.
                      </p>
                    </div>
                  )}
                  {notifications.map((n) => {
                    const s = NOTIF_STYLE[n.kind];
                    return (
                      <button
                        key={n.id}
                        onClick={() => {
                          markRead(n.id);
                          go(n.target);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full gap-3 border-b border-white/[0.05] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]",
                          !n.read && "bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                            s.cls,
                          )}
                        >
                          <s.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                              {s.label}
                            </span>
                            <span className="text-[10px] text-slate-600">{n.time}</span>
                          </span>
                          <span className="mt-0.5 block text-[13px] font-medium leading-snug text-white">
                            {n.title}
                          </span>
                          <span className="block text-[11.5px] text-slate-500">{n.body}</span>
                        </span>
                        {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-eco-400" />}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-white/[0.07] px-4 py-2 text-center">
                  <DemoTag text="Simulated alert stream" />
                </div>
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant={demoRunning ? "danger" : "primary"}
            onClick={demoRunning ? stopDemo : startDemo}
            className="whitespace-nowrap"
          >
            {demoRunning ? <Square className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{demoRunning ? "Stop Demo" : "DEMO MODE"}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-t border-white/[0.05] px-4 py-1.5 sm:px-6 md:hidden">
        <Badge tone={live ? "red" : "slate"}>{live ? "● LIVE SIMULATION" : "● PAUSED"}</Badge>
        <DemoTag text="Prototype · Simulated City Data" />
      </div>
    </header>
  );
}
