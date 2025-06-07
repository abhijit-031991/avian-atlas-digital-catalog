
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Radio, Globe, Signal, Battery, MapPin } from "lucide-react";

const TechnologyShowcase = () => {
  const technologies = [
    {
      id: "gps-gsm",
      title: "GPS-GSM",
      description: "Reliable cellular network connectivity for real-time tracking in areas with mobile coverage.",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: ["Real-time tracking", "Global coverage", "SMS alerts", "Low power consumption"],
      status: "Available",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "gps-lora",
      title: "GPS-LoRa",
      description: "Long-range, low-power wireless communication perfect for remote wildlife monitoring.",
      icon: Radio,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      features: ["Long range (15km+)", "Ultra-low power", "Mesh networking", "Cost effective"],
      status: "Available",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "gps-satellite",
      title: "GPS-Satellite",
      description: "Cutting-edge satellite communication for truly remote locations without any ground infrastructure.",
      icon: Satellite,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      features: ["Global coverage", "No infrastructure needed", "Emergency alerts", "Weather resistant"],
      status: "Coming Soon",
      statusColor: "bg-orange-100 text-orange-800"
    }
  ];

  return (
    <section id="technologies" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Technology Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of GPS telemetry technologies, each designed for specific 
            tracking requirements and environmental conditions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((tech) => {
            const IconComponent = tech.icon;
            return (
              <Card key={tech.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${tech.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 ${tech.color}`} />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-2xl font-bold">{tech.title}</CardTitle>
                    <Badge className={tech.statusColor}>{tech.status}</Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    {tech.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    {tech.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Signal className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
