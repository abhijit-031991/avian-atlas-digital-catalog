
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Globe, Database, BarChart3, Cloud, HeadphonesIcon } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Smartphone,
      title: "Android Mobile App",
      description: "User-friendly mobile application for field researchers and wildlife managers.",
      features: ["Real-time tracking", "Offline maps", "Data collection", "Push notifications"]
    },
    {
      icon: Globe,
      title: "Web-Based Platform",
      description: "Comprehensive web interface for data analysis and project management.",
      features: ["Interactive maps", "Multi-user access", "Export tools", "Custom dashboards"]
    },
    {
      icon: Database,
      title: "Data Hosting",
      description: "Secure cloud storage with automatic backups and 99.9% uptime guarantee.",
      features: ["Encrypted storage", "Automatic backups", "Global CDN", "API access"]
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Advanced data analysis tools and customizable reporting features.",
      features: ["Migration analysis", "Habitat mapping", "Behavior patterns", "Custom reports"]
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamless integration with popular research platforms and databases.",
      features: ["API connectivity", "Data synchronization", "Third-party integrations", "Workflow automation"]
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support",
      description: "Dedicated support team with expertise in wildlife tracking and research.",
      features: ["24/7 support", "Training programs", "Field assistance", "Equipment maintenance"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Tracking Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond hardware, we provide a comprehensive ecosystem of software solutions, 
            data hosting, and support services for your wildlife tracking projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
