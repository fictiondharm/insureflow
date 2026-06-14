"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlightCardIllus, RainCardIllus, ShippingCardIllus } from "@/components/illustrations/ProductCardIllustrations";

const accentRgb: Record<string, string> = {
  coral: "232, 93, 58",
  jade: "42, 157, 143",
  amber: "233, 196, 106",
};

const products = [
  {
    id: "flight",
    title: "Flight Delay",
    subtitle: "Delayed? Get paid. No questions.",
    desc: "Your flight is delayed 2+ hours. You get paid automatically. No forms, no queues, no fighting with airlines.",
    features: ["2hr delay threshold", "Any airline, global", "Instant payout on trigger"],
    price: "$12.50",
    accent: "text-coral",
    accentName: "coral",
    border: "border-coral/20",
    bg: "bg-coral/[0.02]",
    Illus: FlightCardIllus,
  },
  {
    id: "rain",
    title: "Rain Event",
    subtitle: "Downpour? Your payout starts.",
    desc: "Set your rain threshold for outdoor events. If the gauge hits it, the contract pays. No weatherman needed.",
    price: "$8.20",
    accent: "text-jade",
    accentName: "jade",
    border: "border-jade/20",
    bg: "bg-jade/[0.02]",
    Illus: RainCardIllus,
    features: ["Custom mm threshold", "Weather oracle verified", "24h before event cover"],
  },
  {
    id: "shipping",
    title: "Shipping Delay",
    subtitle: "Late cargo. Auto pay.",
    desc: "Port congestion, customs delays, carrier issues — if it's late, the LP pool pays. Settles in seconds.",
    price: "$24.00",
    accent: "text-amber",
    accentName: "amber",
    border: "border-amber/20",
    bg: "bg-amber/[0.02]",
    Illus: ShippingCardIllus,
    features: ["Port-to-port tracking", "Multi-carrier support", "Settles in seconds"],
  },
];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function ProductGrid() {
  const mounted = useMounted();

  return (
    <section id="products" className="section-pad bg-paper">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`mb-4 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-coral" />
            <span className="text-eyebrow">Coverage Products</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-ink mb-4">
            Choose your<br />
            <span className="italic text-coral">protection</span>
          </h2>
          <p className="text-muted text-sm">
            Three parametric products for real-world events. Pick your coverage, pay the premium, and rest easy. When the trigger hits, the payout flows.
          </p>
        </div>

        {/* Product cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const Illus = product.Illus;
            return (
              <div
                key={product.id}
                className={`bg-white border border-border transition-all duration-300 hover:-translate-y-0.5 group opacity-0 ${mounted ? "animate-fade-up" : ""}`}
                style={{
                  animationDelay: `${0.1 + idx * 0.12}s`,
                  transitionProperty: "all",
                  transitionDuration: "300ms",
                }}
                onMouseEnter={(e) => {
                  const rgb = accentRgb[product.accentName];
                  const card = e.currentTarget;
                  card.style.borderColor = `rgba(${rgb}, 0.3)`;
                  card.style.boxShadow = `0 10px 40px -12px rgba(${rgb}, 0.15)`;
                  const items = card.querySelectorAll("[data-accent]") as NodeListOf<HTMLElement>;
                  items.forEach((el) => (el.style.color = `rgba(${rgb}, 1)`));
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.borderColor = "";
                  card.style.boxShadow = "";
                  const items = card.querySelectorAll("[data-accent]") as NodeListOf<HTMLElement>;
                  items.forEach((el) => (el.style.color = ""));
                }}
              >
                <Link href={`/buy/${product.id}`} className="block h-full flex flex-col">
                  {/* Illustration */}
                  <div className={`h-44 ${product.bg} border-b border-border relative overflow-hidden`}>
                    <div className="absolute inset-0">
                      <Illus />
                    </div>
                    <div className="absolute top-3 right-3 bg-white border border-border px-3 py-1.5">
                      <p className="text-[10px] text-muted uppercase tracking-[0.08em]">From</p>
                      <p className={`text-base font-serif ${product.accent}`}>{product.price}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-5 h-px bg-border" />
                      <span className="text-[10px] text-muted uppercase tracking-[0.1em] font-semibold">0{idx + 1}</span>
                    </div>
                    <h3 className="text-xl font-serif text-ink mb-1">{product.title}</h3>
                    <p className={`text-sm font-medium ${product.accent} mb-3`}>{product.subtitle}</p>
                    <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{product.desc}</p>

                    <ul className="space-y-2 mb-5">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted">
                          <span className={`w-1 h-1 ${product.accent.replace("text-", "bg-")}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span data-accent className="flex items-center gap-1 text-xs font-medium text-muted transition-colors duration-200">
                        <span>Get covered</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span data-accent className="text-xs text-muted transition-colors duration-200">View details →</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
