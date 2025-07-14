
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Database, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DevicesSidebarProps {
  selectedDevice: string | null;
  onDeviceSelect: (deviceId: string, deviceName: string, projectName: string) => void;
}

const DevicesSidebar = ({ selectedDevice, onDeviceSelect }: DevicesSidebarProps) => {
  const { currentUser } = useAuth();
  const { projects, loading } = useProjects(currentUser);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getDeviceCount = (devices: { [key: string]: any }) => {
    return Object.keys(devices || {}).length;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database className="h-5 w-5 text-green-600" />
          Devices & Projects
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No projects with devices found</p>
          </div>
        ) : (
          projects.map(project => {
            const deviceCount = getDeviceCount(project.devices);
            const isExpanded = expandedProjects.includes(project.id);
            
            return (
              <Card key={project.id} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleProject(project.id)}
                  >
                    <CardHeader className="pb-2 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <CardTitle className="text-sm font-medium text-left">
                            {project.name}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {deviceCount} devices
                        </Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {deviceCount === 0 ? (
                        <p className="text-xs text-gray-500 italic">No devices in this project</p>
                      ) : (
                        <div className="space-y-1">
                          {Object.keys(project.devices).map(deviceId => (
                            <Button
                              key={deviceId}
                              variant={selectedDevice === deviceId ? "default" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => onDeviceSelect(deviceId, `Device ${deviceId}`, project.name)}
                            >
                              <Smartphone className="h-3 w-3 mr-2" />
                              Device {deviceId}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DevicesSidebar;
