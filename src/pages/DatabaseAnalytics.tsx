
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
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
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

      {/* Main Content - Fixed Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Fixed Width */}
        <div className="w-72 flex-shrink-0">
          <DevicesSidebar
            selectedDevice={selectedDevice}
            onDeviceSelect={handleDeviceSelect}
          />
        </div>

        {/* Main Content Area - Flexible */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedDevice ? (
            <>
              {/* Data View */}
              <div className="flex-1 p-4 min-h-0">
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
              <div className="flex-shrink-0">
                <StatisticsPanel
                  deviceId={selectedDevice}
                  deviceName={selectedDeviceName}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a Device</h3>
                <p className="text-sm">Choose a device from the sidebar to view its data and analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseAnalytics;
