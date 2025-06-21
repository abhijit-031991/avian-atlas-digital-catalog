
import { Button } from "@/components/ui/button";
import { Satellite, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleTrackingClick = () => {
    window.location.href = '/tracking/tracking.html';
  };

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleMyAccountClick = () => {
    navigate('/my-account');
    setIsMenuOpen(false);
  };

  const handleAIChatClick = () => {
    const aiChatSection = document.getElementById('ai-chat');
    if (aiChatSection) {
      aiChatSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
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
              onClick={() => handleNavClick('contact')} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button 
              onClick={handleAIChatClick} 
              className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" fill="currentColor"/>
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" transform="translate(-5, 0) scale(0.8)" fill="currentColor" opacity="0.7"/>
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" transform="translate(5, 0) scale(0.8)" fill="currentColor" opacity="0.7"/>
              </svg>
              AI Assistant
            </button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleTrackingClick}>Tracking</Button>
            
            {/* Authentication buttons */}
            {currentUser ? (
              <Button 
                variant="outline" 
                onClick={handleMyAccountClick}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {currentUser.displayName || 'My Account'}
              </Button>
            ) : (
              <Button onClick={handleAuthClick}>
                Sign In
              </Button>
            )}
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
              onClick={() => handleNavClick('contact')}  
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Contact
            </button>
            <button 
              onClick={handleAIChatClick} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2 flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" fill="currentColor"/>
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" transform="translate(-5, 0) scale(0.8)" fill="currentColor" opacity="0.7"/>
                <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" transform="translate(5, 0) scale(0.8)" fill="currentColor" opacity="0.7"/>
              </svg>
              AI Assistant
            </button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-2" onClick={handleTrackingClick}>
              Tracking
            </Button>
            
            {/* Mobile Authentication buttons */}
            {currentUser ? (
              <Button 
                variant="outline" 
                className="w-full mb-2 flex items-center justify-center gap-2"
                onClick={handleMyAccountClick}
              >
                <User className="h-4 w-4" />
                {currentUser.displayName || 'My Account'}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleAuthClick}>
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
