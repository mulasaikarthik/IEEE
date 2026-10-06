import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { AnimatedNumber, Panel, Sparkline } from "./ui";
import { cn } from "../utils/cn";

export interface KPIProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trend?: number;
  trendNote?: string;
  statusLabel: string;
  tone: "eco" | "cyan" | "amber" | "red";
  data: number[];
  delay?: number;
  onClick?: () => void;
  linkLabel?: string;
}

const TONE: Record<string, { hex: string; text: string; bg: string; ring: string }> = {
  eco: { hex: "#34d399", text: "text-eco-300", bg: "bg-eco-500/10", ring: "border-eco-500/25" },
  cyan: { hex: "#22d3ee", text: "text-cyan-300", bg: "bg-cyan-500/10", ring: "border-cyan-500/25" },
  amber: { hex: "#fbbf24", text: "text-amber-300", bg: "bg-amber-500/10", ring: "border-amber-500/25" },
  red: { hex: "#f87171", text: "text-red-300", bg: "bg-red-500/10", ring: "border-red-500/25" },
};

export default function KPICard({
  icon: Icon,
  label,
  value,
  suffix,
  prefix,
  decimals = 0,
  trend,
  trendNote,
  statusLabel,
  tone,
  data,
  delay = 0,
  onClick,
  linkLabel,
}: KPIProps) {
  const t = TONE[tone];
  const up = (trend ?? 0) >= 0;
  return (
    <Panel
      hover
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative overflow-hidden p-4 animate-fade-up",
        onClick &&
          "cursor-pointer outline-none focus-visible:border-eco-500/50 focus-visible:ring-2 focus-visible:ring-eco-500/30",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: t.hex }}
      />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", t.bg, t.ring)}>
          <Icon className={cn("h-4 w-4", t.text)} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.hex }} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="relative mt-3.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-slate-500">
        {label}
      </div>

      <div className="relative mt-1 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <AnimatedNumber
            value={value}
            decimals={decimals}
            prefix={prefix}
            className="text-[1.75rem] font-semibold leading-none tracking-tight text-white"
          />
          {suffix && <span className="text-xs font-medium text-slate-500">{suffix}</span>}
        </div>
        <Sparkline data={data} color={t.hex} width={84} height={30} />
      </div>

      <div className="relative mt-2.5 flex items-center gap-1.5">
        {typeof trend === "number" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
              up ? "bg-eco-500/12 text-eco-300" : "bg-red-500/12 text-red-300",
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        <span className="truncate text-[11px] text-slate-500">{trendNote}</span>
      </div>

      {onClick && (
        <div className="relative mt-2 flex items-center gap-0.5 text-[10.5px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-eco-300">
          {linkLabel ?? "View details"}
          <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      )}
    </Panel>
  );
}
