
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeviceSelector from './DeviceSelector';
import DataTableView from './DataTableView';
import MapView from './MapView';
import StatsPanel from './StatsPanel';
import { useDeviceData } from './hooks/useDeviceData';
import { DeviceInfo, ViewMode, DataPoint } from '@/types/database-analytics';

const DatabaseAnalyticsLayout = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  const { data, loading, tableExists, totalCount, refreshData } = useDeviceData(selectedDevice?.id || null);

  const handleDeviceSelect = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setFilteredData([]);
  };

  const handleDataChange = (data: DataPoint[]) => {
    setFilteredData(data);
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
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Data Table
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                Map View
              </Button>
              <Button
                variant={viewMode === 'statistics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('statistics')}
              >
                Statistics
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Device Selector */}
        <div className={`${leftSidebarCollapsed ? 'w-12' : 'w-72'} flex-shrink-0 transition-all duration-300 relative`}>
          {leftSidebarCollapsed ? (
            <div className="w-12 h-full bg-white border-r border-gray-200 flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftSidebarCollapsed(false)}
                className="m-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <DeviceSelector
                selectedDevice={selectedDevice}
                onDeviceSelect={handleDeviceSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftSidebarCollapsed(true)}
                className="absolute top-2 right-2 z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 min-h-0">
          {selectedDevice ? (
            viewMode === 'table' ? (
              <DataTableView
                device={selectedDevice}
                data={data}
                loading={loading}
                tableExists={tableExists}
                onRefresh={refreshData}
                onDataChange={handleDataChange}
              />
            ) : viewMode === 'map' ? (
              <MapView
                device={selectedDevice}
                data={data}
                filteredData={filteredData}
                loading={loading}
                tableExists={tableExists}
                onRefresh={refreshData}
              />
            ) : (
              <StatsPanel device={selectedDevice} data={filteredData.length > 0 ? filteredData : data} />
            )
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

export default DatabaseAnalyticsLayout;
