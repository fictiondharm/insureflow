"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Plane,
  CloudRain,
  Package,
  ArrowLeft,
  Wallet,
  Check,
  ArrowRight,
  Info,
  Loader2,
  Sparkles,
  PartyPopper,
  ExternalLink,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { demoBuyPolicy, demoSettlePolicy } from "@/config/demoStore";
import { saveCreateTx } from "@/config/txStore";
import { FlightCardIllus, RainCardIllus, ShippingCardIllus } from "@/components/illustrations/ProductCardIllustrations";
import { useWallet } from "@/context/WalletContext";
import { faucetUSDC, approveUSDC, createPolicy, settlePolicy, POLICY_ESCROW_ADDRESS } from "@/lib/contracts";
import { savePayoutTx } from "@/config/txStore";
import { parseUnits, formatUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";

const productData = {
  flight: {
    icon: Plane,
    name: "Flight Delay Insurance",
    description: "Get paid automatically if your flight is delayed more than 4 hours.",
    accent: "text-coral",
    bg: "bg-coral/5 border-coral/20",
    Illustration: FlightCardIllus,
    productType: 0,
    fields: [
      { key: "airline", label: "Airline", placeholder: "e.g. American Airlines" },
      { key: "flightNumber", label: "Flight Number", placeholder: "e.g. AA123" },
      { key: "date", label: "Departure Date", inputType: "date" },
    ],
  },
  rain: {
    icon: CloudRain,
    name: "Rain Insurance",
    description: "Get paid if rainfall exceeds your threshold on event day.",
    accent: "text-jade",
    bg: "bg-jade/5 border-jade/20",
    Illustration: RainCardIllus,
    productType: 1,
    fields: [
      { key: "location", label: "Event Location", placeholder: "e.g. Central Park, NYC" },
      { key: "date", label: "Event Date", inputType: "date" },
      { key: "threshold", label: "Rain Threshold (mm)", placeholder: "e.g. 5" },
    ],
  },
  shipping: {
    icon: Package,
    name: "Shipping Delay Insurance",
    description: "Get compensated if your package is delayed beyond 3 days.",
    accent: "text-amber",
    bg: "bg-amber/5 border-amber/20",
    Illustration: ShippingCardIllus,
    productType: 2,
    fields: [
      { key: "carrier", label: "Carrier", placeholder: "e.g. UPS, FedEx, USPS" },
      { key: "tracking", label: "Tracking Number", placeholder: "e.g. 1Z999AA10123456784" },
      { key: "estimatedDays", label: "Expected Delivery (days)", placeholder: "e.g. 5" },
    ],
  },
};

type Field = { key: string; label: string; placeholder?: string; inputType?: string };
type ProductKey = keyof typeof productData;

const PRODUCT_KEYS = ["flight", "rain", "shipping"] as const;

export default function BuyPage() {
  const params = useParams();
  const type = params.type as ProductKey;
  const product = productData[type];
  const { address, isConnected, usdcBalance, connect, refreshBalance } = useWallet();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [purchasedId, setPurchasedId] = useState<string | null>(null);
  const [purchasedOnChainId, setPurchasedOnChainId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [funding, setFunding] = useState(false);
  const [settling, setSettling] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-paper">
        <p className="text-muted">Product not found</p>
      </main>
    );
  }

  const Icon = product.icon;
  const Ill = product.Illustration;
  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePay = async () => {
    if (!address) return;
    setPaying(true);
    setTxError(null);

    try {
      const payoutHuman = Number(formData.coverage) || 100;
      const payoutWei = parseUnits(String(payoutHuman), 6);
      const premiumWei = payoutWei * BigInt(25) / BigInt(100);
      const premiumHuman = Number(formatUnits(premiumWei, 6));
      const currentBal = Number(usdcBalance);

      if (currentBal < premiumHuman) {
        setFunding(true);
        await faucetUSDC(address, Math.ceil(premiumHuman * 2));
        setFunding(false);
        await refreshBalance();
      }

      await approveUSDC(POLICY_ESCROW_ADDRESS, premiumWei);

      const eventDateStr = formData.date;
      const eventDate = eventDateStr
        ? Math.floor(new Date(eventDateStr).getTime() / 1000) + 86400
        : Math.floor(Date.now() / 1000) + 86400;

      const metadata = JSON.stringify(
        Object.fromEntries(Object.entries(formData).filter(([k]) => k !== "coverage"))
      );

      const { policyId: onChainId, hash } = await createPolicy(product.productType, payoutHuman, eventDate, metadata);
      setTxHash(hash);
      saveCreateTx(onChainId, hash);

      const policy = demoBuyPolicy(PRODUCT_KEYS[product.productType] as "flight" | "rain" | "shipping", payoutHuman, hash, onChainId);
      setPurchasedId(policy.id);
      setPurchasedOnChainId(onChainId);
      setPaid(true);
    } catch (err: any) {
      setTxError(err?.message || "Transaction failed. Check MetaMask.");
    } finally {
      setPaying(false);
      setFunding(false);
    }
  };

  const handleFillDemo = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const demoData: Record<string, string> = {};
    if (type === "flight") {
      demoData.airline = "American Airlines";
      demoData.flightNumber = "AA123";
      demoData.date = dateStr;
      demoData.coverage = "100";
    } else if (type === "rain") {
      demoData.location = "Central Park, NYC";
      demoData.date = dateStr;
      demoData.threshold = "5";
      demoData.coverage = "500";
    } else {
      demoData.carrier = "UPS";
      demoData.tracking = "1Z999AA10123456784";
      demoData.estimatedDays = "5";
      demoData.coverage = "50";
    }
    setFormData(demoData);
  };

  const handleSimulate = async () => {
    setSimulating(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      if (purchasedOnChainId !== null && isConnected) {
        setSettling(true);
        const settleHash = await settlePolicy(purchasedOnChainId, true);
        savePayoutTx(String(purchasedId), settleHash);
        if (purchasedId) demoSettlePolicy(purchasedId, true, settleHash);
        setSettling(false);
        const coverage = formData.coverage || "100";
        setSimResult(`Payout triggered on-chain! +${coverage} USDC sent to your wallet. TX: ${settleHash.slice(0, 10)}...`);
      } else {
        if (purchasedId) demoSettlePolicy(purchasedId, true);
        const coverage = formData.coverage || "100";
        setSimResult("Event detected! Payout of $" + coverage + " USDC sent to your wallet.");
      }
    } catch (err: any) {
      setSimResult("Settle failed: " + (err?.message || "Unknown error"));
    }
    setSimulating(false);
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-paper">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-4">
              <div className={`flex w-14 h-14 items-center justify-center border ${product.bg}`}>
                <Icon className={`w-7 h-7 ${product.accent}`} />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-ink">{product.name}</h1>
                <p className="text-sm text-muted mt-1">{product.description}</p>
              </div>
            </div>

            <div className="h-40 border border-border bg-paper overflow-hidden">
              <Ill />
            </div>

            <div className="card-journal p-8 space-y-6">
              <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">
                Policy Details
              </h2>

              {(product.fields as Field[]).map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.inputType || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="input-journal"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-3">
                  Coverage Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(() => {
                    const amounts = type === "flight" ? [50, 100, 200]
                      : type === "rain" ? [250, 500, 1000]
                      : [25, 50, 100];
                    return amounts.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        className={`border py-3 text-sm font-medium transition-all ${
                          formData.coverage === String(amt)
                            ? "bg-ink text-white border-ink"
                            : "bg-surface text-muted border-border hover:text-ink hover:border-muted"
                        }`}
                        onClick={() => updateField("coverage", String(amt))}
                      >
                        ${amt}
                      </button>
                    ));
                  })()}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                {!isConnected ? (
                  <button
                    type="button"
                    onClick={connect}
                    className="w-full border border-border bg-surface py-3 text-sm font-medium text-ink hover:border-muted transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                ) : (
                  <div className="border border-jade/20 bg-jade/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-jade">
                        <Check className="w-4 h-4" />
                        Connected
                      </div>
                      <button
                        type="button"
                        onClick={() => refreshBalance()}
                        className="text-xs text-muted hover:text-ink underline"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                      <span className="text-ink font-medium">{Number(usdcBalance).toFixed(2)} USDC</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 card-journal p-8 space-y-6">
              <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">
                Order Summary
              </h2>

              {Object.entries(formData).filter(([k]) => k !== "coverage").length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(formData)
                    .filter(([k]) => k !== "coverage")
                    .map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-muted capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-medium text-ink">{val}</span>
                      </div>
                    ))}
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Coverage</span>
                    <span className="font-semibold text-ink">${formData.coverage || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Premium (25%)</span>
                    <span className="font-semibold text-ink">
                      ${formData.coverage ? Math.round(Number(formData.coverage) * 0.25) : "—"}
                    </span>
                  </div>
                  {formData.coverage && (
                    <div className="pl-4 space-y-1 text-xs text-muted border-l-2 border-amber/30 ml-1">
                      <div className="flex justify-between">
                        <span>LP Pool (70%)</span>
                        <span>${(Math.round(Number(formData.coverage) * 0.25) * 0.7).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protocol Fee (20%)</span>
                        <span>${(Math.round(Number(formData.coverage) * 0.25) * 0.2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserves (10%)</span>
                        <span>${(Math.round(Number(formData.coverage) * 0.25) * 0.1).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Max Payout</span>
                    <span className="font-semibold text-jade">${formData.coverage || "—"}</span>
                  </div>

                  {txHash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-coral hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Basescan
                    </a>
                  )}

                  {txError && (
                    <div className="bg-coral/5 border border-coral/20 p-3 text-xs text-coral">
                      {txError}
                    </div>
                  )}

                  {paid && (
                    <div className="bg-jade/5 border border-jade/20 p-3 flex items-center gap-2 text-sm text-jade">
                      <Check className="w-4 h-4 shrink-0" />
                      Policy created on-chain!
                    </div>
                  )}
                  {simResult && (
                    <div className="bg-coral/5 border border-coral/20 p-3 flex items-center gap-2 text-sm text-coral">
                      <PartyPopper className="w-4 h-4 shrink-0" />
                      {simResult}
                    </div>
                  )}
                  {formData.coverage && (
                    <div className="bg-paper border border-border p-4 space-y-3">
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                        <Info className="w-3 h-3" />
                        How premiums flow
                      </p>
                      <div className="text-center py-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink/10 bg-ink/5 text-xs font-medium text-ink">
                          You pay ${Math.round(Number(formData.coverage) * 0.25)} premium
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-center text-xs text-muted/50">
                        <span className="w-12 h-px bg-border" />
                        <span>splits into</span>
                        <span className="w-12 h-px bg-border" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-coral/5 border border-coral/15 p-2 text-center">
                          <p className="text-xs font-semibold text-coral">${(Math.round(Number(formData.coverage) * 0.25) * 0.7).toFixed(2)}</p>
                          <p className="text-[10px] text-muted">LP Pool (70%)</p>
                        </div>
                        <div className="bg-jade/5 border border-jade/15 p-2 text-center">
                          <p className="text-xs font-semibold text-jade">${(Math.round(Number(formData.coverage) * 0.25) * 0.2).toFixed(2)}</p>
                          <p className="text-[10px] text-muted">Protocol (20%)</p>
                        </div>
                        <div className="bg-amber/5 border border-amber/15 p-2 text-center">
                          <p className="text-xs font-semibold text-amber">${(Math.round(Number(formData.coverage) * 0.25) * 0.1).toFixed(2)}</p>
                          <p className="text-[10px] text-muted">Reserves (10%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-center text-xs text-muted/50">
                        <span className="w-12 h-px bg-border" />
                        <span>if trigger fires</span>
                        <span className="w-12 h-px bg-border" />
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-jade/5 border border-jade/15 text-xs font-medium text-jade">
                          LP Pool pays you ${formData.coverage} — full coverage, no extra fee
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-amber" />
                  </div>
                  <p className="text-sm text-muted mb-4">Fill in details or try the demo</p>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="inline-flex items-center gap-1.5 border border-amber/20 bg-amber/5 px-4 py-2 text-xs font-medium text-amber hover:bg-amber/10 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Fill Demo Data
                  </button>
                </div>
              )}

              {!paid ? (
                <button
                  type="button"
                  disabled={!isConnected || !formData.coverage || paying}
                  onClick={handlePay}
                  className={`w-full py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 transition-all ${
                    isConnected && formData.coverage && !paying
                      ? "bg-coral text-white hover:bg-coral-deep"
                      : "bg-paper text-muted/50 cursor-not-allowed border border-border"
                  }`}
                >
                  {funding ? (
                    <>
                      <Droplets className="w-4 h-4 animate-pulse" />
                      Getting USDC...
                    </>
                  ) : paying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating policy...
                    </>
                  ) : (
                    <>
                      Pay Premium
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-jade/5 border border-jade/20 py-3.5 text-sm font-medium text-jade text-center">
                  <Check className="w-4 h-4 inline mr-1.5" />
                  Policy Active
                </div>
              )}

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs font-medium text-muted uppercase tracking-wider text-center">
                  Demo Controls
                </p>

                {!simResult && (
                  <button
                    type="button"
                    onClick={handleSimulate}
                    disabled={simulating}
                    className="w-full border border-jade/20 bg-jade/5 py-2.5 text-xs font-medium text-jade hover:bg-jade/10 transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {simulating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Simulating Event...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        {paid && purchasedOnChainId !== null ? "Trigger On-Chain Payout" : paid ? "Simulate Event Trigger (Demo)" : "Quick Demo: Simulate Payout"}
                      </>
                    )}
                  </button>
                )}

                {simResult && (
                  <div className="bg-jade/5 border border-jade/20 p-3 flex items-center gap-2 text-sm text-jade">
                    <PartyPopper className="w-4 h-4 shrink-0" />
                    {simResult}
                  </div>
                )}

                <div className="text-center text-xs text-muted space-y-1">
                  {paid
                    ? txHash
                      ? <>Policy created on Base Sepolia{purchasedOnChainId !== null ? " · View on dashboard for on-chain payout" : ""}</>
                      : "Demo mode — no real transactions"
                    : "Connect wallet to use real contracts"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
