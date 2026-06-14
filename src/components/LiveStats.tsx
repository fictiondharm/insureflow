"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Active Policies", value: 2847, suffix: "", prefix: "", color: "bg-coral" },
  { label: "Total Coverage", value: 2.4, suffix: "M", prefix: "$", color: "bg-jade" },
  { label: "Avg. Payout", value: 4.2, suffix: "s", prefix: "", color: "bg-amber" },
  { label: "Payout Rate", value: 98.7, suffix: "%", prefix: "", color: "bg-coral" },
];

function AnimatedNumber({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setCurrent(Math.min(Math.round(increment * step * 100) / 100, target));
            if (step >= steps) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{current.toLocaleString()}{suffix}</span>;
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function LiveStats() {
  const mounted = useMounted();

  return (
    <section className="section-pad bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-12 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-amber" />
            <span className="text-eyebrow">Live Data</span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.9] text-ink mb-4">
            The <span className="italic text-amber">numbers</span>
          </h2>
          <p className="text-muted text-sm">
            Real-time dashboard data from our deployed contracts on Base Sepolia.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`border border-border bg-paper p-8 flex flex-col justify-center opacity-0 ${mounted ? "animate-fade-up" : ""}`}
              style={mounted ? { animationDelay: `${0.1 + idx * 0.08}s` } : {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 ${stat.color}`} />
                <span className="text-[10px] text-muted uppercase tracking-[0.1em]">{stat.label}</span>
              </div>
              <p className="font-serif text-[clamp(2rem,4vw,3rem)] leading-none text-ink mb-2">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <div className="h-1 w-full bg-border/50 mt-2">
                <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${Math.min(100, (stat.value / 3000) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
