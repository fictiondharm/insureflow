import HeroSection from "@/components/HeroSection";
import MarqueeTicker from "@/components/MarqueeTicker";
import ProductGrid from "@/components/ProductGrid";
import HowItWorks from "@/components/HowItWorks";
import RealWorldSection from "@/components/RealWorldSection";
import LiveStats from "@/components/LiveStats";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeTicker />
      <ProductGrid />
      <HowItWorks />
      <RealWorldSection />
      <LiveStats />
      <Testimonials />
      <CTASection />
    </>
  );
}
