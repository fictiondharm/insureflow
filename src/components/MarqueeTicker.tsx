"use client";

export default function MarqueeTicker() {
  const items = [
    { value: "2,847", label: "Active Policies" },
    { value: "$2.4M+", label: "Total Coverage" },
    { value: "< 1s", label: "Avg. Payout" },
    { value: "98.7%", label: "Payout Rate" },
    { value: "1,250+", label: "Happy Users" },
  ];

  return (
    <div className="relative overflow-hidden bg-ink border-y border-white/5">
      <div className="flex whitespace-nowrap animate-marquee py-4">
        {[...Array(3)].map((_, outerIdx) => (
          <div key={outerIdx} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={item.label} className="mx-8 text-xs font-medium text-white/50 tracking-[0.12em] flex items-center gap-3 uppercase">
                <span className="text-amber font-bold">{item.value}</span>
                {item.label}
                <span className="w-1 h-1 bg-white/20" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
