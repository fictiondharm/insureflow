"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plane,
  CloudRain,
  Package,
  Shield,
  PiggyBank,
  Banknote,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { loadStore } from "@/config/demoStore";
import { getTxData } from "@/config/txStore";
import { useWallet } from "@/context/WalletContext";
import { getUserPolicyIds, getOnChainPolicy, getUSDCBalance } from "@/lib/contracts";
import type { DemoPolicy } from "@/config/demoStore";
import type { OnChainPolicy } from "@/lib/contracts";

const typeConfig = {
  flight: { icon: Plane, accent: "text-coral", bg: "bg-coral/5" },
  rain: { icon: CloudRain, accent: "text-jade", bg: "bg-jade/5" },
  shipping: { icon: Package, accent: "text-amber", bg: "bg-amber/5" },
} as const;

const statusLabels: Record<string, string> = {
  active: "Monitoring",
  paid: "Paid",
  expired: "Expired",
};

const PRODUCT_LABELS: Record<number, string> = {
  0: "Flight Delay",
  1: "Rain Insurance",
  2: "Shipping Delay",
};

const PRODUCT_KEYS: Record<number, "flight" | "rain" | "shipping"> = {
  0: "flight",
  1: "rain",
  2: "shipping",
};

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const [onChainPolicies, setOnChainPolicies] = useState<OnChainPolicy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setOnChainPolicies([]);
      return;
    }
    setLoading(true);
    getUserPolicyIds(address)
      .then(async (ids) => {
        const policies = await Promise.all(ids.map((id) => getOnChainPolicy(id)));
        setOnChainPolicies(policies);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isConnected, address]);

  const store = loadStore();
  const demoPolicies = store.policies;

  const allPolicies: (DemoPolicy | OnChainPolicy)[] = isConnected ? onChainPolicies : demoPolicies;
  const totalPremium = isConnected
    ? onChainPolicies.reduce((sum, p) => sum + Number(p.premium), 0)
    : demoPolicies.reduce((sum, p) => sum + p.premium, 0);
  const totalPayout = isConnected
    ? onChainPolicies.filter((p) => p.status === 1).reduce((sum, p) => sum + Number(p.payoutAmount), 0)
    : demoPolicies.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.payout, 0);
  const activeCount = isConnected
    ? onChainPolicies.filter((p) => p.status === 0).length
    : demoPolicies.filter((p) => p.status === "active").length;
  const paidCount = isConnected
    ? onChainPolicies.filter((p) => p.status === 1).length
    : demoPolicies.filter((p) => p.status === "paid").length;

  const { lpPool, protocolFees, reserves } = store.pool;

  return (
    <main className="min-h-screen pt-28 pb-20 bg-paper">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-eyebrow">Dashboard</span>
            <h1 className="text-3xl sm:text-4xl font-serif text-ink mt-2 leading-[1.05]">
              Your Policies
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && address ? (
              <div className="flex items-center gap-2 px-4 py-2.5 border border-jade/20 bg-jade/5">
                <span className="w-1.5 h-1.5 bg-jade" />
                <span className="text-xs font-medium text-jade font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 border border-amber/20 bg-amber/5">
                <Sparkles className="w-3 h-3 text-amber" />
                <span className="text-xs font-medium text-amber">Demo</span>
              </div>
            )}
            <Link
              href="/buy/flight"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-coral text-white text-sm font-semibold hover:bg-coral-deep transition-all"
            >
              <Plus className="w-4 h-4" />
              New Policy
            </Link>
          </div>
        </div>

        {/* User summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Premiums Paid", value: `${totalPremium} USDC`, sub: "Accumulated premiums" },
            { label: "Total Payouts Received", value: `${totalPayout} USDC`, sub: `${paidCount} claims paid`, accent: "text-jade" },
            { label: "Active Policies", value: `${activeCount}`, sub: "Currently monitoring", accent: "text-coral" },
          ].map((stat) => (
            <div key={stat.label} className="card-journal p-6">
              <p className="text-xs text-muted uppercase tracking-wider font-medium mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-serif ${stat.accent || "text-ink"}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Pool stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "LP Pool Balance", value: lpPool.toLocaleString(), sub: "Available for payouts", icon: Shield, accent: "text-coral" },
            { label: "Protocol Fees Earned", value: protocolFees.toLocaleString(), sub: "20% of all premiums", icon: Banknote, accent: "text-jade" },
            { label: "Reserve Fund", value: reserves.toLocaleString(), sub: "Safety buffer (10%)", icon: PiggyBank, accent: "text-amber" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-journal p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border border-border flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${stat.accent}`} />
                  </div>
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
                <p className={`text-2xl font-serif ${stat.accent}`}>{stat.value} USDC</p>
                <p className="text-xs text-muted mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Policy list */}
        <div className="card-journal overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">
              {isConnected ? "On-Chain Policy History" : "Policy History (Demo)"}
            </h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
          </div>

          <div className="divide-y divide-border">
            {allPolicies.length === 0 && !loading && (
              <div className="p-10 text-center text-sm text-muted">
                {isConnected
                  ? "No on-chain policies found. Buy one to get started."
                  : "No demo policies yet. Try the demo on the Buy page."}
              </div>
            )}
            {allPolicies.map((policy: any) => {
              const isOnChain = "policyId" in policy;
              const typeKey = isOnChain
                ? PRODUCT_KEYS[policy.product as number] || "flight"
                : (policy as DemoPolicy).type;
              const cfg = typeConfig[typeKey as keyof typeof typeConfig] || typeConfig.flight;
              const Icon = cfg.icon;
              const title = isOnChain
                ? PRODUCT_LABELS[policy.product as number] || "Policy"
                : (policy as DemoPolicy).title;
              const premium = isOnChain ? policy.premium : (policy as DemoPolicy).premium;
              const payout = isOnChain ? policy.payoutAmount : (policy as DemoPolicy).payout;
              const status = isOnChain
                ? policy.status === 0 ? "active" : policy.status === 1 ? "paid" : "expired"
                : (policy as DemoPolicy).status;
              const date = isOnChain
                ? new Date((policy as OnChainPolicy).createdAt * 1000).toLocaleDateString()
                : (policy as DemoPolicy).date;
              const linkHref = isOnChain
                ? `/policy/${policy.policyId}`
                : `/policy/${(policy as DemoPolicy).id}`;

              const polId = isOnChain ? String(policy.policyId) : (policy as DemoPolicy).id;
              const txData = getTxData(polId);
              const createTx = isOnChain ? txData.createTxHash : (policy as DemoPolicy).createTxHash || txData.createTxHash;
              const payoutTx = isOnChain ? txData.payoutTxHash : (policy as DemoPolicy).payoutTxHash || txData.payoutTxHash;

              return (
                <div
                  key={isOnChain ? `chain-${policy.policyId}` : (policy as DemoPolicy).id}
                  onClick={() => router.push(linkHref)}
                  className="flex items-center gap-4 p-5 hover:bg-paper transition-colors cursor-pointer"
                >
                  <div className="flex w-10 h-10 shrink-0 items-center justify-center border border-border">
                    <Icon className={`w-5 h-5 ${cfg.accent}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted">
                        Premium: {premium} USDC
                      </span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted">
                        Payout: {payout} USDC
                      </span>
                    </div>
                    {(createTx || payoutTx) && (
                      <div className="flex items-center gap-3 mt-1">
                        {createTx && (
                          <span className="text-[10px] font-mono text-muted/60 truncate max-w-[120px]" title={createTx}>
                            TX: {createTx.slice(0, 10)}...{createTx.slice(-4)}
                          </span>
                        )}
                        {payoutTx && (
                          <span className="text-[10px] text-jade/60 font-mono truncate max-w-[120px]" title={payoutTx}>
                            Payout: {payoutTx.slice(0, 10)}...{payoutTx.slice(-4)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-xs text-muted">{date}</span>
                    <span className={`badge badge-${status}`}>
                      {status === "active" && <Clock className="w-3 h-3" />}
                      {status === "paid" && <CheckCircle className="w-3 h-3" />}
                      {status === "expired" && <XCircle className="w-3 h-3" />}
                      {statusLabels[status] || status}
                    </span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-muted shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
