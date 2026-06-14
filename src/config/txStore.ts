"use client";

export interface TxRecord {
  createTxHash?: string;
  payoutTxHash?: string;
}

const TX_KEY = "insureflow_tx";

function loadTxStore(): Record<string, TxRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(TX_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveTxStore(store: Record<string, TxRecord>) {
  try {
    localStorage.setItem(TX_KEY, JSON.stringify(store));
  } catch {}
}

export function saveCreateTx(policyId: string | number, hash: string) {
  const store = loadTxStore();
  const key = String(policyId);
  store[key] = { ...store[key], createTxHash: hash };
  saveTxStore(store);
}

export function savePayoutTx(policyId: string | number, hash: string) {
  const store = loadTxStore();
  const key = String(policyId);
  store[key] = { ...store[key], payoutTxHash: hash };
  saveTxStore(store);
}

export function getTxData(policyId: string | number): TxRecord {
  return loadTxStore()[String(policyId)] || {};
}
