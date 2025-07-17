import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Database, ChevronDown, ChevronRight, Plus, FolderPlus } from 'lucide-react';
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

  const getDeviceCount = (devices: { [key: string]: any }) => {
    return Object.keys(devices || {}).length;
  };

  const handleDeviceSelect = (deviceId: string, projectName: string) => {
    onDeviceSelect({
      id: deviceId,
      name: `Device ${deviceId}`,
      projectName
    });
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
            <FolderPlus className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
            <p className="text-sm mb-4">Get started by creating your first project and adding devices</p>
            <Button 
              onClick={() => navigate('/arctrack-central')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
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
                        <div className="text-center py-4">
                          <p className="text-xs text-gray-500 mb-2">No devices in this project</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate('/arctrack-central')}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Device
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {Object.keys(project.devices).map(deviceId => (
                            <Button
                              key={deviceId}
                              variant={selectedDevice?.id === deviceId ? "default" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => handleDeviceSelect(deviceId, project.name)}
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

export default DeviceSelector;