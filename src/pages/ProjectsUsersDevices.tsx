
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Settings, Users, Smartphone, Trash2, UserPlus, Edit } from 'lucide-react';
import { database } from '@/config/firebase';
import { ref, onValue, push, set, get } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import CreateProjectDialog from '@/components/CreateProjectDialog';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: { id: string; email: string; role: string }[];
  devices: { id: string; name: string; type: string; status: string }[];
}

const ProjectsUsersDevices = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    fetchUserProjects();
  }, [currentUser, navigate]);

  const fetchUserProjects = async () => {
    if (!currentUser) return;

    try {
      const userProjectsRef = ref(database, `Users/${currentUser.uid}/Projects`);
      
      onValue(userProjectsRef, async (snapshot) => {
        const userProjectsData = snapshot.val();
        
        if (!userProjectsData) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const projectIds = Object.keys(userProjectsData);
        const projectsData: Project[] = [];

        // Fetch each project's details
        for (const projectId of projectIds) {
          const projectRef = ref(database, `Projects/${projectId}`);
          const projectSnapshot = await get(projectRef);
          const projectData = projectSnapshot.val();
          
          if (projectData) {
            projectsData.push({
              id: projectId,
              name: projectData.name || 'Unnamed Project',
              description: projectData.description || '',
              createdAt: projectData.createdAt || new Date().toISOString(),
              uuid: projectData.uuid || '',
              users: projectData.users || [],
              devices: projectData.devices || []
            });
          }
        }

        setProjects(projectsData);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    if (!currentUser) return;

    setCreatingProject(true);
    
    try {
      // Generate new project reference with auto-generated ID
      const projectsRef = ref(database, 'Projects');
      const newProjectRef = push(projectsRef);
      const projectId = newProjectRef.key;

      if (!projectId) {
        throw new Error('Failed to generate project ID');
      }

      const projectData = {
        name,
        description,
        uuid: currentUser.uid,
        createdAt: new Date().toISOString(),
        users: [],
        devices: []
      };

      // Add project to /Projects/{ProjectID}
      await set(newProjectRef, projectData);

      // Add project ID to user's project list
      const userProjectRef = ref(database, `Users/${currentUser.uid}/Projects/${projectId}`);
      await set(userProjectRef, true);

      toast({
        title: 'Success',
        description: 'Project created successfully!'
      });

      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setCreatingProject(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

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
          {projects.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <Settings className="h-12 w-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-600 mb-4">No projects found</p>
              <p className="text-sm text-gray-500 mb-4">
                Create your first project or contact your admin for access to existing projects.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-colors ${
                    selectedProject?.id === project.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{project.name}</CardTitle>
                    <CardDescription className="text-xs">
                      ID: {project.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{project.users.length} users</span>
                      <span>{project.devices.length} devices</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => setCreateDialogOpen(true)} variant="outline" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          )}
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
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedProject.users.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">No users added yet</p>
                    ) : (
                      selectedProject.users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
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
                      selectedProject.devices.map((device) => (
                        <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{device.name}</p>
                            <p className="text-xs text-gray-500">{device.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              device.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {device.status}
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
    </div>
  );
};

export default ProjectsUsersDevices;
