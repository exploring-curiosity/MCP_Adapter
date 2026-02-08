import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoBar } from "@/components/landing/LogoBar";
import { Services } from "@/components/landing/Services";
import { PipelineSection } from "@/components/landing/PipelineSection";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LogoBar />
      <Services />
      <PipelineSection />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}
