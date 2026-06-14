import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsureFlow — Parametric Insurance on Base",
  description:
    "Crypto-native parametric insurance for flight delays, rain events & shipping disruptions. No claims. No paperwork. Instant payouts.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HashScrollHandler from "@/components/HashScrollHandler";
import WalletWrapper from "@/components/WalletWrapper";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen paper-texture">
        <HashScrollHandler />
        <WalletWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </WalletWrapper>
      </body>
    </html>
  );
}
