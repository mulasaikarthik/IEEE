import { AlertTriangle, CheckCircle2, Info, Siren, X } from "lucide-react";
import { useCity, type NotifKind } from "../store/CityStore";

const STYLE: Record<NotifKind, { icon: typeof Info; cls: string; bar: string }> = {
  critical: { icon: Siren, cls: "text-red-300 border-red-500/30", bar: "bg-red-400" },
  warning: { icon: AlertTriangle, cls: "text-amber-300 border-amber-500/30", bar: "bg-amber-400" },
  info: { icon: Info, cls: "text-cyan-300 border-cyan-500/30", bar: "bg-cyan-400" },
  success: { icon: CheckCircle2, cls: "text-eco-300 border-eco-500/30", bar: "bg-eco-400" },
};

export default function Toasts() {
  const { toasts, dismissToast } = useCity();
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0">
      {toasts.map((t) => {
        const s = STYLE[t.kind];
        return (
          <div
            key={t.id}
            className={`panel pointer-events-auto relative flex gap-3 overflow-hidden rounded-xl border px-3.5 py-3 animate-slide-left ${s.cls}`}
          >
            <span className={`absolute inset-y-0 left-0 w-[3px] ${s.bar}`} />
            <s.icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-white">{t.title}</div>
              {t.body && <div className="mt-0.5 text-[11.5px] leading-snug text-slate-400">{t.body}</div>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
