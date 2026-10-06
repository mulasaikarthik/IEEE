import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

/* ---------------------------------- Panel --------------------------------- */

export function Panel({
  className,
  children,
  hover = false,
  ...rest
}: { className?: string; children: ReactNode; hover?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("panel rounded-2xl", hover && "panel-hover", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-eco-400/80">
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* --------------------------------- Badges --------------------------------- */

const TONES: Record<string, string> = {
  eco: "bg-eco-500/12 text-eco-300 border-eco-500/25",
  cyan: "bg-cyan-500/12 text-cyan-300 border-cyan-500/25",
  amber: "bg-amber-500/12 text-amber-300 border-amber-500/25",
  red: "bg-red-500/12 text-red-300 border-red-500/25",
  slate: "bg-white/5 text-slate-300 border-white/10",
  violet: "bg-violet-500/12 text-violet-300 border-violet-500/25",
};

export function Badge({
  tone = "slate",
  children,
  className,
  icon,
}: {
  tone?: keyof typeof TONES | string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        TONES[tone] ?? TONES.slate,
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function StatusDot({ color = "#34d399", pulse = true }: { color?: string; pulse?: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
          style={{ background: color }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

/* --------------------------------- Button --------------------------------- */

export function Button({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: "primary" | "ghost" | "outline" | "danger" | "cyan";
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary:
      "bg-eco-500 text-ink-950 hover:bg-eco-400 shadow-[0_8px_24px_-10px_rgba(16,185,129,0.9)] font-semibold",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/25",
    ghost: "bg-white/[0.04] text-slate-200 border border-white/10 hover:bg-white/[0.09] hover:border-white/20",
    outline: "bg-transparent text-eco-300 border border-eco-500/35 hover:bg-eco-500/10",
    danger: "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ----------------------------- Animated number ---------------------------- */

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 700,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    const a = current.current;
    const b = value;
    if (Math.abs(a - b) < 0.0001) return;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (b - a) * eased;
      current.current = v;
      setDisplay(v);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return (
    <span className={cn("num", className)}>
      {prefix}
      {display.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* -------------------------------- Sparkline ------------------------------- */

export function Sparkline({
  data,
  color = "#34d399",
  height = 34,
  width = 110,
  fill = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  fill?: boolean;
}) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 3 - ((d - min) / span) * (height - 7);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = `sg-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.3" fill={color} />
    </svg>
  );
}

/* ------------------------------- Radial gauge ------------------------------ */

export function Radial({
  value,
  max = 100,
  size = 120,
  stroke = 9,
  color = "#34d399",
  track = "rgba(255,255,255,0.07)",
  label,
  sub,
  decimals = 0,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sub?: string;
  decimals?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber
          value={value}
          decimals={decimals}
          className="text-[1.35rem] font-semibold leading-none text-white"
        />
        {label && <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</div>}
        {sub && <div className="text-[10px] text-slate-500">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------------------------------- Bars ---------------------------------- */

export function MeterBar({
  value,
  color = "#34d399",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

/* --------------------------------- Modal ---------------------------------- */

export function Modal({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "panel relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 animate-scale-in",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ Demo watermark ----------------------------- */

export function DemoTag({ className, text = "Simulated Data" }: { className?: string; text?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500",
        className,
      )}
    >
      {text}
    </span>
  );
}
