
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Smartphone, Trash2, UserPlus, Edit, Plus } from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import ProjectList from '@/components/ProjectList';
import AddUserDialog from '@/components/AddUserDialog';
import JoinProjectDialog from '@/components/JoinProjectDialog';
import { useProjects } from '@/hooks/useProjects';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: string[];
  devices: string[];
}

const ProjectsUsersDevices = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const { projects, loading, error, createProject, joinProject, refetch } = useProjects(currentUser);

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
            loading={loading}
            error={error}
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
                  <Button size="sm" onClick={() => setAddUserDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
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
                            <p className="text-xs text-gray-500">User ID</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
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
                      Devices ({selectedProject.devices.length})
                    </CardTitle>
                    <CardDescription>Manage tracking devices</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedProject.devices.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No devices added yet</p>
                    ) : (
                      selectedProject.devices.map((deviceId) => (
                        <div key={deviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Device {deviceId}</p>
                            <p className="text-xs text-gray-500">Device ID</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
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
        devices={selectedProject?.devices || []}
      />
    </div>
  );
};

export default ProjectsUsersDevices;
