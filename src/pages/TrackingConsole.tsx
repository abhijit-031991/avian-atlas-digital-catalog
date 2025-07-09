
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, MapPin, Satellite } from 'lucide-react';
import MapComponent from '@/components/MapComponent';

const TrackingConsole = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/arctrack-central')}
                variant="outline"
                size="icon"
                className="hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <Satellite className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tracking Console</h1>
                  <p className="text-sm text-gray-500">Real-time device monitoring</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Tracking</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Welcome back</p>
                <p className="text-xs text-gray-500">{currentUser.displayName || currentUser.email}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Component */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <MapComponent />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Map</h3>
                <p className="text-sm text-gray-500">Click markers for details</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              View real-time locations of all your tracked devices with detailed information in popup windows.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Satellite className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Device Status</h3>
                <p className="text-sm text-gray-500">Battery & signal info</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Monitor battery levels, signal strength, and last contact times for all your devices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Export</h3>
                <p className="text-sm text-gray-500">Download tracking data</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Export detailed tracking data and analytics for further analysis and reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingConsole;
