"use client";

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatUnits,
  parseUnits,
  type Address,
} from "viem";
import { baseSepolia } from "viem/chains";
import { CONTRACTS } from "@/config/contracts";

import { POLICY_ESCROW_ABI, PREMIUM_POOL_ABI, MOCK_USDC_ABI } from "@/abi";
export { POLICY_ESCROW_ABI, PREMIUM_POOL_ABI, MOCK_USDC_ABI };

export const POLICY_ESCROW_ADDRESS = (CONTRACTS.POLICY_ESCROW || "") as Address;
const STABLECOIN = (CONTRACTS.STABLECOIN || "") as Address;

export function createPublicViemClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org"),
  });
}

export async function createWalletViemClient() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet found. Install MetaMask.");
  }
  const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
  return createWalletClient({
    account: account as Address,
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });
}

export async function getUSDCBalance(address: Address): Promise<string> {
  const publicClient = createPublicViemClient();
  const balance = await publicClient.readContract({
    address: STABLECOIN,
    abi: MOCK_USDC_ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return formatUnits(balance as bigint, 6);
}

export async function faucetUSDC(address: Address, amount: number): Promise<`0x${string}`> {
  const walletClient = await createWalletViemClient();
  const publicClient = createPublicViemClient();
  const hash = await walletClient.writeContract({
    address: STABLECOIN,
    abi: MOCK_USDC_ABI,
    functionName: "faucet",
    args: [address, BigInt(amount)],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}

export async function approveUSDC(spender: Address, amount: bigint): Promise<`0x${string}`> {
  const walletClient = await createWalletViemClient();
  const publicClient = createPublicViemClient();
  const hash = await walletClient.writeContract({
    address: STABLECOIN,
    abi: MOCK_USDC_ABI,
    functionName: "approve",
    args: [spender, amount],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}

export interface OnChainPolicy {
  policyId: number;
  user: Address;
  product: number;
  premium: string;
  payoutAmount: string;
  createdAt: number;
  eventDate: number;
  metadata: string;
  status: number;
  settled: boolean;
}

const PRODUCT_MAP: Record<number, string> = {
  0: "flight",
  1: "rain",
  2: "shipping",
};

export async function createPolicy(
  productType: number,
  payoutAmount: number,
  eventDate: number,
  metadata: string
): Promise<{ policyId: number; hash: `0x${string}` }> {
  const walletClient = await createWalletViemClient();
  const publicClient = createPublicViemClient();
  const account = walletClient.account?.address;
  if (!account) throw new Error("Wallet not connected");

  const payout = parseUnits(String(payoutAmount), 6);

  const hash = await walletClient.writeContract({
    address: POLICY_ESCROW_ADDRESS,
    abi: POLICY_ESCROW_ABI,
    functionName: "createPolicy",
    args: [productType, payout, BigInt(eventDate), metadata],
    gas: 500000n,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const log = receipt.logs.find(
    (l) =>
      l.address.toLowerCase() === POLICY_ESCROW_ADDRESS.toLowerCase() &&
      l.topics[0] === "0xf75bced829644e48798f2b3590254fab3ec7334fadc76d2c1263e551a560292d"
  );

  const policyId = log ? Number(log.topics[1]) : 0;

  return { policyId, hash };
}

export async function settlePolicy(policyId: number, conditionMet: boolean): Promise<`0x${string}`> {
  const walletClient = await createWalletViemClient();
  const publicClient = createPublicViemClient();
  const hash = await walletClient.writeContract({
    address: POLICY_ESCROW_ADDRESS,
    abi: POLICY_ESCROW_ABI,
    functionName: "settlePayout",
    args: [BigInt(policyId), conditionMet],
    gas: 500000n,
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return hash;
}

export async function getUserPolicyIds(address: Address): Promise<number[]> {
  const publicClient = createPublicViemClient();
  const ids = await publicClient.readContract({
    address: POLICY_ESCROW_ADDRESS,
    abi: POLICY_ESCROW_ABI,
    functionName: "getUserPolicies",
    args: [address],
  });
  return (ids as bigint[]).map(Number);
}

export async function getOnChainPolicy(policyId: number): Promise<OnChainPolicy> {
  const publicClient = createPublicViemClient();
  const raw = await publicClient.readContract({
    address: POLICY_ESCROW_ADDRESS,
    abi: POLICY_ESCROW_ABI,
    functionName: "getPolicy",
    args: [BigInt(policyId)],
  });
  const r = raw as any;
  return {
    policyId,
    user: r[0] as Address,
    product: Number(r[1]),
    premium: formatUnits(r[2] as bigint, 6),
    payoutAmount: formatUnits(r[3] as bigint, 6),
    createdAt: Number(r[4]),
    eventDate: Number(r[5]),
    metadata: r[6] as string,
    status: Number(r[7]),
    settled: r[8] as boolean,
  };
}

export async function checkAndSwitchChain(): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) return;
  const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
  if (Number(chainIdHex) !== baseSepolia.id) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${baseSepolia.id.toString(16)}`,
              chainName: "Base Sepolia",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://sepolia.base.org"],
              blockExplorerUrls: ["https://sepolia.basescan.org"],
            },
          ],
        });
      }
    }
  }
}
