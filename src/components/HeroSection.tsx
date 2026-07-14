"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PremiumCalculator from "@/components/PremiumCalculator";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function HeroSection() {
  const mounted = useMounted();

  const stats = [
    { value: "$2.4M+", label: "Active Coverage" },
    { value: "< 1s", label: "Avg. Payout" },
    { value: "98.7%", label: "Payout Rate" },
    { value: "1,250+", label: "Users" },
  ];

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 overflow-hidden bg-paper">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-30" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-coral/[0.04] to-transparent" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-jade/[0.03] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 min-h-[calc(100vh-8rem)] pt-8">
          {/* Left */}
          <div className="lg:w-1/2 space-y-8 lg:pt-12">
            <div className={`flex items-center gap-3 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
              <span className="w-6 h-px bg-coral" />
              <span className="text-eyebrow tracking-[0.2em]">Parametric Insurance on Base</span>
            </div>

            <h1 className={`space-y-2 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.1s" } : {}}>
              <span className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.85] block text-ink">
                Insurance
              </span>
              <span className="font-serif text-[clamp(2rem,6vw,4.5rem)] leading-[0.9] block italic text-coral">
                that flows.
              </span>
            </h1>

            <div className={`h-px w-20 bg-coral/40 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.15s" } : {}} />

            <p className={`text-base sm:text-lg text-muted leading-relaxed max-w-lg font-[300] opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.2s" } : {}}>
              Flight delays, rain events, shipping disruptions — get paid automatically when life happens. No claims. No paperwork. No waiting.
            </p>

            <div className={`flex flex-wrap items-center gap-4 pt-2 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.3s" } : {}}>
              <Link
                href="/buy/flight"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-coral text-white font-bold text-sm uppercase tracking-[0.12em] transition-all duration-300 hover:bg-coral-deep active:scale-[0.97]"
              >
                <span>Get Covered</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 border border-ink/15 text-ink/80 font-semibold text-sm uppercase tracking-[0.12em] transition-all duration-300 hover:border-ink/30 hover:bg-white/50"
              >
                View Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-2 opacity-0 ${mounted ? "animate-fade-up" : ""}`}
                  style={mounted ? { animationDelay: `${0.5 + i * 0.1}s` } : {}}
                >
                  <span className="text-xl font-bold font-mono text-ink">{s.value}</span>
                  <span className="text-[10px] text-muted uppercase tracking-[0.08em]">{s.label}</span>
                  {i < stats.length - 1 && <span className="w-px h-4 bg-border ml-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Calculator */}
          <div
            className={`lg:w-1/2 flex justify-center lg:justify-end opacity-0 ${mounted ? "animate-fade-up" : ""}`}
            style={mounted ? { animationDelay: "0.25s" } : {}}
          >
            <div className="w-full max-w-xl lg:sticky lg:top-32">
              <PremiumCalculator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
