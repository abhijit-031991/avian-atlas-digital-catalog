
import Hero from "@/components/Hero";
import TechnologyShowcase from "@/components/TechnologyShowcase";
import ProductCategories from "@/components/ProductCategories";
import ServicesSection from "@/components/ServicesSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TechnologyShowcase />
      <ProductCategories />
      <ServicesSection />
      <Footer />
    </div>
  );
};

export default Index;
