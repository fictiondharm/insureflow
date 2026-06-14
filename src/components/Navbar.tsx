"use client";

import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const navLinks = [
  { label: "Products", href: "#products", hash: "products" as const },
  { label: "How It Works", href: "#how-it-works", hash: "how-it-works" as const },
  { label: "Docs", href: "/docs", hash: null as string | null },
  { label: "FAQ", href: "/faq", hash: null as string | null },
  { label: "Dashboard", href: "/dashboard", hash: null as string | null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function navigateToSection(id: string) {
    if (pathname === "/") {
      scrollTo(id);
    } else {
      window.location.href = "/#" + id;
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            onClick={() => {
              if (pathname === "/") {
                scrollTo("hero");
              } else {
                window.location.href = "/";
              }
            }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-coral flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-ink tracking-tight">
              InsureFlow
            </span>
          </button>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
              link.hash ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigateToSection(link.hash!)}
                  className="text-sm font-medium text-muted hover:text-ink transition-colors duration-200"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted hover:text-ink transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/buy/flight"
              className="px-5 py-2.5 bg-coral text-white text-sm font-bold uppercase tracking-[0.12em] hover:bg-coral-deep transition-all duration-200"
            >
              Get Covered
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-md z-40 transition-all duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) =>
            link.hash ? (
              <button
                key={link.label}
                type="button"
                onClick={() => { navigateToSection(link.hash!); setMobileOpen(false); }}
                className="text-2xl font-medium text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/buy/flight"
            onClick={() => setMobileOpen(false)}
            className="mt-4 px-8 py-3.5 bg-coral text-white font-bold text-base uppercase tracking-[0.12em]"
          >
            Get Covered
          </Link>
        </div>
      </div>
    </nav>
  );
}
