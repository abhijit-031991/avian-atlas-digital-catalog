
import { Satellite, Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Satellite className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ArcTrack Telemetry</span>
            </div>
            <p className="text-gray-400">
              Leading provider of GPS telemetry solutions for wildlife conservation and research.
            </p>
            <div className="flex space-x-4">
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Technologies</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">GPS-GSM Collars</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">GPS-LoRa Systems</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">GPS-Satellite (Coming Soon)</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">GPS-Loggers</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Bird Tags</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Mobile Apps</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Web Platform</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Data Hosting</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Analytics</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Technical Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@arcturus-telemetry.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9740997229</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>29, 1st Main, 4th Cross, Nethajinagar, Mathikere - Bangalore -560054</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ArcTrack Telemetry. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
