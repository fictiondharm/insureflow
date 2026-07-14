"use client";

import { useState, useEffect } from "react";
import { Plane, CloudRain, Package, ArrowRight, Calculator, Sparkles } from "lucide-react";
import Link from "next/link";

type Product = "flight" | "rain" | "shipping";

const products: Record<Product, {
  icon: typeof Plane; label: string; desc: string; amounts: number[];
  accent: string; border: string; bgRgb: string; animClass: string;
}> = {
  flight: {
    icon: Plane, label: "Flight Delay", desc: "4hr+ delay, instant payout",
    amounts: [50, 100, 200, 500],
    accent: "text-coral", border: "border-coral/30", bgRgb: "232, 93, 58",
    animClass: "animate-fly-contained",
  },
  rain: {
    icon: CloudRain, label: "Rain Event", desc: "Custom mm threshold",
    amounts: [250, 500, 1000, 2500],
    accent: "text-jade", border: "border-jade/30", bgRgb: "42, 157, 143",
    animClass: "animate-bob-contained",
  },
  shipping: {
    icon: Package, label: "Shipping Delay", desc: "Port-to-port tracking",
    amounts: [25, 50, 100, 250],
    accent: "text-amber", border: "border-amber/30", bgRgb: "233, 196, 106",
    animClass: "animate-rock-contained",
  },
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 700;
    const steps = 24;
    const inc = value / steps;
    let s = 0;
    const t = setInterval(() => {
      s++;
      setDisplay(Math.min(Math.round(inc * s * 100) / 100, value));
      if (s >= steps) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [value]);
  return <>{display.toFixed(2)}</>;
}

export default function PremiumCalculator() {
  const [product, setProduct] = useState<Product>("flight");
  const [coverage, setCoverage] = useState(0);
  const [custom, setCustom] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const meta = products[product];
  const Icon = meta.icon;
  const finalCoverage = custom ? Number(custom) : coverage;
  const premium = finalCoverage * 0.25;
  const hasValue = finalCoverage > 0;

  const pickAmount = (amt: number) => {
    setCoverage(amt);
    setCustom("");
    setAnimKey((k) => k + 1);
  };

  const handleCustom = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setCustom(num);
    if (num) { setCoverage(0); setAnimKey((k) => k + 1); }
  };

  return (
    <div
      className="w-full border border-border transition-all duration-400 hover:shadow-lg hover:shadow-coral/8 hover:border-coral/20"
      style={{ backgroundColor: `rgba(${meta.bgRgb}, 0.03)` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-border">
        <div className="w-11 h-11 border border-muted/20 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-muted" />
        </div>
        <div>
          <h3 className="font-serif text-lg text-ink">Premium Calculator</h3>
          <p className="text-sm text-muted">See what you&apos;d pay</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Product selector */}
        <div>
          <p className="text-eyebrow mb-2.5">Product type</p>
          <div className="flex gap-1 bg-paper border border-border p-1">
            {(Object.keys(products) as Product[]).map((key) => {
              const PIcon = products[key].icon;
              const sel = product === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setProduct(key); setCoverage(0); setCustom(""); }}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 text-sm font-medium transition-all duration-200 ${
                    sel
                      ? "bg-white border border-border text-ink shadow-sm"
                      : "text-muted hover:text-ink border border-transparent"
                  }`}
                >
                  <PIcon className={`w-5 h-5 ${sel ? `${products[key].accent} ${products[key].animClass}` : ""}`} />
                  <span className="text-xs leading-tight">{products[key].label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product info */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 flex items-center justify-center border ${meta.border}`}>
            <Icon className={`w-5 h-5 ${meta.accent} ${meta.animClass}`} />
          </div>
          <div>
            <p className="font-serif text-lg text-ink">{meta.label}</p>
            <p className="text-sm text-muted">{meta.desc}</p>
          </div>
        </div>

        {/* Coverage */}
        <div>
          <p className="text-eyebrow mb-2.5">Coverage amount</p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {meta.amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => pickAmount(amt)}
                className={`border py-3 text-sm font-medium transition-all duration-200 ${
                  coverage === amt && !custom
                    ? "bg-ink text-white border-ink shadow-sm"
                    : "bg-surface text-muted border-border hover:text-ink hover:border-muted hover:bg-white"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
            <input
              type="text"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => handleCustom(e.target.value)}
              className="w-full border border-border bg-surface py-3 pl-8 pr-3.5 text-sm text-ink outline-none focus:border-coral focus:shadow-[0_0_0_3px_rgba(232,93,58,0.08)] transition-all placeholder:text-muted-light"
            />
          </div>
        </div>

        {/* Results — fixed height, no layout shift */}
        <div className="relative h-[210px]">
          {/* Empty state */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center border-t border-border transition-all duration-400"
            style={{
              opacity: hasValue ? 0 : 1,
              pointerEvents: hasValue ? "none" : "auto",
            }}
          >
            <div className="w-12 h-12 border border-border flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-amber animate-pulse-scale" />
            </div>
            <p className="text-sm text-muted">Pick a coverage amount</p>
            <p className="text-xs text-muted/60 mt-1">to see your premium & breakdown</p>
          </div>

          {/* Results */}
          <div
            key={animKey}
            className="absolute inset-0 border-t border-border transition-all duration-400"
            style={{
              opacity: hasValue ? 1 : 0,
              pointerEvents: hasValue ? "auto" : "none",
            }}
          >
            <div className="pt-4 space-y-4">
              {/* Premium + Payout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-paper border border-border p-4 text-center hover:border-coral/30 transition-colors duration-300">
                  <p className="text-xs text-muted uppercase tracking-[0.08em] mb-1.5">Premium</p>
                  <p className="font-serif text-[clamp(1.5rem,3vw,2rem)] text-ink">
                    $<AnimatedNumber value={premium} />
                  </p>
                  <p className="text-xs text-muted mt-1">25% of coverage</p>
                </div>
                <div className="bg-paper border border-border p-4 text-center hover:border-jade/30 transition-colors duration-300">
                  <p className="text-xs text-muted uppercase tracking-[0.08em] mb-1.5">Max Payout</p>
                  <p className="font-serif text-[clamp(1.5rem,3vw,2rem)] text-jade">
                    $<AnimatedNumber value={finalCoverage} />
                  </p>
                  <p className="text-xs text-muted mt-1">Full coverage</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/buy/${product}?coverage=${finalCoverage}`}
                className="group w-full flex items-center justify-center gap-2.5 bg-coral text-white py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-coral-deep active:scale-[0.97]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Covered — ${premium.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
