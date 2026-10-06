interface TipPayload {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
}

export function ChartTooltip(props: {
  active?: boolean;
  payload?: TipPayload[];
  label?: string | number;
  unit?: string;
}) {
  const { active, payload, label, unit = "" } = props;
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2 shadow-xl backdrop-blur">
      <div className="mb-1 text-[10.5px] uppercase tracking-wider text-slate-500">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[11.5px] capitalize text-slate-400">{String(p.name ?? p.dataKey)}</span>
          <span className="num ml-auto text-[12px] font-semibold text-white">
            {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

export const axisProps = {
  stroke: "#334155",
  tick: { fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono, monospace" },
  tickLine: false,
  axisLine: false,
} as const;
