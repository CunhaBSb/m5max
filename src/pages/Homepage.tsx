import { useState } from "react";
import { OrcamentoModal } from "@/components/OrcamentoModal";
import { contactInfo } from "@/data/homepage-data";

// Layout Components
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Section Components
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { KitsSection } from "@/components/sections/KitsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ContactSection } from "@/components/sections/ContactSection";

// UI Components
import { SectionSeparator } from "@/components/ui/SectionSeparator";

const Homepage = () => {
  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(false);

  const handleRequestQuote = () => {
    setIsOrcamentoOpen(true);
  };

  return (
    <>
      <Header onRequestQuote={handleRequestQuote} />
      
      <main>
        <HeroSection onRequestQuote={handleRequestQuote} />
        <SectionSeparator variant="professional" />
        <AboutSection />
        <SectionSeparator variant="diamond" />
        <ServicesSection />
        <SectionSeparator variant="dots" />
        <KitsSection onRequestQuote={handleRequestQuote} />
        <SectionSeparator variant="wave" />
        <HowItWorksSection />
        <SectionSeparator variant="line" />
        <ContactSection onRequestQuote={handleRequestQuote} />
      </main>
      
      <Footer />
      
      <OrcamentoModal 
        isOpen={isOrcamentoOpen} 
        onClose={() => setIsOrcamentoOpen(false)} 
      />
      
    </>
  );
};

export default Homepage;