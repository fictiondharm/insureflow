"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote: "Flight was delayed 4 hours. By the time I landed, the payout was already in my wallet. Unreal.",
    author: "Alex Chen",
    role: "Frequent Traveler",
    color: "text-coral",
  },
  {
    quote: "Our outdoor wedding got rained out — but the insurance paid for the tent upgrade automatically. Lifesaver.",
    author: "Sarah & Mike",
    role: "Event Organizers",
    color: "text-jade",
  },
  {
    quote: "Been using traditional shipping insurance for years. This is faster, cheaper, and actually pays out.",
    author: "David Park",
    role: "E-commerce Owner",
    color: "text-amber",
  },
];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function Testimonials() {
  const mounted = useMounted();

  return (
    <section className="section-pad bg-paper border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-12 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-amber" />
            <span className="text-eyebrow">Testimonials</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-ink mb-4">
            From the <span className="italic text-amber">community</span>
          </h2>
          <p className="text-muted text-sm">
            Real people. Real payouts. No filter.
          </p>
        </div>

        {/* Quote cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`bg-white border border-border p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm opacity-0 ${mounted ? "animate-fade-up" : ""}`}
              style={mounted ? { animationDelay: `${0.1 + idx * 0.1}s` } : {}}
            >
              <div className={`text-6xl font-serif leading-none mb-2 ${t.color} opacity-20 select-none`} aria-hidden="true">
                &ldquo;
              </div>
              <p className="text-base text-ink leading-relaxed mb-8 flex-1 italic">
                {t.quote}
              </p>
              <div className="h-px bg-gradient-to-r from-amber/30 to-transparent mb-4" />
              <div>
                <p className="text-sm font-bold text-ink">{t.author}</p>
                <p className="text-[10px] text-muted uppercase tracking-[0.08em]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
