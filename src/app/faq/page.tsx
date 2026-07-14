"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "What is parametric insurance?",
    a: "Parametric insurance pays out automatically when a predefined trigger event occurs — no claims process needed. For example, if your flight is delayed by 4+ hours, the smart contract checks the data from a trusted oracle and sends your payout instantly. No forms, no adjusters, no waiting.",
  },
  {
    q: "How is the premium calculated?",
    a: "Premiums are a flat 25% of your chosen coverage amount across all products — flight delay, rain events, and shipping delay. For $100 coverage, you pay $25. This rate is set to ensure the LP pool remains sustainable while keeping coverage affordable.",
  },
  {
    q: "What happens if my trigger event doesn't occur?",
    a: "If the trigger condition is not met during the policy period, your premium stays in the LP pool to fund payouts for other users whose events do trigger. This is how insurance pools work — everyone contributes, and those who experience the covered event receive payouts.",
  },
  {
    q: "How do I get paid?",
    a: "Payouts are automatic. When the oracle confirms your trigger event (e.g., flight delay, rainfall threshold, shipping delay), the smart contract sends USDC directly to your wallet. There is nothing you need to do — the payout arrives without any action on your part.",
  },
  {
    q: "What blockchain does InsureFlow use?",
    a: "InsureFlow is built on Base L2 (Coinbase's Ethereum Layer 2). This means low transaction fees, fast confirmations, and the security of Ethereum. We plan to migrate to Rialo in the future for even better performance and native web calls.",
  },
  {
    q: "Is my money safe?",
    a: "All funds are held in non-custodial smart contract escrows. No human can access your premium — only the contract logic can release funds based on predefined conditions. Our contracts are open source and follow industry-standard security patterns inherited from OpenZeppelin.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="w-14 h-14 bg-jade/10 border border-jade/20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-7 h-7 text-jade" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-ink leading-[1.05]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted mt-4 max-w-lg mx-auto">
            Everything you need to know about InsureFlow. Can&apos;t find what
            you&apos;re looking for? Check our{" "}
            <Link href="/docs" className="text-coral underline hover:no-underline">
              documentation
            </Link>
            .
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`card-journal transition-all duration-300 ${
                  isOpen ? "border-terracotta/30" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-ink pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-coral" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center py-12 border-t border-border">
          <h2 className="text-xl font-serif text-ink mb-3">
            Still have questions?
          </h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            Read our full documentation or get started with a policy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white text-sm font-medium hover:bg-coral-deep transition-all"
            >
              View Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/buy/flight"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-ink text-sm font-medium hover:bg-paper transition-all"
            >
              Get Covered
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
