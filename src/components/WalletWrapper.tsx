"use client";

import { WalletProvider } from "@/context/WalletContext";

export default function WalletWrapper({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
