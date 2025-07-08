
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Smartphone, Trash2, UserPlus, Edit, Plus } from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import ProjectList from '@/components/ProjectList';
import AddUserDialog from '@/components/AddUserDialog';
import JoinProjectDialog from '@/components/JoinProjectDialog';
import RemoveUserDialog from '@/components/RemoveUserDialog';
import AddDeviceDialog from '@/components/AddDeviceDialog';
import RemoveDeviceDialog from '@/components/RemoveDeviceDialog';
import { useProjects } from '@/hooks/useProjects';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [removeUserDialogOpen, setRemoveUserDialogOpen] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [removeDeviceDialogOpen, setRemoveDeviceDialogOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [deviceToRemove, setDeviceToRemove] = useState<{ id: string; name: string } | null>(null);
  const [projectDevices, setProjectDevices] = useState<Device[]>([]);

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

  // Fetch device details when selectedProject changes
  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (!selectedProject || !selectedProject.devices) {
        setProjectDevices([]);
        return;
      }

      const deviceIds = Object.keys(selectedProject.devices);
      const deviceDetails = await Promise.all(
        deviceIds.map(async (deviceId) => {
          const details = await getDeviceDetails(deviceId);
          return details || { id: deviceId, name: `Device ${deviceId}` };
        })
      );

      setProjectDevices(deviceDetails);
    };

    fetchDeviceDetails();
  }, [selectedProject, getDeviceDetails]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

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
    await joinProject(passkey);
    setJoinDialogOpen(false);
  };

  const handleAddUser = async (email: string) => {
    if (selectedProject) {
      await addUser(email, selectedProject.id);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setUserToRemove(userId);
    setRemoveUserDialogOpen(true);
  };

  const handleRemoveUserConfirm = async () => {
    if (selectedProject && userToRemove) {
      await removeUser(selectedProject.id, userToRemove);
      setUserToRemove(null);
    }
  };

  const handleAddDevice = async (deviceId: string, deviceName: string, passkey: string) => {
    if (selectedProject) {
      await addDevice(deviceId, deviceName, passkey, selectedProject.id);
    }
  };

  const handleRemoveDevice = (deviceId: string, deviceName: string) => {
    setDeviceToRemove({ id: deviceId, name: deviceName });
    setRemoveDeviceDialogOpen(true);
  };

  const handleRemoveDeviceConfirm = async () => {
    if (selectedProject && deviceToRemove) {
      await removeDevice(deviceToRemove.id, selectedProject.id);
      setDeviceToRemove(null);
    }
  };

  const isProjectOwner = (project: Project | null) => {
    return project && currentUser && project.uuid === currentUser.uid;
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
            onSelectProject={setSelectedProject}
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
                    ) : (
                      selectedProject.users.map((userId) => (
                        <div key={userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{userId}</p>
                            <p className="text-xs text-gray-500">
                              {userId === selectedProject.uuid ? 'Project Owner' : 'Member'}
                            </p>
                          </div>
                          {isProjectOwner(selectedProject) && userId !== selectedProject.uuid && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemoveUser(userId)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
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
                    {projectDevices.length === 0 ? (
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
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleRemoveDevice(device.id, device.name)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
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
        onAddUser={handleAddUser}
        projectId={selectedProject?.id || ''}
      />

      <RemoveUserDialog
        open={removeUserDialogOpen}
        onOpenChange={setRemoveUserDialogOpen}
        onConfirm={handleRemoveUserConfirm}
        userName={userToRemove || ''}
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
