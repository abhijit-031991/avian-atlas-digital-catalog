
import { Button } from "@/components/ui/button";
import { Satellite, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetQuote = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  const handleTrackingClick = () => {
    window.location.href = '/tracking/tracking.html';
  };

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Satellite className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ArcTrack Telemetry</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('technologies')} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Technologies
            </button>
            <button 
              onClick={() => handleNavClick('products')} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Products
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={handleContactClick} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGetQuote}>Get Quote</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleTrackingClick}>Tracking</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <button 
              onClick={() => handleNavClick('technologies')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Technologies
            </button>
            <button 
              onClick={() => handleNavClick('products')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Products
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Services
            </button>
            <button 
              onClick={handleContactClick} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Contact
            </button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2" onClick={handleGetQuote}>
              Get Quote
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleTrackingClick}>
              Tracking
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
