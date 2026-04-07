import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Smartphone, ChevronDown, ChevronRight, Plus, FolderPlus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { DeviceInfo } from '@/types/database-analytics';

interface DeviceSelectorProps {
  selectedDevice: DeviceInfo | null;
  onDeviceSelect: (device: DeviceInfo) => void;
}

const DeviceSelector = ({ selectedDevice, onDeviceSelect }: DeviceSelectorProps) => {
  const { currentUser } = useAuth();
  const { projects, loading } = useProjects(currentUser);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getDeviceCount = (devices: { [key: string]: any }) =>
    Object.keys(devices || {}).length;

  const handleDeviceSelect = (deviceId: string, projectName: string) => {
    onDeviceSelect({ id: deviceId, name: `Device ${deviceId}`, projectName });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-5 bg-muted rounded w-3/4" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-muted rounded" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-4 text-center py-10">
        <FolderPlus className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-xs font-medium text-muted-foreground mb-1">No Projects Found</p>
        <p className="text-xs text-muted-foreground/60 mb-4">Create a project and add devices to get started</p>
        <Button
          size="sm"
          onClick={() => navigate('/projects-users-devices')}
          variant="outline"
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Go to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-1.5">
      {projects.map(project => {
        const deviceCount = getDeviceCount(project.devices);
        const isExpanded = expandedProjects.includes(project.id);

        return (
          <div key={project.id} className="rounded-lg border border-border overflow-hidden">
            <Collapsible>
              <CollapsibleTrigger className="w-full" onClick={() => toggleProject(project.id)}>
                <div className="px-3 py-2.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded
                      ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    }
                    <span className="text-xs font-medium text-foreground truncate text-left">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{deviceCount}</span>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-border bg-muted/30 px-2 py-1.5">
                  {deviceCount === 0 ? (
                    <p className="text-xs text-muted-foreground/60 text-center py-2">No devices</p>
                  ) : (
                    <div className="space-y-0.5">
                      {Object.keys(project.devices).map(deviceId => (
                        <button
                          key={deviceId}
                          onClick={() => handleDeviceSelect(deviceId, project.name)}
                          className={[
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors',
                            selectedDevice?.id === deviceId
                              ? 'bg-primary/5 text-primary border border-primary/20'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          ].join(' ')}
                        >
                          <Smartphone className="h-3 w-3 shrink-0" />
                          <span className="font-mono truncate">{deviceId}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceSelector;
