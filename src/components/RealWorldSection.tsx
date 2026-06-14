"use client";

import { useEffect, useState } from "react";
import { Plane, Building2, Train, ShoppingCart, Zap, FileText, Users, Blocks, Wallet } from "lucide-react";

const embedScenarios = [
  {
    icon: Plane,
    title: "Airline Checkout",
    desc: "Turkish Airlines × XCover, KLM × Allianz — airlines already sell insurance at booking. We make it parametric, instant, and embeddable.",
    stat: "$4.2B annual insurance at airline checkout",
    accent: "text-coral",
    animClass: "animate-fly-contained",
  },
  {
    icon: Building2,
    title: "Airbnb Bookings",
    desc: "Airbnb partners with Generali for travel insurance. Rain events aren't covered — we fill the gap. 150M+ bookings/year.",
    stat: "150M+ Airbnb bookings/year",
    accent: "text-jade",
    animClass: "animate-bob-contained",
  },
  {
    icon: Train,
    title: "IRCTC E-Tickets",
    desc: "IRCTC sells ₹0.45 accident insurance at train booking through SBI General. Millions of policies/year. Add delay + weather triggers at checkout.",
    stat: "₹0.45 per ticket — micro-insurance at scale",
    accent: "text-amber",
    animClass: "animate-rock-contained",
  },
  {
    icon: ShoppingCart,
    title: "Shopify Checkout",
    desc: "No good micro-delay cover exists for Shopify orders. Embed shipping delay protection at checkout. A $1B+ gap waiting to be filled.",
    stat: "$1B+ untapped ecommerce delay market",
    accent: "text-ink",
    animClass: "animate-bob-contained",
  },
];

const comparisonItems = [
  { label: "Claims", traditional: "Submit forms, wait weeks", parametric: "Automatic on-chain trigger" },
  { label: "Payout", traditional: "2-6 weeks after filing", parametric: "< 5 seconds after trigger" },
  { label: "Overhead", traditional: "40-60% eaten by adjusters", parametric: "20% flat protocol fee" },
  { label: "Integration", traditional: "Months of legal + contracts", parametric: "1 day — widget + API" },
];

const winColumns = [
  { icon: Users, title: "Users", items: ["Get covered in 1 click at checkout", "Paid instantly when trigger fires", "No forms, no adjusters, no wait", "Cheaper premiums (lower overhead)"] },
  { icon: Blocks, title: "Platforms", items: ["Insurance revenue with 1 embed", "Zero compliance burden", "Better CX = higher conversion", "Revenue share from every policy"] },
  { icon: Wallet, title: "InsureFlow", items: ["20% protocol fee on every premium", "70% goes to LP pool", "10% to reserves", "Aligned to grow volume, not deny claims"] },
];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function RealWorldSection() {
  const mounted = useMounted();

  return (
    <section className="section-pad bg-paper border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-14 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-coral" />
            <span className="text-eyebrow">Real World</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-ink mb-4">
            Built for<br />
            <span className="italic text-coral">existing channels</span>
          </h2>
          <p className="text-muted text-sm">
            Insurance at checkout already exists — airlines, travel platforms, and e-ticket vendors sell it every day. We make it parametric, instant, and embeddable.
          </p>
        </div>

        {/* Scenarios */}
        <div className="grid sm:grid-cols-2 gap-5 mb-20">
          {embedScenarios.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`bg-white border border-border p-8 transition-all duration-300 hover:shadow-sm opacity-0 ${mounted ? "animate-fade-up" : ""}`}
                style={mounted ? { animationDelay: `${0.1 + idx * 0.08}s` } : {}}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 border border-border flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${s.accent} ${mounted ? s.animClass : ""}`} />
                  </div>
                  <span className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">Scenario 0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-ink mb-3">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4">{s.desc}</p>
                <div className="h-px bg-gradient-to-r from-amber/30 to-transparent mb-3" />
                <p className={`text-xs font-bold uppercase tracking-[0.08em] ${s.accent}`}>{s.stat}</p>
              </div>
            );
          })}
        </div>

        {/* Traditional vs Parametric */}
        <div className={`bg-white border border-border p-8 sm:p-10 mb-20 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.2s" } : {}}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-coral/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-coral" />
            </div>
            <h2 className="text-xl font-serif text-ink">Traditional vs Parametric</h2>
          </div>
          <div className="grid sm:grid-cols-4 gap-5">
            {comparisonItems.map((item) => (
              <div key={item.label} className="space-y-3">
                <p className="text-xs font-bold text-ink uppercase tracking-[0.1em]">{item.label}</p>
                <div className="space-y-3">
                  <div className="bg-coral/[0.06] border border-coral/20 p-3">
                    <div className="flex items-center gap-2 text-xs text-coral mb-1">
                      <FileText className="w-3 h-3" />
                      <span>Traditional</span>
                    </div>
                    <p className="text-sm text-ink/70">{item.traditional}</p>
                  </div>
                  <div className="bg-jade/[0.06] border border-jade/20 p-3">
                    <div className="flex items-center gap-2 text-xs text-jade mb-1">
                      <Zap className="w-3 h-3" />
                      <span>Parametric</span>
                    </div>
                    <p className="text-sm text-ink font-medium">{item.parametric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How we all win */}
        <div className={`opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.3s" } : {}}>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 border border-jade/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-jade" />
            </div>
            <h2 className="text-xl font-serif text-ink">How we all win</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {winColumns.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="bg-white border border-border p-8 transition-all duration-300 hover:shadow-sm">
                  <div className="w-12 h-12 border border-amber/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-amber" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-5">{col.title}</h3>
                  <ul className="space-y-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="w-1 h-1 bg-coral mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
