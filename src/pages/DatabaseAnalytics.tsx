
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database } from 'lucide-react';
import DevicesSidebar from '@/components/DevicesSidebar';
import DataTable from '@/components/DataTable';
import AnalyticsMap from '@/components/AnalyticsMap';
import StatisticsPanel from '@/components/StatisticsPanel';

const DatabaseAnalytics = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>('');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [activeView, setActiveView] = useState<'table' | 'map'>('table');

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const handleDeviceSelect = (deviceId: string, deviceName: string, projectName: string) => {
    setSelectedDevice(deviceId);
    setSelectedDeviceName(deviceName);
    setSelectedProjectName(projectName);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/arctrack-central')}
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Database and Analytics</h1>
          </div>
          
          {selectedDevice && (
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant={activeView === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('table')}
              >
                Data Table
              </Button>
              <Button
                variant={activeView === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('map')}
              >
                Map View
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar - Devices */}
        <DevicesSidebar
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Data View */}
          <div className="flex-1 p-4">
            {activeView === 'table' ? (
              <DataTable
                deviceId={selectedDevice}
                deviceName={selectedDeviceName}
                projectName={selectedProjectName}
              />
            ) : (
              <AnalyticsMap
                deviceId={selectedDevice}
                deviceName={selectedDeviceName}
              />
            )}
          </div>

          {/* Bottom Statistics Panel */}
          <StatisticsPanel
            deviceId={selectedDevice}
            deviceName={selectedDeviceName}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseAnalytics;
