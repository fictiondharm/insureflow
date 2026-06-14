import Link from "next/link";
import { Shield, BookOpen, HelpCircle } from "lucide-react";

const footerLinks = [
  {
    title: "Products",
    links: [
      { label: "Flight Delay", href: "/buy/flight" },
      { label: "Rain Coverage", href: "/buy/rain" },
      { label: "Shipping Cover", href: "/buy/shipping" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Documentation", href: "/docs" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Protocol",
    links: [
      { label: "How It Works", href: "/docs#how-it-works" },
      { label: "Fee Structure", href: "/docs#fees" },
      { label: "Security", href: "/docs#security" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold text-ink tracking-tight">InsureFlow</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Parametric insurance powered by smart contracts on Base. No claims, no paperwork, no waiting.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link href="/docs" className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:text-coral hover:border-coral/40 transition-all duration-200">
                <BookOpen className="w-3.5 h-3.5" />
              </Link>
              <Link href="/faq" className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:text-coral hover:border-coral/40 transition-all duration-200">
                <HelpCircle className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-ink uppercase tracking-[0.1em] mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted hover:text-ink transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-muted">
          <p>&copy; 2026 InsureFlow. Built on Base.</p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-ink transition-colors">Docs</Link>
            <Link href="/faq" className="hover:text-ink transition-colors">FAQ</Link>
            <Link href="/docs#fees" className="hover:text-ink transition-colors">Fees</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
