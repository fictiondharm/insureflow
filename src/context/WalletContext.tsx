"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Address } from "viem";
import { getUSDCBalance, checkAndSwitchChain } from "@/lib/contracts";

interface WalletState {
  address: Address | null;
  isConnected: boolean;
  chainId: number | null;
  usdcBalance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletState>({
  address: null,
  isConnected: false,
  chainId: null,
  usdcBalance: "0",
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState("0");

  const refreshBalance = useCallback(async () => {
    if (!address) return;
    try {
      const bal = await getUSDCBalance(address);
      setUsdcBalance(bal);
    } catch {
      setUsdcBalance("0");
    }
  }, [address]);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to connect.");
      return;
    }

    await checkAndSwitchChain();

    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      setAddress(accounts[0] as Address);
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(Number(chainIdHex));
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setUsdcBalance("0");
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [address, refreshBalance]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0] as Address);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(Number(chainIdHex));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        chainId,
        usdcBalance,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
