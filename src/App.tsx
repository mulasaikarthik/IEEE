import { useEffect, useState } from "react";
import { CityProvider, useCity } from "./store/CityStore";
import Intro from "./components/Intro";
import Landing from "./components/Landing";
import Sidebar, { MobileNav } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import CityMap from "./components/CityMap";
import Sustainability from "./components/Sustainability";
import { AdvisorPage } from "./components/AIAdvisor";
import CitizenReports from "./components/CitizenReports";
import FutureSimulator from "./components/FutureSimulator";
import AIChat from "./components/AIChat";
import Toasts from "./components/Toasts";
import DemoOverlay from "./components/DemoOverlay";
import Footer from "./components/Footer";
import Reveal from "./components/Reveal";
import WastePanel from "./components/WastePanel";
import AirPanel from "./components/AirPanel";
import { DemoTag, Panel } from "./components/ui";

function MapSection() {
  return (
    <div className="space-y-5">
      <CityMap />
      <Reveal className="grid gap-5 xl:grid-cols-2">
        <AirPanel />
        <Panel className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-eco-400/80">Node registry</div>
              <h3 className="mt-1 text-lg font-semibold text-white">What the network measures</h3>
            </div>
            <DemoTag />
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              ["🗑", "Smart Waste Bins", "1,284 units · ultrasonic fill sensors"],
              ["💡", "Smart Street Lights", "4,820 lamps · adaptive dimming"],
              ["🌫", "Air Quality Stations", "32 stations · PM, NO₂, CO₂"],
              ["💧", "Water Monitoring", "148 segments · flow & pressure"],
              ["🚦", "Traffic Junctions", "214 junctions · adaptive signals"],
              ["🔋", "EV Charging Hubs", "68 hubs · 412 ports"],
              ["🌳", "Green Zones", "26 zones · canopy & soil moisture"],
              ["🚌", "Public Transport", "312 vehicles · live occupancy"],
            ].map(([icon, title, sub]) => (
              <div
                key={title}
                className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
              >
                <span className="text-base">{icon}</span>
                <div>
                  <div className="text-[12.5px] font-medium text-white">{title}</div>
                  <div className="text-[11px] text-slate-500">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Reveal>
      <Reveal>
        <WastePanel />
      </Reveal>
    </div>
  );
}

function Shell({ onExit }: { onExit: () => void }) {
  const { section } = useCity();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-[0.55]" />
      <div className="pointer-events-none fixed -left-40 top-0 h-[460px] w-[460px] rounded-full bg-eco-500/[0.06] blur-[140px]" />
      <div className="pointer-events-none fixed -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.05] blur-[140px]" />

      <Sidebar
        mobileOpen={navOpen}
        onCloseMobile={() => setNavOpen(false)}
        onExit={() => {
          setNavOpen(false);
          onExit();
        }}
      />

      <div className="relative lg:pl-[248px]">
        <Topbar onOpenMobileNav={() => setNavOpen(true)} />
        <main key={section} className="animate-page px-4 pb-28 pt-5 sm:px-6 lg:pb-10">
          {section === "dashboard" && <Dashboard />}
          {section === "map" && <MapSection />}
          {section === "sustainability" && <Sustainability />}
          {section === "advisor" && <AdvisorPage />}
          {section === "reports" && <CitizenReports />}
          {section === "simulator" && <FutureSimulator />}
          <Footer />
        </main>
      </div>

      <MobileNav />
      <AIChat />
      <Toasts />
      <DemoOverlay />
    </div>
  );
}

type Screen = "intro" | "landing" | "app";

function Root() {
  const { startDemo, stopDemo, setChatOpen } = useCity();
  const [screen, setScreen] = useState<Screen>("intro");
  const [pendingDemo, setPendingDemo] = useState(false);

  useEffect(() => {
    if (screen === "app" && pendingDemo) {
      const h = window.setTimeout(() => {
        startDemo();
        setPendingDemo(false);
      }, 600);
      return () => window.clearTimeout(h);
    }
  }, [screen, pendingDemo, startDemo]);

  if (screen === "intro") {
    return <Intro onDone={() => setScreen("landing")} />;
  }

  if (screen === "landing") {
    return (
      <div className="animate-blur-in">
        <Landing
          onEnter={() => setScreen("app")}
          onDemo={() => {
            setPendingDemo(true);
            setScreen("app");
          }}
          onReplayIntro={() => setScreen("intro")}
        />
      </div>
    );
  }

  return (
    <div className="animate-page">
      <Shell
        onExit={() => {
          stopDemo();
          setChatOpen(false);
          setScreen("landing");
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <CityProvider>
      <Root />
    </CityProvider>
  );
}
