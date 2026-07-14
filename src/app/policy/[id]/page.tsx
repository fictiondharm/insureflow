"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plane,
  CloudRain,
  Package,
  Clock,
  CheckCircle,
  ExternalLink,
  Activity,
  Sparkles,
  Loader2,
  PartyPopper,
  Banknote,
  Shield,
  PiggyBank,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { loadStore, demoSettlePolicy } from "@/config/demoStore";
import { getTxData, savePayoutTx, saveCreateTx } from "@/config/txStore";
import { useWallet } from "@/context/WalletContext";
import { getUSDCBalance, settlePolicy as onChainSettle } from "@/lib/contracts";
import { CONTRACTS } from "@/config/contracts";
import type { DemoPolicy } from "@/config/demoStore";

const icons = { flight: Plane, rain: CloudRain, shipping: Package };
const BASESCAN = "https://sepolia.basescan.org/tx";

function shortenHash(hash: string) {
  return hash.length > 14 ? hash.slice(0, 10) + "..." + hash.slice(-6) : hash;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [simulating, setSimulating] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const { address, isConnected } = useWallet();

  const store = loadStore();
  const policy = store.policies.find((p: DemoPolicy) => p.id === id);
  const pool = store.pool;
  const [localPool, setLocalPool] = useState(pool);
  const txData = getTxData(id);

  const createTxHash = policy?.createTxHash || txData.createTxHash;
  const onChainId = policy?.onChainId;
  const isRealOnChain = Boolean(createTxHash && !createTxHash.startsWith("0xDemo") && isConnected && address && onChainId !== undefined);

  useEffect(() => {
    if (isConnected && address) {
      setBalanceLoading(true);
      getUSDCBalance(address)
        .then(setUsdcBalance)
        .catch(() => setUsdcBalance(null))
        .finally(() => setBalanceLoading(false));
    } else {
      setUsdcBalance(null);
    }
  }, [isConnected, address, simulated]);

  const refreshBalance = async () => {
    if (!isConnected || !address) return;
    setBalanceLoading(true);
    try {
      const bal = await getUSDCBalance(address);
      setUsdcBalance(bal);
    } catch {}
    setBalanceLoading(false);
  };

  if (!policy) {
    return (
      <main className="min-h-screen pt-28 pb-20 bg-paper">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
          <p className="text-muted text-center py-20">Policy not found</p>
        </div>
      </main>
    );
  }

  const Icon = icons[policy.type] || Plane;
  const payoutTxHash = policy.payoutTxHash || txData.payoutTxHash;

  const handleSimulate = async () => {
    setSimulating(true);
    setCountdown(3);
    await new Promise((r) => setTimeout(r, 700));
    setCountdown(2);
    await new Promise((r) => setTimeout(r, 700));
    setCountdown(1);
    await new Promise((r) => setTimeout(r, 700));
    setCountdown(null);

    try {
      if (isRealOnChain && onChainId !== undefined) {
        const hash = await onChainSettle(onChainId, true);
        savePayoutTx(id, hash);
        demoSettlePolicy(id, true, hash);
        await refreshBalance();
      } else {
        const demoHash = `0xDemo${Array.from({ length: 56 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
        demoSettlePolicy(id, true, demoHash);
        savePayoutTx(id, demoHash);
      }
    } catch (err: any) {
      setSimulating(false);
      setCountdown(null);
      alert("On-chain settle failed: " + (err?.message || "Unknown error"));
      return;
    }

    const updated = loadStore();
    setLocalPool(updated.pool);
    setSimulating(false);
    setSimulated(true);

    const productNames: Record<string, string> = { flight: "Flight Delay", rain: "Rain", shipping: "Shipping Delay" };
    const email = policy.email;
    if (email) {
      try {
        const r = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, product: productNames[policy.type] || "Insurance", amount: policy.payout, policyId: id }),
        });
        const data = await r.json();
        setEmailStatus(data.ok ? "sent" : data.note === "simulated" ? "simulated" : "error");
      } catch {
        setEmailStatus("error");
      }
    }
  };

  const eventLabel = policy.type === "flight" ? "Delay Detected" : policy.type === "rain" ? "Rain Detected" : "Delay Detected";
  const eventDesc = policy.type === "flight"
    ? "Flight delayed by 2h 17m due to weather. Threshold met."
    : policy.type === "rain"
      ? "Rainfall exceeded 5mm threshold at event location."
      : "Package delayed at sorting facility. 3+ day threshold exceeded.";

  const timelineSteps = simulated
    ? [
        { label: "Policy Created", time: policy.date + " · 14:32 UTC", status: "completed" as const, description: `Premium of ${policy.premium} USDC paid.` },
        { label: "Monitoring Started", time: policy.date + " · 14:33 UTC", status: "completed" as const, description: "Oracle connected. Monitoring in real-time." },
        { label: eventLabel, time: policy.date + " · 09:42 UTC", status: "completed" as const, description: eventDesc },
        { label: "Payout Sent", time: policy.date + " · 09:43 UTC", status: "completed" as const, description: `${policy.payout} USDC sent to wallet.` },
      ]
    : [
        { label: "Policy Created", time: policy.date + " · 14:32 UTC", status: "completed" as const, description: `Premium of ${policy.premium} USDC paid.` },
        { label: "Monitoring Started", time: policy.date + " · 14:33 UTC", status: "completed" as const, description: "Oracle connected. Monitoring in real-time." },
        { label: eventLabel, time: policy.date + " · Pending", status: "pending" as const, description: "Waiting for trigger condition." },
        { label: "Payout Sent", time: "Pending", status: "upcoming" as const, description: `${policy.payout} USDC will be sent automatically.` },
      ];

  const accentMap: Record<string, { accent: string; bg: string; border: string }> = {
    flight: { accent: "text-coral", bg: "bg-coral/5", border: "border-coral/20" },
    rain: { accent: "text-jade", bg: "bg-jade/5", border: "border-jade/20" },
    shipping: { accent: "text-amber", bg: "bg-amber/5", border: "border-amber/20" },
  };
  const colors = accentMap[policy.type] || accentMap.flight;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACTS.STABLECOIN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-paper">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>

        {/* Token add guide */}
        {isConnected && (
          <div className="card-journal p-4 mb-8 border border-amber/20 bg-amber/[0.02]">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wallet className="w-3 h-3" />
              See USDC in MetaMask
            </p>
            <p className="text-xs text-muted/70 mb-2">
              Add the MockUSDC token to MetaMask to see your balance:
            </p>
            <div className="flex items-center gap-2">
              <code className="text-[11px] font-mono text-ink bg-paper px-2 py-1 border border-border truncate flex-1">
                {CONTRACTS.STABLECOIN}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 text-xs text-jade hover:text-jade/80 transition-colors px-2 py-1 border border-jade/20"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-muted/50 mt-2">
              In MetaMask: Tokens → Import Tokens → paste address
            </p>
          </div>
        )}

        {/* Policy header */}
        <div className={`card-journal p-8 mb-8 transition-all duration-500 ${simulated ? "bg-jade/[0.02] border-jade/20" : ""}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`flex w-14 h-14 items-center justify-center border ${colors.border} ${colors.bg}`}>
                <Icon className={`w-7 h-7 ${colors.accent}`} />
              </div>
              <div>
                <h1 className="text-xl font-serif text-ink">{policy.subtitle}</h1>
                <p className="text-sm text-muted mt-1">{policy.title}</p>
              </div>
            </div>
            <span className={`badge ${policy.status === "paid" || simulated ? "badge-paid" : "badge-active"}`}>
              {policy.status === "paid" || simulated ? (
                <><CheckCircle className="w-3 h-3" /> Paid</>
              ) : (
                <><span className="w-1.5 h-1.5 rounded-full bg-amber" /> Monitoring</>
              )}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
            {[
              { label: "Premium Paid", value: `${policy.premium} USDC` },
              { label: "Payout Amount", value: `${policy.payout} USDC`, accent: "text-jade" },
              { label: "Policy ID", value: `#${id?.slice(0, 8)}`, mono: true },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">{stat.label}</p>
                <p className={`text-lg font-serif ${stat.accent || "text-ink"} ${stat.mono ? "font-mono text-sm font-normal" : ""}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Creation TX hash */}
          {createTxHash && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Activity className="w-3 h-3" />
                <span className="font-medium uppercase tracking-wider">Creation TX</span>
              </div>
              <a
                href={`${BASESCAN}/${createTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-jade hover:text-jade/80 transition-colors"
              >
                {shortenHash(createTxHash)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Wallet Balance */}
          {isConnected && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Wallet className="w-3 h-3" />
                <span className="font-medium uppercase tracking-wider">Your USDC Balance</span>
              </div>
              <span className="text-xs font-mono text-ink">
                {balanceLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin inline" />
                ) : usdcBalance !== null ? (
                  `${usdcBalance} USDC`
                ) : (
                  "—"
                )}
              </span>
            </div>
          )}

          {/* Payout received banner */}
          {simulated && (
            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-2 text-sm text-jade bg-jade/5 border border-jade/20 p-4">
                <PartyPopper className="w-4 h-4 shrink-0" />
                <span className="font-medium">+{policy.payout} USDC received in your wallet</span>
                {!balanceLoading && usdcBalance !== null && (
                  <span className="text-xs text-muted/70 ml-auto">
                    Balance: {usdcBalance} USDC
                  </span>
                )}
              </div>
              {payoutTxHash && (
                <div className="border border-border p-4 space-y-2">
                  <p className="text-xs font-medium text-muted uppercase tracking-wider">
                    {isRealOnChain ? "On-Chain Payout Transaction" : "Payout Transaction (Demo)"}
                  </p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-ink break-all">{payoutTxHash}</code>
                    <a
                      href={`${BASESCAN}/${payoutTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-jade hover:text-jade/80 transition-colors shrink-0 ml-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Basescan
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pool stats */}
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
            {[
              { label: "LP Pool Balance", value: `${localPool.lpPool.toLocaleString()} USDC`, accent: simulated ? "text-coral" : "text-ink", icon: Shield },
              { label: "Protocol Fees", value: `${localPool.protocolFees.toLocaleString()} USDC`, accent: "text-jade", icon: Banknote },
              { label: "Reserve Fund", value: `${localPool.reserves.toLocaleString()} USDC`, accent: "text-amber", icon: PiggyBank },
            ].map((stat) => {
              const SIcon = stat.icon;
              return (
                <div key={stat.label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <SIcon className="w-3 h-3 text-muted" />
                    <p className="text-xs text-muted uppercase tracking-wider font-medium">{stat.label}</p>
                  </div>
                  <p className={`text-sm font-serif ${stat.accent}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="card-journal p-8">
          <h2 className="text-xs font-semibold text-ink uppercase tracking-wider mb-8 flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted" />
            Policy Timeline
          </h2>

          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-coral via-jade to-transparent" />

            <div className="space-y-8">
              {timelineSteps.map((step) => (
                <div key={step.label} className="relative flex gap-6">
                  <div className={`relative z-10 flex w-8 h-8 shrink-0 items-center justify-center border-2 transition-all duration-500 ${
                    step.status === "completed" ? "border-coral bg-coral/5" : step.status === "pending" ? "border-amber bg-amber/5" : "border-border bg-surface-warm"
                  }`}>
                    {step.status === "completed" ? <CheckCircle className="w-4 h-4 text-coral" /> : step.status === "pending" ? <Clock className="w-4 h-4 text-amber" /> : <div className="w-2 h-2 bg-border" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`text-sm font-medium ${step.status === "completed" ? "text-ink" : step.status === "pending" ? "text-amber" : "text-muted"}`}>{step.label}</h3>
                      {step.status === "pending" && <span className="text-xs text-amber font-medium whitespace-nowrap">In Progress</span>}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{step.time}</p>
                    <p className="text-xs text-muted/70 mt-1 leading-relaxed">{step.description}</p>

                    {step.label === "Policy Created" && createTxHash && (
                      <a
                        href={`${BASESCAN}/${createTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-coral hover:text-coral/80 transition-colors"
                      >
                        {shortenHash(createTxHash)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {step.label === "Payout Sent" && step.status === "completed" && payoutTxHash && (
                      <a
                        href={`${BASESCAN}/${payoutTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-jade hover:text-jade/80 transition-colors"
                      >
                        {shortenHash(payoutTxHash)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            {policy.status === "paid" ? (
              <div className="bg-jade/5 border border-jade/20 py-4 px-4 text-sm text-jade text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Policy settled — {policy.payout} USDC paid out</span>
                </div>
                {payoutTxHash && (
                  <a
                    href={`${BASESCAN}/${payoutTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-jade/70 hover:text-jade mt-2 transition-colors"
                  >
                    View payout transaction <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : !simulated ? (
              <div className="space-y-3">
                {simulating && countdown !== null && (
                  <div className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <p className="text-xs text-muted uppercase tracking-wider mb-4">
                        {countdown === 3 ? "Detecting event..." : countdown === 2 ? "Verifying on-chain..." : "Triggering payout..."}
                      </p>
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-coral/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-4 border-coral/40 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-serif text-coral animate-bounce">{countdown}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!simulating && (
                  <button
                    type="button"
                    onClick={handleSimulate}
                    className="w-full border border-jade/20 bg-jade/5 py-3 text-sm font-medium text-jade hover:bg-jade/10 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isRealOnChain
                      ? `Trigger ${eventLabel} (On-Chain)`
                      : policy.type === "flight"
                        ? "Simulate Delay Event (Demo)"
                        : policy.type === "rain"
                          ? "Simulate Rain Event (Demo)"
                          : "Simulate Delay Event (Demo)"}
                  </button>
                )}
                {isRealOnChain && !simulating && (
                  <p className="text-xs text-muted/50 text-center">
                    This will trigger a real on-chain settlePayout transaction via MetaMask
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-jade/5 border border-jade/20 py-4 px-4 text-sm text-jade text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <PartyPopper className="w-4 h-4" />
                  <span className="font-medium">Event triggered — +{policy.payout} USDC paid to wallet</span>
                </div>
                <p className="text-xs text-muted/70">
                  {isRealOnChain
                    ? "LP Pool reduced · Check MetaMask USDC balance"
                    : "LP Pool reduced by " + policy.payout + " USDC · " + (isConnected ? "Add the USDC token above to see your balance" : "Connect wallet to see your balance")}
                </p>
              </div>
            )}
            {emailStatus === "sent" && (
              <p className="text-center text-xs text-muted mt-2">Payout notification sent to {policy.email}</p>
            )}
            {emailStatus === "simulated" && (
              <p className="text-center text-xs text-muted mt-2">Email notification skipped (no RESEND_API_KEY set)</p>
            )}
            {emailStatus === "error" && (
              <p className="text-center text-xs text-coral mt-2">Failed to send email notification</p>
            )}
            <p className="text-center text-xs text-muted/50 mt-2">
              {isRealOnChain ? "Real on-chain transaction" : "Demo mode"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
