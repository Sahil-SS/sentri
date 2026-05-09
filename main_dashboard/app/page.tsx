import Navbar from "@/components/navbar/Navbar";
import ScrollProgress from "@/components/shared/ScrollProgress";
import HeroSection from "@/components/hero/HeroSection";
import OverviewSection from "@/components/overview/OverviewSection";
import TechSection from "@/components/technology/TechSection";

export default function HomePage() {
  return (
    <main className="bg-[var(--void)] overflow-hidden">
      <Navbar />

      <ScrollProgress />

      <HeroSection />

      <OverviewSection />

      <TechSection />
    </main>
  );
}