
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor } from 'lucide-react';

const TrackingConsole = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/arctrack-central')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tracking Console</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Real-time Device Tracking</h2>
          <p className="text-gray-600 mb-6">This section will contain your device tracking interface and real-time monitoring tools.</p>
          <p className="text-sm text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default TrackingConsole;
