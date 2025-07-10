
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Satellite, Radio, Globe, HardDrive, Mail, Phone, Clock } from "lucide-react";
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

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
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
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleContactClick}
                >
                  Get Quote
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Your Custom Quote
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contact our team to discuss your wildlife tracking needs and receive a personalized solution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Request Information</CardTitle>
                <CardDescription>
                  Tell us about your project and we'll provide detailed specifications and pricing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@university.edu" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" placeholder="University or Research Institution" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technology">Technology Interest</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gps-gsm">GPS-GSM</SelectItem>
                      <SelectItem value="gps-lora">GPS-LoRa</SelectItem>
                      <SelectItem value="gps-satellite">GPS-Satellite (Coming Soon)</SelectItem>
                      <SelectItem value="gps-loggers">GPS-Loggers</SelectItem>
                      <SelectItem value="complete-solution">Complete Solution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your wildlife tracking project, target species, study duration, and any specific requirements..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Send Inquiry
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">info@arcturus-telemetry.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+91 9740997229</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">29, 1st Main, 4th Cross, Nethajinagar,<br />Mathikere - Bangalore -560054</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-gray-600">Mon-Fri: 8AM - 6PM IST<br />Emergency support 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
