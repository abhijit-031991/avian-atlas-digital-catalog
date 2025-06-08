
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Bird, Shield, Battery } from "lucide-react";
import { useState } from "react";
import CostingModal from "./CostingModal";

const ProductCategories = () => {
  const [isCostingOpen, setIsCostingOpen] = useState(false);

  const products = [
    {
      id: "gps-collars",
      title: "GPS Tracking Collars",
      description: "Professional-grade collars for mammals of all sizes, from small carnivores to large ungulates. Available with GPS-GSM, GPS-LoRa, GPS-Satellite, and GPS-Logger technologies.",
      icon: Crown,
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["Waterproof IP67", "2-5 year battery", "Breakaway mechanism", "Custom fit sizes"],
      applications: ["Research studies", "Population monitoring", "Migration tracking", "Behavior analysis"],
      weight: "150-800g",
      batteryLife: "2-5 years",
      technologies: ["GPS-GSM", "GPS-LoRa", "GPS-Satellite", "GPS-Loggers"]
    },
    {
      id: "bird-tags",
      title: "GPS Bird Tags",
      description: "Ultra-lightweight tracking devices specifically designed for avian species. Available with GPS-GSM, GPS-LoRa, GPS-Satellite, and GPS-Logger technologies.",
      icon: Bird,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["Ultra-lightweight", "Solar charging", "Harness attachment", "Weather resistant"],
      applications: ["Migration studies", "Breeding behavior", "Habitat use", "Conservation efforts"],
      weight: "3-25g",
      batteryLife: "1-3 years",
      technologies: ["GPS-GSM", "GPS-LoRa", "GPS-Satellite", "GPS-Loggers"]
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized tracking devices designed for different wildlife species and research requirements. 
            Each product is available with our full range of GPS technologies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900">
                      <IconComponent className="h-4 w-4 mr-1" />
                      {product.title}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Weight</span>
                      </div>
                      <p className="text-blue-700 font-semibold">{product.weight}</p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Battery className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm font-medium text-cyan-900">Battery</span>
                      </div>
                      <p className="text-cyan-700 font-semibold">{product.batteryLife}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Available Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsCostingOpen(true)}
                  >
                    View Specifications & Pricing
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <CostingModal 
        isOpen={isCostingOpen} 
        onClose={() => setIsCostingOpen(false)} 
      />
    </section>
  );
};

export default ProductCategories;
