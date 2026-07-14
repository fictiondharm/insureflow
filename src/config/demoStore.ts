export type ProductType = "flight" | "rain" | "shipping";
export type PolicyStatus = "active" | "paid" | "expired";

export interface DemoPolicy {
  id: string;
  type: ProductType;
  title: string;
  subtitle: string;
  premium: number;
  payout: number;
  status: PolicyStatus;
  date: string;
  email?: string;
  createTxHash?: string;
  payoutTxHash?: string;
  onChainId?: number;
}

export interface PoolState {
  lpPool: number;
  protocolFees: number;
  reserves: number;
}

interface DemoStore {
  policies: DemoPolicy[];
  pool: PoolState;
}

const STORAGE_KEY = "insureflow_demo";
const COUNTER_KEY = "insureflow_counter";

function initialPolicies(): DemoPolicy[] {
  return [
    { id: "1", type: "flight", title: "AA123 · JFK → LAX", subtitle: "Flight Delay Policy", premium: 25, payout: 100, status: "active", date: "Jun 10, 2026" },
    { id: "2", type: "rain", title: "Wedding · Central Park", subtitle: "Rain Insurance", premium: 50, payout: 500, status: "paid", date: "Jun 8, 2026" },
    { id: "3", type: "shipping", title: "UPS · 1Z999AA10123456784", subtitle: "Shipping Delay Insurance", premium: 12, payout: 50, status: "expired", date: "Jun 1, 2026" },
  ];
}

function initialPool(): PoolState {
  return { lpPool: 70000, protocolFees: 20000, reserves: 10000 };
}

export function loadStore(): DemoStore {
  if (typeof window === "undefined") return { policies: initialPolicies(), pool: initialPool() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { policies: initialPolicies(), pool: initialPool() };
}

function saveStore(store: DemoStore) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
}

function nextId(): string {
  if (typeof window === "undefined") return String(Date.now());
  const val = Number(localStorage.getItem(COUNTER_KEY) || "3") + 1;
  localStorage.setItem(COUNTER_KEY, String(val));
  return String(val);
}

export function demoBuyPolicy(type: ProductType, payout: number, createTxHash?: string, onChainId?: number, email?: string): DemoPolicy {
  const premium = Math.round(payout * 0.25);
  const store = loadStore();
  const id = nextId();

  const titles: Record<ProductType, string> = {
    flight: "New Flight Policy",
    rain: "New Rain Policy",
    shipping: "New Shipping Policy",
  };
  const subtitles: Record<ProductType, string> = {
    flight: "Flight Delay Policy",
    rain: "Rain Insurance",
    shipping: "Shipping Delay Insurance",
  };

  const policy: DemoPolicy = {
    id, type, title: titles[type], subtitle: subtitles[type],
    premium, payout, status: "active",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    email, createTxHash, onChainId,
  };

  store.pool.lpPool += Math.round(premium * 0.7);
  store.pool.protocolFees += Math.round(premium * 0.2);
  store.pool.reserves += Math.round(premium * 0.1);
  store.policies.push(policy);
  saveStore(store);
  return policy;
}

export function demoSettlePolicy(policyId: string, conditionMet: boolean, payoutTxHash?: string) {
  const store = loadStore();
  const policy = store.policies.find(p => p.id === policyId);
  if (!policy || policy.status !== "active") return;
  if (conditionMet) {
    policy.status = "paid";
    policy.payoutTxHash = payoutTxHash;
    store.pool.lpPool -= policy.payout;
  } else {
    policy.status = "expired";
  }
  saveStore(store);
}

export function demoResetStore() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(COUNTER_KEY);
}
