
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Database, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceSelector from './DeviceSelector';
import DataTableView from './DataTableView';
import StatsPanel from './StatsPanel';
import { useDeviceData } from './hooks/useDeviceData';
import { DeviceInfo, DataPoint } from '@/types/database-analytics';
import { Deployment, DeploymentRange } from '@/types/deployments';

type ViewMode = 'table' | 'statistics';

const DatabaseAnalyticsLayout = () => {
  const [selectedDevice, setSelectedDevice]     = useState<DeviceInfo | null>(null);
  const [viewMode, setViewMode]                 = useState<ViewMode>('table');
  const [filteredData, setFilteredData]         = useState<DataPoint[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(null);
  const [deploymentRange, setDeploymentRange]   = useState<DeploymentRange | null>(null);

  const { data, loading, tableExists, refreshData } = useDeviceData(selectedDevice?.id || null);

  const handleDeviceSelect = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setFilteredData([]);
    // Only clear deployment if switching to a different device
    if (device.id !== selectedDevice?.id) {
      setActiveDeployment(null);
      setDeploymentRange(null);
    }
  };

  const handleDeploymentSelect = (
    device: DeviceInfo,
    deployment: Deployment | null,
    range: DeploymentRange | null,
  ) => {
    setSelectedDevice(device);
    setActiveDeployment(deployment);
    setDeploymentRange(range);
    setFilteredData([]);
  };

  return (
    <div className="h-[calc(100vh-52px)] bg-background flex overflow-hidden">

      {/* ── Left sidebar ──────────────────────────────────────────────── */}
      <div className={`${sidebarCollapsed ? 'w-10' : 'w-72'} shrink-0 transition-all duration-300 flex flex-col bg-card border-r border-border`}>
        {sidebarCollapsed ? (
          <Button
            variant="outline" size="sm"
            onClick={() => setSidebarCollapsed(false)}
            className="m-1.5 w-7 h-7 p-0 border-border hover:bg-muted hover:text-foreground"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-primary" />
                Devices
              </span>
              <Button
                variant="outline" size="sm"
                onClick={() => setSidebarCollapsed(true)}
                className="h-6 w-6 p-0 border-border hover:bg-muted hover:text-foreground"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <DeviceSelector
                selectedDevice={selectedDevice}
                selectedDeployment={activeDeployment}
                onDeviceSelect={handleDeviceSelect}
                onDeploymentSelect={handleDeploymentSelect}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selectedDevice ? (
          <>
            {/* Sub-nav */}
            <div className="px-5 py-2.5 border-b border-border flex items-center gap-3 shrink-0 bg-background">
              {/* Material filled chip — device ID */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 font-mono text-sm font-semibold text-primary shrink-0">
                <Database className="h-3.5 w-3.5" />
                {selectedDevice.id}
              </span>

              {/* Active deployment — suggestion chip */}
              {activeDeployment && (
                <>
                  <span className="text-muted-foreground/30 text-sm">·</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-xs font-medium text-violet-400 shrink-0">
                    <Layers className="h-3 w-3" />
                    {activeDeployment.name}
                  </span>
                </>
              )}

              <span className="flex-1" />

              {/* Material segmented button */}
              <div className="flex items-center border border-border rounded-full overflow-hidden shrink-0">
                {([
                  { id: 'table',      label: 'Data Table' },
                  { id: 'statistics', label: 'Statistics' },
                ] as { id: ViewMode; label: string }[]).map(({ id, label }, i) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id)}
                    className={[
                      'px-4 py-1.5 text-xs font-medium transition-all',
                      i > 0 ? 'border-l border-border' : '',
                      viewMode === id
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* View content */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              {viewMode === 'table' && (
                <DataTableView
                  device={selectedDevice}
                  data={data}
                  loading={loading}
                  tableExists={tableExists}
                  onRefresh={refreshData}
                  onDataChange={setFilteredData}
                  deploymentRange={deploymentRange}
                />
              )}
              {viewMode === 'statistics' && (
                <StatsPanel
                  device={selectedDevice}
                  data={filteredData.length > 0 ? filteredData : data}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Database className="h-14 w-14 mx-auto mb-4 text-muted-foreground/20" />
              <h3 className="text-base font-medium text-foreground mb-1">Select a Device</h3>
              <p className="text-sm text-muted-foreground">
                Choose a device from the sidebar to view its data and analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseAnalyticsLayout;
