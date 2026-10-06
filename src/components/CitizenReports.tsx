import { useState } from "react";
import {
  BadgeCheck,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  ImagePlus,
  Loader2,
  MessageSquarePlus,
  Timer,
} from "lucide-react";
import { REPORTS, type CitizenReport } from "../data/city";
import { useCity } from "../store/CityStore";
import { AnimatedNumber, Badge, Button, DemoTag, Modal, Panel, SectionHeader } from "./ui";
import { cn } from "../utils/cn";

const PRIORITY_TONE: Record<string, string> = { HIGH: "red", MEDIUM: "amber", LOW: "cyan" };
const STATUS_TONE: Record<string, string> = {
  Pending: "amber",
  "In Progress": "cyan",
  Resolved: "eco",
};

const ISSUE_TYPES = [
  "Garbage Overflow",
  "Water Leakage",
  "Broken Street Light",
  "Air Pollution",
  "Traffic Signal Fault",
  "Illegal Dumping",
];

const CLASSIFY: Record<string, { dept: string; priority: "HIGH" | "MEDIUM" | "LOW"; icon: string }> = {
  "Garbage Overflow": { dept: "Waste Management", priority: "HIGH", icon: "🗑" },
  "Water Leakage": { dept: "Water Board", priority: "MEDIUM", icon: "💧" },
  "Broken Street Light": { dept: "Electrical Works", priority: "LOW", icon: "💡" },
  "Air Pollution": { dept: "Pollution Control", priority: "HIGH", icon: "🌫" },
  "Traffic Signal Fault": { dept: "Traffic Police", priority: "HIGH", icon: "🚦" },
  "Illegal Dumping": { dept: "Sanitation", priority: "MEDIUM", icon: "🚧" },
};

