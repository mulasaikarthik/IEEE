import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { CHAT_ANSWERS, CHAT_FALLBACK, CHAT_SUGGESTIONS } from "../data/city";
import { useCity } from "../store/CityStore";
import { Badge, DemoTag } from "./ui";
import { cn } from "../utils/cn";

interface Msg {
  role: "user" | "ai";
  text: string;
  bullets?: string[];
}

function answerFor(q: string) {
  const lower = q.toLowerCase();
  let best: (typeof CHAT_ANSWERS)[number] | null = null;
  let bestScore = 0;
  for (const a of CHAT_ANSWERS) {
    const score = a.match.reduce((acc, m) => acc + (lower.includes(m) ? m.length : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best ?? CHAT_FALLBACK;
}

export default function AIChat() {
  const { chatOpen, setChatOpen, metrics, demoRunning } = useCity();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hello Administrator. I'm monitoring 4,820 simulated nodes across 7 zones. Ask me anything about the city's current state.",
      bullets: ["Zone 4 is currently the highest-priority area", "Sustainability score is trending upward"],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const a = answerFor(q);
      setTyping(false);
      setMsgs((m) => [...m, { role: "ai", text: a.answer, bullets: a.bullets }]);
    }, 1200);
  };

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={cn(
          "fixed right-4 z-[60] flex items-center justify-center rounded-2xl border border-eco-500/35 bg-ink-900 shadow-[0_12px_40px_-12px_rgba(16,185,129,0.8)] transition-all duration-300 hover:scale-105 lg:right-6",
          demoRunning ? "bottom-56 lg:bottom-32" : "bottom-20 lg:bottom-6",
          chatOpen && "opacity-0 pointer-events-none",
        )}
        style={{ height: 52, width: 52 }}
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 rounded-2xl bg-eco-500/10" />
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eco-400/80" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-eco-400" />
        </span>
        <Bot className="relative h-6 w-6 text-eco-300" />
      </button>

      {chatOpen && (
        <div className="fixed bottom-0 right-0 z-[65] flex h-[78vh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-ink-900/95 backdrop-blur-xl animate-slide-left sm:bottom-4 sm:right-4 sm:h-[560px] sm:w-[390px] sm:rounded-2xl">
          <div className="flex items-center gap-2.5 border-b border-white/[0.07] bg-gradient-to-r from-eco-500/10 to-transparent px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-eco-500/30 bg-eco-500/10">
              <Bot className="h-4.5 w-4.5 text-eco-300" />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-white">Ask EcoCity AI</div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-eco-400" />
                Online · simulated reasoning engine
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-2">
            <Badge tone="eco">AQI {metrics.aqi.toFixed(0)}</Badge>
            <Badge tone="amber">Traffic {metrics.traffic.toFixed(0)}%</Badge>
            <Badge tone="cyan">Score {metrics.sustainability.toFixed(0)}</Badge>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn("flex animate-fade-up", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-eco-500/15 text-eco-50"
                      : "rounded-bl-md border border-white/[0.07] bg-white/[0.03] text-slate-200",
                  )}
                >
                  {m.text}
                  {m.bullets && (
                    <ul className="mt-2 space-y-1">
                      {m.bullets.map((b) => (
                        <li key={b} className="flex gap-1.5 text-[11.5px] text-slate-400">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-eco-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="dot-think h-1.5 w-1.5 rounded-full bg-eco-400"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/[0.07] px-3 py-2.5">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {CHAT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="whitespace-nowrap rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-400 transition-colors hover:border-eco-500/30 hover:text-eco-200"
                >
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any zone, metric or action…"
                className="flex-1 rounded-xl border border-white/10 bg-ink-850 px-3 py-2.5 text-[12.5px] text-white placeholder:text-slate-600 outline-none transition-colors focus:border-eco-500/50"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-eco-500 text-ink-950 transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-1.5 text-center">
              <DemoTag text="Predefined demo responses" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
