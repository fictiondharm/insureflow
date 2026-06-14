"use client";

import { useEffect, useState } from "react";
import { Wallet, FileCheck, Radio, Zap } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect",
    desc: "Link your wallet. Any EVM wallet works — MetaMask, Coinbase Wallet, WalletConnect. One click, done.",
    number: "01",
    color: "text-coral",
    animClass: "animate-bob-contained",
  },
  {
    icon: FileCheck,
    title: "Select & Pay",
    desc: "Choose your product, set coverage, and pay the premium. 70% LP pool, 20% protocol, 10% reserves.",
    number: "02",
    color: "text-coral",
    animClass: "animate-rock-contained",
  },
  {
    icon: Radio,
    title: "Monitoring",
    desc: "Chainlink oracles track flight status, weather data, and shipping logs 24/7. Your policy watches for triggers automatically.",
    number: "03",
    color: "text-jade",
    animClass: "animate-pulse-scale",
  },
  {
    icon: Zap,
    title: "Auto Payout",
    desc: "Trigger detected? The contract executes immediately. Payout lands in your wallet. No claims. No calls. No waiting.",
    number: "04",
    color: "text-amber",
    animClass: "animate-pulse-scale",
  },
];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function HowItWorks() {
  const mounted = useMounted();

  return (
    <section id="how-it-works" className="section-pad bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-12 opacity-0 ${mounted ? "animate-fade-up" : ""}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-jade" />
            <span className="text-eyebrow">How It Works</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-ink mb-4">
            From connect<br />
            <span className="italic text-jade">to payout</span>
          </h2>
          <p className="text-muted text-sm">
            Four steps. No friction. The smart contract handles everything between your premium and their payout.
          </p>
        </div>

        {/* Flow connector */}
        <div className={`hidden sm:flex items-center justify-center gap-2 mb-12 opacity-0 ${mounted ? "animate-fade-up" : ""}`} style={mounted ? { animationDelay: "0.15s" } : {}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-3 h-3 ${i === 0 || i === 1 ? "bg-coral" : i === 2 ? "bg-jade" : "bg-amber"} animate-pulse-scale`} style={{ animationDelay: `${i * 0.15}s` }} />
              {i < 3 && <div className="w-20 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`bg-paper border border-border p-8 transition-all duration-300 hover:border-ink/20 group opacity-0 ${mounted ? "animate-fade-up" : ""}`}
                style={mounted ? { animationDelay: `${0.15 + idx * 0.1}s` } : {}}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 border border-border flex items-center justify-center group-hover:border-coral/30 transition-colors">
                    <Icon className={`w-5 h-5 ${step.color} ${mounted ? step.animClass : ""}`} />
                  </div>
                  <span className={`text-2xl font-serif ${step.color} italic`}>{step.number}</span>
                </div>
                <h3 className="text-lg font-semibold text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
