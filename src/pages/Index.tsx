
import Hero from "@/components/Hero";
import TechnologyShowcase from "@/components/TechnologyShowcase";
import ProductCategories from "@/components/ProductCategories";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIChatSection from "@/components/AIChatSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnologyShowcase />
      <ProductCategories />
      <ServicesSection />
      <AIChatSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
