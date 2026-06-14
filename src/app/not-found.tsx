import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-clay flex items-center justify-center mx-auto mb-8">
          <Shield className="w-10 h-10 text-terracotta" />
        </div>

        <h1 className="text-6xl font-serif text-charcoal mb-4">404</h1>
        <p className="text-lg text-muted mb-2">Page not found</p>
        <p className="text-sm text-muted/70 mb-10">
          This page doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-charcoal text-cream font-medium hover:bg-charcoal/90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