function ReportCard({ r, onOpen, delay = 0 }: { r: CitizenReport; onOpen: () => void; delay?: number }) {
  return (
    <button
      onClick={onOpen}
      style={{ animationDelay: `${delay}ms` }}
      className="group animate-fade-up w-full rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-eco-500/30 hover:bg-white/[0.045] hover:shadow-[0_18px_40px_-28px_rgba(16,185,129,0.8)]"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-base transition-transform duration-300 group-hover:scale-110">
          {r.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13.5px] font-medium text-white">{r.type}</span>
            <Badge tone={PRIORITY_TONE[r.priority]}>{r.priority}</Badge>
            {r.ai && (
              <Badge tone="eco" icon={<Bot className="h-3 w-3" />}>
                AI detected
              </Badge>
            )}
          </div>
          <div className="mt-0.5 text-[11.5px] text-slate-500">{r.zone}</div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
            <span className="num">{r.id}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {r.time}
            </span>
            <Badge tone={STATUS_TONE[r.status]} className="ml-auto">
              {r.status}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CitizenReports() {
  const { pushToast, pushNotification } = useCity();
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<CitizenReport | null>(null);
  const [phase, setPhase] = useState<"form" | "thinking" | "done">("form");
  const [type, setType] = useState(ISSUE_TYPES[0]);
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [ticket, setTicket] = useState("#EC10283");
  const [filter, setFilter] = useState<"All" | "Pending" | "In Progress" | "Resolved">("All");

  const list = REPORTS.filter((r) => filter === "All" || r.status === filter);

  const submit = () => {
    setPhase("thinking");
    setTicket(`#EC${10284 + Math.floor(Math.random() * 90)}`);
    window.setTimeout(() => {
      setPhase("done");
      pushToast({ kind: "success", title: "Report logged", body: `Routed to ${CLASSIFY[type].dept}.` });
      pushNotification({
        kind: "info",
        title: `New citizen report · ${type}`,
        body: `${location || "Zone 4"} · auto-assigned to ${CLASSIFY[type].dept}`,
        target: "reports",
      });
    }, 2400);
  };

  const closeForm = () => {
    setFormOpen(false);
    window.setTimeout(() => {
      setPhase("form");
      setLocation("");
      setDesc("");
      setImg(null);
    }, 250);
  };

  const stats = [
    { label: "Total Reports", value: 1842, icon: FileText, tone: "text-cyan-300", d: 0, suffix: "" },
    { label: "Resolved", value: 1621, icon: CheckCircle2, tone: "text-eco-300", d: 0, suffix: "" },
    { label: "Pending", value: 221, icon: Clock, tone: "text-amber-300", d: 0, suffix: "" },
    { label: "Avg Response Time", value: 3.2, icon: Timer, tone: "text-slate-200", d: 1, suffix: " hrs" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Panel
            key={s.label}
            hover
            className="p-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <s.icon className={cn("mb-2 h-4 w-4", s.tone)} />
            <div className="flex items-baseline">
              <AnimatedNumber
                value={s.value}
                decimals={s.d}
                className="text-2xl font-semibold text-white"
              />
              <span className="text-xs text-slate-500">{s.suffix}</span>
            </div>
            <div className="mt-0.5 text-[11.5px] text-slate-500">{s.label}</div>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <SectionHeader
          eyebrow="Community"
          title="Citizen Reports"
          subtitle="Every report is auto-classified, prioritised and routed by the AI triage model."
          right={
            <div className="flex items-center gap-2">
              <DemoTag />
              <Button size="sm" variant="primary" onClick={() => setFormOpen(true)}>
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Report an Issue
              </Button>
            </div>
          }
        />

        <div className="mb-3.5 flex gap-1.5 overflow-x-auto">
          {(["All", "Pending", "In Progress", "Resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11.5px] font-medium transition-all",
                filter === f
                  ? "border-eco-500/40 bg-eco-500/15 text-eco-300"
                  : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/15 hover:text-slate-200",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div key={filter} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((r, i) => (
            <ReportCard key={r.id} r={r} delay={i * 60} onOpen={() => setDetail(r)} />
          ))}
        </div>
        {list.length === 0 && (
          <div className="animate-fade-in rounded-xl border border-dashed border-white/10 py-12 text-center">
            <p className="text-sm text-slate-400">No reports in this category.</p>
          </div>
        )}
      </Panel>

      {/* detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)}>
        {detail && (
          <div>
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-xl">
                {detail.icon}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{detail.type}</h3>
                <p className="text-[12px] text-slate-500">
                  {detail.zone} · reported {detail.time}
                </p>
              </div>
              <Badge tone={PRIORITY_TONE[detail.priority]}>{detail.priority}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                ["Ticket", detail.id],
                ["Status", detail.status],
                ["Department", detail.dept],
                ["Channel", detail.ai ? "AI sensor fusion" : "Mobile app"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">{k}</div>
                  <div className="num text-[12.5px] font-medium text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-3.5">
              <div className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold text-cyan-300">
                <Bot className="h-3.5 w-3.5" /> AI note
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-300">{detail.note}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  pushToast({ kind: "success", title: "Crew notified", body: `${detail.dept} acknowledged ${detail.id}.` });
                  setDetail(null);
                }}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                Acknowledge & assign
              </Button>
              <Button variant="ghost" onClick={() => setDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* report form */}
      <Modal open={formOpen} onClose={closeForm}>
        {phase === "form" && (
          <div>
            <h3 className="text-lg font-semibold text-white">Report an Issue</h3>
            <p className="mt-1 text-[12.5px] text-slate-500">
              Demo interaction — nothing is sent to a real municipal system.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-slate-500">
                  Issue Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-eco-500/50"
                >
                  {ISSUE_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-ink-850">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-slate-500">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Zone 4 · Central Market"
                  className="w-full rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-[13px] text-white placeholder:text-slate-600 outline-none transition-colors focus:border-eco-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe what you observed…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-[13px] text-white placeholder:text-slate-600 outline-none transition-colors focus:border-eco-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-slate-500">
                  Upload Image
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-3 py-3 transition-colors hover:border-eco-500/35">
                  <ImagePlus className="h-4 w-4 text-slate-500" />
                  <span className="text-[12.5px] text-slate-400">
                    {img ? "Image attached" : "Attach a photo (optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImg(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
                {img && <div className="mt-1.5 truncate text-[11px] text-eco-300">📎 {img}</div>}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="primary" onClick={submit}>
                Submit report
              </Button>
              <Button variant="ghost" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {phase === "thinking" && (
          <div className="py-8 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-eco-500/20" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-eco-500/30 bg-eco-500/10">
                <Loader2 className="h-6 w-6 animate-spin text-eco-300" />
              </span>
            </div>
            <div className="text-[15px] font-semibold text-white">AI is analysing the report…</div>
            <div className="mt-3 space-y-1.5 text-[12px] text-slate-500">
              {["Reading description & image metadata", "Matching nearby sensor signals", "Scoring urgency & routing"].map(
                (s, i) => (
                  <div key={s} className="animate-fade-up" style={{ animationDelay: `${i * 500}ms` }}>
                    {s}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-eco-500/30 bg-eco-500/10">
                <CheckCircle2 className="h-4.5 w-4.5 text-eco-300" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-white">Report classified</h3>
                <p className="text-[11.5px] text-slate-500">Processed in 1.9 s by the triage model.</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                ["AI Classification", `${CLASSIFY[type].icon} ${type}`],
                ["Priority", CLASSIFY[type].priority],
                ["Assigned Department", CLASSIFY[type].dept],
                ["Ticket", ticket],
                ["Location", location || "Zone 4 · auto-detected"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5"
                >
                  <span className="text-[12px] text-slate-500">{k}</span>
                  <span className="num text-[13px] font-semibold text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-3.5 text-[12.5px] leading-relaxed text-slate-300">
              {desc
                ? `Your description matched ${CLASSIFY[type].priority === "HIGH" ? "3" : "1"} nearby sensor signal(s), raising confidence to ${CLASSIFY[type].priority === "HIGH" ? "94" : "81"}%.`
                : "No description supplied — classification derived from issue type and zone history."}
            </div>

            <Button variant="primary" className="mt-5 w-full" onClick={closeForm}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
