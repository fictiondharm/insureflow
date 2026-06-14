"use client";

import { Plane, CloudRain, Package } from "lucide-react";

export function FlightCardIllus() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Radar ring */}
      <div className="absolute w-28 h-28 rounded-full border border-coral/15 animate-pulse-scale" />
      <div className="absolute w-20 h-20 rounded-full border border-coral/10" />
      {/* Plane */}
      <div className="relative z-10 animate-fly">
        <Plane className="w-14 h-14 text-coral" />
      </div>
      {/* Contrail dots */}
      <div className="absolute bottom-[38%] right-[58%] flex items-center gap-1.5">
        <span className="w-1 h-1 bg-coral/30 rounded-full" />
        <span className="w-1.5 h-1.5 bg-coral/20 rounded-full" />
        <span className="w-2 h-2 bg-coral/10 rounded-full" />
      </div>
    </div>
  );
}

export function RainCardIllus() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Shield background */}
      <div className="absolute w-20 h-20 border-2 border-jade/10 rounded-full" />
      {/* Cloud */}
      <div className="relative z-10 mb-2">
        <CloudRain className="w-14 h-14 text-jade" />
      </div>
      {/* Raindrops */}
      <div className="absolute bottom-[20%] flex gap-2">
        <span className="w-1 h-3 bg-jade/40 rounded-full animate-rain-drop" />
        <span className="w-1 h-3 bg-jade/30 rounded-full animate-rain-drop-d1" />
        <span className="w-1 h-3 bg-jade/20 rounded-full animate-rain-drop-d2" />
      </div>
    </div>
  );
}

export function ShippingCardIllus() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Route line */}
      <div className="absolute bottom-[30%] left-[15%] right-[15%] h-px bg-amber/20" />
      <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-amber/30 rounded-full" />
      <div className="absolute bottom-[30%] right-[20%] w-2 h-2 bg-amber/30 rounded-full" />
      {/* Package */}
      <div className="relative z-10 animate-slide-lr">
        <Package className="w-14 h-14 text-amber" />
      </div>
    </div>
  );
}
