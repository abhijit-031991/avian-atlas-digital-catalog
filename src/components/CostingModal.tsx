
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Crown, Bird, IndianRupee, Satellite, Radio, Globe } from "lucide-react";

interface CostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CostingModal = ({ isOpen, onClose }: CostingModalProps) => {
  if (!isOpen) return null;

  const collarPricing = [
    {
      size: "Small (150-250g)",
      animals: "Small carnivores, cats",
      technologies: {
        lora: { price: "₹68,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹96,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹1,32,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["2-year battery", "Drop-off mechanism", "Waterproof IP67"]
    },
    {
      size: "Medium (300-500g)",
      animals: "Wolves, deer, medium ungulates",
      technologies: {
        lora: { price: "₹96,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹1,20,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹1,65,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["3-year battery", "Enhanced durability", "Custom fit sizing"]
    },
    {
      size: "Large (600-800g)",
      animals: "Bears, elk, large ungulates",
      technologies: {
        lora: { price: "₹1,32,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹1,65,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹2,20,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["5-year battery", "Heavy-duty construction", "Satellite ready"]
    }
  ];

  const birdTagPricing = [
    {
      size: "Ultra-light (3-8g)",
      animals: "Small songbirds, warblers",
      technologies: {
        lora: { price: "₹36,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹45,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹68,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["Solar charging", "1-year battery backup", "Harness attachment"]
    },
    {
      size: "Standard (10-15g)",
      animals: "Raptors, seabirds",
      technologies: {
        lora: { price: "₹52,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹65,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹85,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["Enhanced solar panel", "2-year battery", "Weather resistant"]
    },
    {
      size: "Heavy-duty (18-25g)",
      animals: "Large raptors, waterfowl",
      technologies: {
        lora: { price: "₹68,000", icon: Radio, color: "text-cyan-600" },
        gsm: { price: "₹85,000", icon: Satellite, color: "text-blue-600" },
        satellite: { price: "₹1,10,000", icon: Globe, color: "text-purple-600" }
      },
      features: ["Extended range", "3-year battery", "Advanced GPS chipset"]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Product Specifications & Pricing</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* GPS Collars Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Crown className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">GPS Tracking Collars</h3>
            </div>
            <div className="space-y-6">
              {collarPricing.map((collar, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{collar.size}</CardTitle>
                    <CardDescription>{collar.animals}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      {Object.entries(collar.technologies).map(([tech, details]) => {
                        const IconComponent = details.icon;
                        return (
                          <div key={tech} className="border rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <IconComponent className={`h-5 w-5 ${details.color}`} />
                              <span className="font-medium text-sm uppercase">{tech}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <IndianRupee className={`h-5 w-5 ${details.color}`} />
                              <span className={`text-xl font-bold ${details.color}`}>{details.price.replace('₹', '')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Features:</h5>
                      <div className="flex flex-wrap gap-1">
                        {collar.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bird Tags Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Bird className="h-6 w-6 text-cyan-600" />
              <h3 className="text-xl font-semibold text-gray-900">GPS Bird Tags</h3>
            </div>
            <div className="space-y-6">
              {birdTagPricing.map((tag, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{tag.size}</CardTitle>
                    <CardDescription>{tag.animals}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      {Object.entries(tag.technologies).map(([tech, details]) => {
                        const IconComponent = details.icon;
                        return (
                          <div key={tech} className="border rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <IconComponent className={`h-5 w-5 ${details.color}`} />
                              <span className="font-medium text-sm uppercase">{tech}</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <IndianRupee className={`h-5 w-5 ${details.color}`} />
                              <span className={`text-xl font-bold ${details.color}`}>{details.price.replace('₹', '')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Features:</h5>
                      <div className="flex flex-wrap gap-1">
                        {tag.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Pricing Includes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete tracking device with GPS technology</li>
              <li>• 1-year data hosting and analytics platform access</li>
              <li>• Mobile and web application licenses</li>
              <li>• Technical support and training</li>
              <li>• Warranty coverage (1-2 years depending on model)</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              * Bulk discounts available for orders of 10+ units. Custom configurations and extended warranties available upon request.
            </p>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Request Custom Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CostingModal;
