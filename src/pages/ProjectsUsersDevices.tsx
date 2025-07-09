import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Smartphone, Trash2, UserPlus, Plus } from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import ProjectList from '@/components/ProjectList';
import AddUserDialog from '@/components/AddUserDialog';
import JoinProjectDialog from '@/components/JoinProjectDialog';
import RemoveUserDialog from '@/components/RemoveUserDialog';
import AddDeviceDialog from '@/components/AddDeviceDialog';
import RemoveDeviceDialog from '@/components/RemoveDeviceDialog';
import { useProjects } from '@/hooks/useProjects';
import { useUserNames } from '@/hooks/useUserNames';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: string[];
  devices: { [key: string]: any };
}

interface Device {
  id: string;
  name: string;
}

const ProjectsUsersDevices = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Project selection state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDevices, setProjectDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const currentFetchRef = useRef<string | null>(null);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [removeDeviceDialogOpen, setRemoveDeviceDialogOpen] = useState(false);
  
  // Action states
  const [creatingProject, setCreatingProject] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [deviceToRemove, setDeviceToRemove] = useState<{ id: string; name: string } | null>(null);

  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    joinProject, 
    addUser, 
    removeUser, 
    deleteProject, 
    addDevice,
    removeDevice,
    getDeviceDetails,
    refetch 
  } = useProjects(currentUser);

  // Get user names for the selected project
  const projectUserIds = useMemo(() => {
    return selectedProject?.users || [];
  }, [selectedProject?.users]);

  const { userNames, loading: loadingUserNames } = useUserNames(projectUserIds);

  // Memoize device IDs to prevent unnecessary re-renders
  const deviceIds = useMemo(() => {
    if (!selectedProject?.devices) return [];
    return Object.keys(selectedProject.devices);
  }, [selectedProject?.devices]);

  // Memoize device IDs string for comparison
  const deviceIdsString = useMemo(() => {
    return deviceIds.join(',');
  }, [deviceIds]);

  // Effect to fetch device details when project is selected
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedProject) {
        setProjectDevices([]);
        currentFetchRef.current = null;
        return;
      }

      if (deviceIds.length === 0) {
        setProjectDevices([]);
        currentFetchRef.current = null;
        return;
      }

      // Create a unique identifier for this fetch operation
      const fetchId = `${selectedProject.id}-${deviceIdsString}`;
      
      // If we're already fetching the same data, don't start a new fetch
      if (currentFetchRef.current === fetchId) {
        return;
      }

      currentFetchRef.current = fetchId;
      setLoadingDevices(true);
      console.log('Fetching devices for project:', selectedProject.id);
      
      try {
        const devicePromises = deviceIds.map(async (deviceId) => {
          try {
            const deviceDetails = await getDeviceDetails(deviceId);
            return deviceDetails || { id: deviceId, name: `Device ${deviceId}` };
          } catch (error) {
            console.error(`Error fetching device ${deviceId}:`, error);
            return { id: deviceId, name: `Device ${deviceId}` };
          }
        });

        const devices = await Promise.all(devicePromises);
        
        // Only update state if this is still the current fetch
        if (currentFetchRef.current === fetchId) {
          setProjectDevices(devices);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        if (currentFetchRef.current === fetchId) {
          setProjectDevices([]);
        }
      } finally {
        if (currentFetchRef.current === fetchId) {
          setLoadingDevices(false);
        }
      }
    };

    fetchDevices();
  }, [selectedProject?.id, deviceIdsString]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  const isProjectOwner = (project: Project) => {
    return project && currentUser && project.uuid === currentUser.uid;
  };

  const handleProjectSelect = (project: Project) => {
    console.log('Selecting project:', project);
    setSelectedProject(project);
  };

  const handleCreateProject = async (name: string, description: string) => {
    setCreatingProject(true);
    try {
      await createProject(name, description);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleJoinProject = async (passkey: string) => {
    try {
      await joinProject(passkey);
      setJoinDialogOpen(false);
    } catch (error) {
      console.error('Failed to join project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setUserToRemove(userId);
    setRemoveUserDialogOpen(true);
  };

  const handleRemoveUserConfirm = async () => {
    if (selectedProject && userToRemove) {
      try {
        await removeUser(selectedProject.id, userToRemove);
        setUserToRemove(null);
        setRemoveUserDialogOpen(false);
        // Refresh projects to get updated user list
        await refetch();
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  };

  const handleAddDevice = async (deviceId: string, deviceName: string, passkey: string) => {
    if (selectedProject) {
      try {
        await addDevice(deviceId, deviceName, passkey, selectedProject.id);
        setAddDeviceDialogOpen(false);
        // Refresh projects to get updated device list
        await refetch();
      } catch (error) {
        console.error('Failed to add device:', error);
      }
    }
  };

  const handleRemoveDevice = (deviceId: string, deviceName: string) => {
    setDeviceToRemove({ id: deviceId, name: deviceName });
    setRemoveDeviceDialogOpen(true);
  };

  const handleRemoveDeviceConfirm = async () => {
    if (selectedProject && deviceToRemove) {
      try {
        await removeDevice(deviceToRemove.id, selectedProject.id);
        setDeviceToRemove(null);
        setRemoveDeviceDialogOpen(false);
        // Refresh projects to get updated device list
        await refetch();
      } catch (error) {
        console.error('Failed to remove device:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Projects List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Button 
            onClick={() => navigate('/arctrack-central')}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Central
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleProjectSelect}
            onCreateProject={() => setCreateDialogOpen(true)}
            onJoinProject={() => setJoinDialogOpen(true)}
            onDeleteProject={handleDeleteProject}
            loading={loading}
            error={error}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {!selectedProject ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Select a Project</h3>
              <p>Choose a project from the left panel to view its details and manage users and devices.</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProject.name}</h1>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Project ID: {selectedProject.id}</span>
                <span>Created: {new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                <span>Owner: {isProjectOwner(selectedProject) ? 'You' : 'Other'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Users ({selectedProject.users.length})
                    </CardTitle>
                    <CardDescription>Manage project team members</CardDescription>
                  </div>
                  {isProjectOwner(selectedProject) && (
                    <Button size="sm" onClick={() => setAddUserDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedProject.users.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No users added yet</p>
                    ) : loadingUserNames ? (
                      <p className="text-gray-500 text-sm text-center py-4">Loading users...</p>
                    ) : (
                      selectedProject.users.map((userId) => (
                        <div key={userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{userNames[userId] || userId}</p>
                            <p className="text-xs text-gray-500">
                              {userId === selectedProject.uuid ? 'Project Owner' : 'Member'}
                            </p>
                          </div>
                          {isProjectOwner(selectedProject) && userId !== selectedProject.uuid && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRemoveUser(userId)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Devices Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Devices ({projectDevices.length})
                    </CardTitle>
                    <CardDescription>Manage tracking devices</CardDescription>
                  </div>
                  {isProjectOwner(selectedProject) && (
                    <Button size="sm" onClick={() => setAddDeviceDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Device
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingDevices ? (
                      <p className="text-gray-500 text-sm text-center py-4">Loading devices...</p>
                    ) : projectDevices.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No devices added yet</p>
                    ) : (
                      projectDevices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{device.name}</p>
                            <p className="text-xs text-gray-500">Device ID: {device.id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                            {isProjectOwner(selectedProject) && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoveDevice(device.id, device.name)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
        loading={creatingProject}
      />

      <JoinProjectDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onJoinProject={handleJoinProject}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        projectId={selectedProject?.id || ''}
        devices={deviceIds}
      />

      <RemoveUserDialog
        open={removeUserDialogOpen}
        onOpenChange={setRemoveUserDialogOpen}
        onConfirm={handleRemoveUserConfirm}
        userName={userToRemove ? (userNames[userToRemove] || userToRemove) : ''}
        projectName={selectedProject?.name || ''}
      />

      <AddDeviceDialog
        open={addDeviceDialogOpen}
        onOpenChange={setAddDeviceDialogOpen}
        onAddDevice={handleAddDevice}
        projectId={selectedProject?.id || ''}
      />

      <RemoveDeviceDialog
        open={removeDeviceDialogOpen}
        onOpenChange={setRemoveDeviceDialogOpen}
        onConfirm={handleRemoveDeviceConfirm}
        deviceId={deviceToRemove?.id || ''}
        deviceName={deviceToRemove?.name || ''}
      />
    </div>
  );
};

export default ProjectsUsersDevices;
