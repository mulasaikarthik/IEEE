import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SectionId =
  | "dashboard"
  | "map"
  | "sustainability"
  | "advisor"
  | "reports"
  | "simulator";

export interface Metrics {
  sustainability: number;
  aqi: number;
  energyEff: number;
  waterEff: number;
  wasteEff: number;
  co2: number;
  traffic: number;
  energyUsage: number;
  waterUse: number;
  zone4Aqi: number;
  zone4Traffic: number;
  binsToCollect: number;
  binFill: number;
  tankLevel: number;
}

const BASE: Metrics = {
  sustainability: 78,
  aqi: 72,
  energyEff: 84,
  waterEff: 71,
  wasteEff: 89,
  co2: 18.6,
  traffic: 68,
  energyUsage: 68,
  waterUse: 1.8,
  zone4Aqi: 168,
  zone4Traffic: 91,
  binsToCollect: 47,
  binFill: 91,
  tankLevel: 82,
};

export type NotifKind = "critical" | "warning" | "info" | "success";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  target: SectionId;
  read?: boolean;
}

export interface Toast {
  id: string;
  kind: NotifKind;
  title: string;
  body?: string;
}

export interface AppliedAction {
  id: string;
  label: string;
}

interface Ctx {
  section: SectionId;
  go: (s: SectionId) => void;
  metrics: Metrics;
  history: Record<keyof Metrics, number[]>;
  live: boolean;
  setLive: (v: boolean) => void;
  tick: () => void;
  lastUpdate: number;
  notifications: Notification[];
  pushNotification: (n: Omit<Notification, "id" | "time">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearNotifications: () => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  applied: AppliedAction[];
  applyAction: (a: { id: string; label: string; effect?: Partial<Metrics>; toast?: string }) => void;
  resetCity: () => void;
  demoRunning: boolean;
  demoStep: number;
  demoSteps: { title: string; detail: string }[];
  startDemo: () => void;
  stopDemo: () => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  focusMarker: string | null;
  setFocusMarker: (v: string | null) => void;
}

const CityContext = createContext<Ctx | null>(null);

const KEYS = Object.keys(BASE) as (keyof Metrics)[];

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const LIMITS: Record<keyof Metrics, [number, number]> = {
  sustainability: [40, 100],
  aqi: [20, 200],
  energyEff: [40, 100],
  waterEff: [40, 100],
  wasteEff: [40, 100],
  co2: [0, 60],
  traffic: [10, 100],
  energyUsage: [20, 140],
  waterUse: [0.8, 3],
  zone4Aqi: [30, 260],
  zone4Traffic: [10, 100],
  binsToCollect: [5, 120],
  binFill: [5, 100],
  tankLevel: [30, 100],
};

const DRIFT: Record<keyof Metrics, number> = {
  sustainability: 0.22,
  aqi: 2.4,
  energyEff: 0.5,
  waterEff: 0.45,
  wasteEff: 0.4,
  co2: 0.18,
  traffic: 1.8,
  energyUsage: 1.6,
  waterUse: 0.025,
  zone4Aqi: 3.2,
  zone4Traffic: 1.6,
  binsToCollect: 0.9,
  binFill: 0.5,
  tankLevel: 0.4,
};

export const DEMO_STEPS = [
  { title: "City baseline", detail: "Streaming 4,820 simulated sensor nodes across 7 zones." },
  { title: "Traffic anomaly", detail: "Junction #18 congestion spiking past 90%." },
  { title: "Pollution hotspot", detail: "Station AQ-07 reports 168 AQI in Zone 4." },
  { title: "Waste alert", detail: "Smart Bin #024 projected full within 2 hours." },
  { title: "AI analysis", detail: "Correlating congestion, emissions and green coverage…" },
  { title: "Actions applied", detail: "Transit boost, Route B diversion, adaptive lighting." },
  { title: "Impact measured", detail: "Re-scoring the city against the simulated baseline." },
  { title: "AI intervention complete", detail: "CO₂ ↓ 12% · Traffic ↓ 16% · Energy ↓ 18%" },
];

export function CityProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<SectionId>("dashboard");
  const [metrics, setMetrics] = useState<Metrics>(BASE);
  const [history, setHistory] = useState<Record<keyof Metrics, number[]>>(() => {
    const h = {} as Record<keyof Metrics, number[]>;
    KEYS.forEach((k) => {
      const base = BASE[k];
      h[k] = Array.from({ length: 16 }, (_, i) =>
        Number((base + Math.sin(i / 2.2) * DRIFT[k] * 2.4 + (Math.random() - 0.5) * DRIFT[k]).toFixed(2)),
      );
    });
    return h;
  });
  const [live, setLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [applied, setApplied] = useState<AppliedAction[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [focusMarker, setFocusMarker] = useState<string | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(-1);
  const timers = useRef<number[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      kind: "critical",
      title: "Zone 4 pollution hotspot detected",
      body: "Station AQ-07 · 168 AQI · Unhealthy",
      time: "2 min ago",
      target: "map",
    },
    {
      id: "n2",
      kind: "warning",
      title: "Bin #024 approaching capacity",
      body: "Central Market · 91% fill · full in ~2h",
      time: "9 min ago",
      target: "dashboard",
    },
    {
      id: "n3",
      kind: "info",
      title: "Street lighting optimization available",
      body: "Cluster Avenue 9 · 60% saving window open",
      time: "21 min ago",
      target: "dashboard",
    },
    {
      id: "n4",
      kind: "warning",
      title: "Possible water leakage detected",
      body: "Node WTR-12 · +23% above baseline",
      time: "38 min ago",
      target: "dashboard",
    },
  ]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-3), { ...t, id }]);
    const h = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4600);
    timers.current.push(h);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const pushNotification = useCallback((n: Omit<Notification, "id" | "time">) => {
    setNotifications((prev) => [
      { ...n, id: Math.random().toString(36).slice(2), time: "just now" },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const commit = useCallback((next: Metrics) => {
    setMetrics(next);
    setHistory((prev) => {
      const h = { ...prev };
      KEYS.forEach((k) => {
        h[k] = [...prev[k].slice(-23), Number(next[k].toFixed(2))];
      });
      return h;
    });
    setLastUpdate(Date.now());
  }, []);

  const tick = useCallback(() => {
    setMetrics((m) => {
      const next = { ...m };
      KEYS.forEach((k) => {
        const delta = (Math.random() - 0.5) * DRIFT[k] * 2;
        const [lo, hi] = LIMITS[k];
        next[k] = Number(clamp(m[k] + delta, lo, hi).toFixed(2));
      });
      setHistory((prev) => {
        const h = { ...prev };
        KEYS.forEach((k) => {
          h[k] = [...prev[k].slice(-23), next[k]];
        });
        return h;
      });
      return next;
    });
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    if (!live) return;
    const h = window.setInterval(tick, 3200);
    return () => window.clearInterval(h);
  }, [live, tick]);

  const applyAction = useCallback(
    (a: { id: string; label: string; effect?: Partial<Metrics>; toast?: string }) => {
      setApplied((prev) => (prev.some((x) => x.id === a.id) ? prev : [...prev, { id: a.id, label: a.label }]));
      if (a.effect) {
        setMetrics((m) => {
          const next = { ...m };
          (Object.keys(a.effect!) as (keyof Metrics)[]).forEach((k) => {
            const [lo, hi] = LIMITS[k];
            next[k] = Number(clamp(m[k] + (a.effect![k] as number), lo, hi).toFixed(2));
          });
          setHistory((prev) => {
            const h = { ...prev };
            KEYS.forEach((k) => {
              h[k] = [...prev[k].slice(-23), next[k]];
            });
            return h;
          });
          return next;
        });
        setLastUpdate(Date.now());
      }
      pushToast({ kind: "success", title: "Simulation applied", body: a.toast ?? a.label });
    },
    [pushToast],
  );

  const resetCity = useCallback(() => {
    setApplied([]);
    commit(BASE);
    pushToast({ kind: "info", title: "City state reset", body: "Baseline simulated dataset restored." });
  }, [commit, pushToast]);

  const stopDemo = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setDemoRunning(false);
    setDemoStep(-1);
  }, []);

  const startDemo = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setApplied([]);
    setMetrics(BASE);
    setDemoRunning(true);
    setDemoStep(0);
    setSection("dashboard");
    setLive(true);

    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    schedule(3200, () => {
      setDemoStep(1);
      setSection("map");
      setMetrics((m) => ({ ...m, traffic: 84, zone4Traffic: 96 }));
      pushToast({ kind: "critical", title: "Traffic anomaly", body: "Junction #18 congestion at 96%." });
      pushNotification({
        kind: "critical",
        title: "Severe congestion · Junction #18",
        body: "Average speed collapsed to 8 km/h.",
        target: "map",
      });
    });

    schedule(8200, () => {
      setDemoStep(2);
      setFocusMarker("AQ-07");
      setMetrics((m) => ({ ...m, aqi: 96, zone4Aqi: 182 }));
      pushToast({ kind: "critical", title: "Pollution hotspot", body: "Zone 4 AQI climbing to 182." });
    });

    schedule(13500, () => {
      setDemoStep(3);
      setFocusMarker("BIN-024");
      setMetrics((m) => ({ ...m, binFill: 96, binsToCollect: 54, wasteEff: 84 }));
      pushToast({ kind: "warning", title: "Smart bin alert", body: "Bin #024 at 96% — overflow risk." });
    });

    schedule(18500, () => {
      setDemoStep(4);
      setFocusMarker(null);
      setSection("advisor");
      pushToast({ kind: "info", title: "AI City Advisor engaged", body: "Correlating 4 live signals in Zone 4." });
    });

    schedule(25000, () => {
      setDemoStep(5);
      setApplied([
        { id: "transit", label: "Increase public transport frequency by 15%" },
        { id: "reroute", label: "Divert traffic through alternate Route B" },
        { id: "green", label: "Prioritise green coverage in Zone 4" },
        { id: "monitor", label: "Increase environmental monitoring for 2 hours" },
      ]);
      setMetrics((m) => ({
        ...m,
        traffic: 70,
        zone4Traffic: 74,
        aqi: 82,
        zone4Aqi: 142,
        energyUsage: 58,
      }));
      pushToast({ kind: "success", title: "4 actions dispatched", body: "Transit, routing, greening, monitoring." });
    });

    schedule(31000, () => {
      setDemoStep(6);
      setSection("dashboard");
      setMetrics((m) => ({
        ...m,
        traffic: 57,
        zone4Traffic: 62,
        aqi: 68,
        zone4Aqi: 118,
        energyUsage: 48,
        energyEff: 91,
        wasteEff: 92,
        waterEff: 76,
        binsToCollect: 31,
        binFill: 42,
        co2: 24.1,
      }));
    });

    schedule(36500, () => {
      setDemoStep(7);
      setMetrics((m) => ({ ...m, sustainability: 88 }));
      pushNotification({
        kind: "success",
        title: "AI intervention complete",
        body: "CO₂ ↓12% · Traffic ↓16% · Energy ↓18%",
        target: "sustainability",
      });
      pushToast({ kind: "success", title: "AI intervention complete", body: "Sustainability score 78 → 88." });
    });

    schedule(48000, () => {
      setDemoRunning(false);
      setDemoStep(-1);
    });
  }, [pushNotification, pushToast]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const go = useCallback((s: SectionId) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      section,
      go,
      metrics,
      history,
      live,
      setLive,
      tick,
      lastUpdate,
      notifications,
      pushNotification,
      markAllRead,
      markRead,
      clearNotifications,
      toasts,
      pushToast,
      dismissToast,
      applied,
      applyAction,
      resetCity,
      demoRunning,
      demoStep,
      demoSteps: DEMO_STEPS,
      startDemo,
      stopDemo,
      chatOpen,
      setChatOpen,
      focusMarker,
      setFocusMarker,
    }),
    [
      section,
      go,
      metrics,
      history,
      live,
      tick,
      lastUpdate,
      notifications,
      pushNotification,
      markAllRead,
      markRead,
      clearNotifications,
      toasts,
      pushToast,
      dismissToast,
      applied,
      applyAction,
      resetCity,
      demoRunning,
      demoStep,
      startDemo,
      stopDemo,
      chatOpen,
      focusMarker,
    ],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used inside CityProvider");
  return ctx;
}
