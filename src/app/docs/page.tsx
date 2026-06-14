"use client";

import Link from "next/link";
import {
  Shield,
  Wallet,
  ArrowRight,
  Check,
  Percent,
  PiggyBank,
  Banknote,
  FileCheck,
  Radio,
  Zap,
  Lock,
  ChevronRight,
  BookOpen,
  Plane,
  Building2,
  Train,
  ShoppingCart,
  Globe,
} from "lucide-react";

const sections = [
  { id: "how-it-works", label: "How It Works" },
  { id: "payments", label: "How Payments Work" },
  { id: "fees", label: "Fee Structure" },
  { id: "distribution-model", label: "Distribution Model" },
  { id: "sources", label: "Where Money Comes From" },
  { id: "distribution", label: "Where Money Goes" },
  { id: "security", label: "Security & Smart Contracts" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function DocsPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="w-14 h-14 bg-coral/10 border border-coral/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-coral" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-ink leading-[1.05]">
            Documentation
          </h1>
          <p className="text-sm text-muted mt-4 max-w-xl mx-auto">
            Everything you need to know about InsureFlow — how it works, where
            your money goes, and how we keep it secure.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="card-journal p-6 sm:p-8 mb-12">
          <h2 className="text-xs font-semibold text-ink uppercase tracking-wider mb-5">
            On this page
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-ink hover:bg-paper transition-all text-left"
              >
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-coral" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. How It Works */}
        <section id="how-it-works" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-coral/10 border border-coral/20 flex items-center justify-center">
              <Radio className="w-5 h-5 text-coral" />
            </div>
            <h2 className="text-2xl font-serif text-ink">How It Works</h2>
          </div>
          <p className="text-muted leading-relaxed mb-10">
            InsureFlow is a fully on-chain parametric insurance protocol. No
            claims adjusters, no paperwork — just smart contracts that pay out
            automatically when predefined conditions are met.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Wallet,
                title: "1. Connect Wallet",
                desc: "Link any EVM wallet — MetaMask, Coinbase Wallet, or WalletConnect.",
                color: "text-coral bg-coral/10 border-coral/20",
              },
              {
                icon: FileCheck,
                title: "2. Select & Pay",
                desc: "Choose a product, set coverage, pay the premium. Funds are locked in escrow.",
                color: "text-jade bg-jade/10 border-jade/20",
              },
              {
                icon: Radio,
                title: "3. Monitoring",
                desc: "Oracles track flight status, weather data & shipping logs in real-time.",
                color: "text-amber bg-amber/10 border-amber/20",
              },
              {
                icon: Zap,
                title: "4. Automatic Payout",
                desc: "Trigger condition met? Payout is sent to your wallet instantly. No action needed.",
                color: "text-jade bg-jade/10 border-jade/20",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`border p-5 ${step.color}`}
                >
                  <Icon className="w-8 h-8 mb-4" />
                  <h3 className="text-sm font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm opacity-80">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Visual flow arrow */}
          <div className="flex items-center justify-center gap-4 mt-8 text-sm text-muted">
            <span className="flex items-center gap-1">
              Wallet <ArrowRight className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1">
              Escrow <ArrowRight className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1">
              Oracle <ArrowRight className="w-3 h-3" />
            </span>
            <span className="flex items-center gap-1">
              Payout <Check className="w-3 h-3 text-jade" />
            </span>
          </div>
        </section>

        {/* 2. How Payments Work */}
        <section id="payments" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-jade/10 border border-jade/20 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-jade" />
            </div>
            <h2 className="text-2xl font-serif text-ink">How Payments Work</h2>
          </div>

          <div className="card-journal p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-coral/10 border border-coral/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-coral">1</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-1">
                  You Pay a Premium
                </h3>
                <p className="text-sm text-muted">
                  When you buy a policy, you pay a premium in USDC. This
                   premium is a flat 25% of your chosen coverage amount across
                   all products — flight delay, rain events, and shipping delay.
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-jade/10 border border-jade/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-jade">2</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-1">
                  Funds Locked in Escrow
                </h3>
                <p className="text-sm text-muted">
                  Your premium is held in a smart contract escrow until the
                  policy period ends. The funds are safe — only the smart
                  contract can release them.
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-amber">3</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-1">
                  Oracle Triggers Payout
                </h3>
                <p className="text-sm text-muted">
                  If the trigger condition is met (e.g., flight delayed 2+
                  hours, rainfall exceeds threshold, shipping delayed 3+ days),
                  the oracle reports it on-chain. The smart contract
                  automatically sends your payout.
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-jade/10 border border-jade/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-jade">4</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink mb-1">
                  Payout in Your Wallet
                </h3>
                <p className="text-sm text-muted">
                  The full coverage amount (up to your selected max) arrives
                  in your wallet. No claims to file, no forms to submit, no
                  waiting period.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Fee Structure */}
        <section id="fees" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber/10 border border-amber/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-amber" />
            </div>
            <h2 className="text-2xl font-serif text-ink">Fee Structure</h2>
          </div>

          <p className="text-muted leading-relaxed mb-8">
            Every premium is split three ways to keep the protocol sustainable,
            reward liquidity providers, and build reserves.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card-journal p-6 text-center">
              <div className="w-16 h-16 bg-coral/10 border border-coral/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-coral">70%</span>
              </div>
              <h3 className="text-sm font-semibold text-ink mb-2">
                LP Pool
              </h3>
              <p className="text-xs text-muted">
                70% of every premium goes to the Liquidity Provider pool.
                This funds payouts for users whose trigger events occur.
              </p>
            </div>

            <div className="card-journal p-6 text-center">
              <div className="w-16 h-16 bg-jade/10 border border-jade/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-jade">20%</span>
              </div>
              <h3 className="text-sm font-semibold text-ink mb-2">
                Protocol Fee
              </h3>
              <p className="text-xs text-muted">
                20% funds protocol operations, development, oracle costs, and
                future growth of InsureFlow.
              </p>
            </div>

            <div className="card-journal p-6 text-center">
              <div className="w-16 h-16 bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif text-amber">10%</span>
              </div>
              <h3 className="text-sm font-semibold text-ink mb-2">
                Reserves
              </h3>
              <p className="text-xs text-muted">
                10% goes to the protocol reserve fund, providing a safety
                buffer for extreme events and protocol stability.
              </p>
            </div>
          </div>
        </section>

        {/* 3.5 Distribution Model */}
        <section id="distribution-model" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-coral/10 border border-coral/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-coral" />
            </div>
            <h2 className="text-2xl font-serif text-ink">Distribution Model</h2>
          </div>

          <p className="text-muted leading-relaxed mb-8">
            InsureFlow is built for embedded distribution. We don&apos;t sell directly to
            consumers — our contracts live inside platforms that already have
            insurance at checkout.
          </p>

          <div className="card-journal p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-ink mb-6">
              Real platforms already selling insurance at checkout
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Plane,
                  name: "Turkish Airlines × XCover",
                  note: "Flight delay & cancellation at booking",
                  accent: "text-coral bg-coral/5 border-coral/20",
                },
                {
                  icon: Building2,
                  name: "Airbnb × Generali",
                  note: "Travel insurance in US, UK, EU, CA",
                  accent: "text-jade bg-jade/5 border-jade/20",
                },
                {
                  icon: Train,
                  name: "IRCTC × SBI General",
                  note: "₹0.45 accident cover per e-ticket",
                  accent: "text-amber bg-amber/5 border-amber/20",
                },
                {
                  icon: ShoppingCart,
                  name: "Shopify × Various",
                  note: "Evolving — no good micro-delay cover exists",
                  accent: "text-jade bg-jade/5 border-jade/20",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className={`border p-5 ${item.accent}`}>
                    <Icon className="w-6 h-6 mb-3" />
                    <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                    <p className="text-xs opacity-80">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-journal p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-ink mb-6">
              Traditional vs Parametric
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted">Factor</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">Traditional (Allianz, AIG, XCover)</th>
                    <th className="text-left py-3 pl-4 text-xs font-semibold uppercase tracking-wider text-jade">InsureFlow (Parametric)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { factor: "Integration time", legacy: "Months — legal, compliance, contracts", ours: "1 day — smart contract + widget" },
                    { factor: "Overhead", legacy: "40-60% — adjusters, fraud teams, paperwork", ours: "20% flat — no adjusters, no fraud" },
                    { factor: "Minimum commitment", legacy: "$500K+ premium volume required", ours: "Zero minimum" },
                    { factor: "Payout speed", legacy: "2-6 weeks after filing claims", ours: "Instant — on-chain trigger detection" },
                    { factor: "Coverage types", legacy: "Limited to high-premium events", ours: "Any trigger — rain, delay, threshold" },
                  ].map((row) => (
                    <tr key={row.factor}>
                      <td className="py-3 pr-4 text-ink font-medium">{row.factor}</td>
                      <td className="py-3 px-4 text-muted">{row.legacy}</td>
                      <td className="py-3 pl-4 text-jade">{row.ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-journal p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-ink mb-4">
              How embedding works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-coral/10 border border-coral/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-coral">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">Platform adds our widget</h4>
                  <p className="text-sm text-muted">A script tag or iframe in the checkout flow. Our smart contract handles everything else.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-jade/10 border border-jade/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-jade">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">User buys at checkout</h4>
                  <p className="text-sm text-muted">User checks a box: &ldquo;Add rain protection — $10.&rdquo; Premium flows to our escrow contract.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-amber">3</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink mb-1">We handle everything</h4>
                  <p className="text-sm text-muted">Monitoring, trigger detection, payout — all on-chain. Platform gets a revenue share. We take 20%.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber/5 border border-amber/20 p-6">
            <h4 className="text-sm font-semibold text-ink mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-amber" />
              The IRCTC Case Study
            </h4>
            <p className="text-sm text-muted">
              Indian Railways sells 45 paise (₹0.45) accident insurance per e-ticket through
              IRCTC × SBI General. Millions of policies per year. The premium is so small
              it only works because it&apos;s fully automated. InsureFlow can add delay + weather
              triggers to this exact same flow — same channel, same user, new parametric triggers.
              This proves micro-insurance at checkout works at scale.
            </p>
          </div>
        </section>

        {/* 4. Where Money Comes From */}
        <section id="sources" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-jade/10 border border-jade/20 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-jade" />
            </div>
            <h2 className="text-2xl font-serif text-ink">
              Where Money Comes From
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">
                Premium Payments
              </h3>
              <p className="text-sm text-muted">
                Users pay premiums in USDC when purchasing policies. This is
                the primary source of funds in the protocol. Premium amounts
                are based on the coverage amount and product type.
              </p>
            </div>
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3">
                LP Pool Seeding
              </h3>
              <p className="text-sm text-muted">
                The initial LP pool is seeded with MockUSDC (testnet) to
                bootstrap the protocol. In production, external LPs can
                deposit USDC to earn a share of premiums.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Where Money Goes */}
        <section id="distribution" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-coral/10 border border-coral/20 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-coral" />
            </div>
            <h2 className="text-2xl font-serif text-ink">
              Where Money Goes
            </h2>
          </div>

          <p className="text-muted leading-relaxed mb-8">
            When a policy is purchased, the premium is distributed
            automatically by the smart contract.
          </p>

          <div className="card-journal p-6 sm:p-8">
            {/* Visual breakdown */}
            <div className="space-y-6">
              {[
                {
                  label: "LP Pool",
                  pct: 70,
                  color: "bg-coral",
                  desc: "Funds payouts for users when trigger events occur. If no event occurs, premiums accumulate in the pool.",
                },
                {
                  label: "Protocol Fee",
                  pct: 20,
                  color: "bg-jade",
                  desc: "Covers development, oracle infrastructure, operations, and growth initiatives.",
                },
                {
                  label: "Reserves",
                  pct: 10,
                  color: "bg-amber",
                  desc: "Safety buffer for extreme events, protocol stability, and future insurance product development.",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-ink">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-paper overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Security & Smart Contracts */}
        <section id="security" className="mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-jade/10 border border-jade/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-jade" />
            </div>
            <h2 className="text-2xl font-serif text-ink">
              Security & Smart Contracts
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-coral" />
                Smart Contract Escrow
              </h3>
              <p className="text-sm text-muted">
                All premiums are held in a non-custodial escrow contract. Only
                the contract logic — not any human — can release funds. This
                eliminates counterparty risk.
              </p>
            </div>
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4 text-jade" />
                Decentralized Oracles
              </h3>
              <p className="text-sm text-muted">
                Trigger conditions are verified by decentralized oracle
                networks. Flight data, weather data, and shipping updates are
                sourced from reliable providers.
              </p>
            </div>
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber" />
                Open Source
              </h3>
              <p className="text-sm text-muted">
                All smart contracts are open source and available for review.
                The protocol is built on Base L2, inheriting Ethereum&apos;s
                security guarantees.
              </p>
            </div>
            <div className="card-journal p-6">
              <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-jade" />
                Automated Payouts
              </h3>
              <p className="text-sm text-muted">
                Payouts are fully automated — no human intervention required.
                If conditions are met, the contract pays. Period.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-12 border-t border-border">
          <h2 className="text-2xl font-serif text-ink mb-4">
            Ready to get covered?
          </h2>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            Choose your product, pay the premium, and rest easy knowing
            you&apos;re protected by code.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/buy/flight"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white text-sm font-medium hover:bg-coral-deep transition-all"
            >
              Flight Delay
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/buy/rain"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-ink text-sm font-medium hover:bg-paper transition-all"
            >
              Rain Coverage
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/buy/shipping"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-ink text-sm font-medium hover:bg-paper transition-all"
            >
              Shipping Cover
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
