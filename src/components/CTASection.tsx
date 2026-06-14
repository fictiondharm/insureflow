"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function CTASection() {
  const mounted = useMounted();

  return (
    <section className="relative py-28 bg-ink overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-coral/[0.03] to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-jade/[0.02] to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 0.5px, transparent 0.5px)", backgroundSize: "16px 16px" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className={`flex justify-center mb-8 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="w-14 h-14 border border-white/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber" />
          </div>
        </div>

        <h2 className={`font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] text-white opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.1s" } : {}}>
          Ready for<br />
          <span className="italic text-coral">instant coverage</span>?
        </h2>

        <p className={`text-white/40 mt-6 leading-relaxed max-w-md mx-auto text-sm opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.2s" } : {}}>
          Join thousands who never worry about delays, rain, or disruptions. Your payout, automatically, the moment a trigger fires.
        </p>

        <div className={`flex flex-wrap justify-center gap-4 mt-10 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.3s" } : {}}>
          <Link
            href="/buy/flight"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-coral text-white font-bold uppercase tracking-[0.12em] text-sm transition-all duration-300 hover:bg-coral-deep active:scale-[0.97]"
          >
            <span>Get Covered Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2.5 px-8 py-4 border border-white/15 text-white/70 font-semibold uppercase tracking-[0.12em] text-sm transition-all duration-300 hover:border-white/30 hover:text-white"
          >
            View Dashboard
          </Link>
        </div>

        <div className={`mt-12 flex items-center justify-center gap-6 text-xs font-medium text-white/20 uppercase tracking-[0.1em] opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.4s" } : {}}>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-coral" />
            No paperwork
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-jade" />
            Instant payouts
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber" />
            Smart contract secured
          </span>
        </div>
      </div>
    </section>
  );
}
