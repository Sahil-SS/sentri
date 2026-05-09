import Navbar from "@/components/navbar/Navbar";
import ScrollProgress from "@/components/shared/ScrollProgress";
import HeroSection from "@/components/hero/HeroSection";
import OverviewSection from "@/components/overview/OverviewSection";
import TechSection from "@/components/technology/TechSection";
import TeamSection from "@/components/team/TeamSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <main className="bg-(--void) overflow-hidden">
      <Navbar />

      <ScrollProgress />

      <HeroSection />

      <OverviewSection />

      <TechSection />

      <TeamSection />

      <ContactSection />

      <Footer />
    </main>
  );
}