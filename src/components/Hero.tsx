
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Satellite, Radio, Globe, HardDrive } from "lucide-react";
import { useState } from "react";
import RequestDemoModal from "./RequestDemoModal";

const Hero = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleExploreProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Wildlife Conservation Technology
                </Badge>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Advanced GPS Telemetry for 
                  <span className="text-blue-600"> Wildlife Tracking</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete tracking solutions with GPS-GSM, GPS-LoRa, GPS-Satellite, and GPS-Logger technologies. 
                  From collars to bird tags and data loggers, we provide the tools researchers need for wildlife conservation.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleExploreProducts}
                >
                  Explore Products
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setIsDemoModalOpen(true)}
                >
                  Request Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">GPS-GSM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Radio className="h-5 w-5 text-cyan-600" />
                  <span className="text-sm text-gray-600">GPS-LoRa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Satellite className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">GPS-Satellite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">GPS-Loggers</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <img 
                  src="/elephant.jpg" 
                  alt="Wildlife tracking technology in action"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};

export default Hero;
