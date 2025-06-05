
import { Button } from "@/components/ui/button";
import { Satellite, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Satellite className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">WildTrack GPS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#technologies" className="text-gray-700 hover:text-green-600 transition-colors">Technologies</a>
            <a href="#products" className="text-gray-700 hover:text-green-600 transition-colors">Products</a>
            <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            <Button className="bg-green-600 hover:bg-green-700">Get Quote</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#technologies" className="block text-gray-700 hover:text-green-600 transition-colors">Technologies</a>
            <a href="#products" className="block text-gray-700 hover:text-green-600 transition-colors">Products</a>
            <a href="#services" className="block text-gray-700 hover:text-green-600 transition-colors">Services</a>
            <a href="#contact" className="block text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            <Button className="w-full bg-green-600 hover:bg-green-700">Get Quote</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
