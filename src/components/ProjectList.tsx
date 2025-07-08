
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, UserPlus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: string[];
  devices: string[];
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onJoinProject: () => void;
  loading: boolean;
  error: string | null;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  onJoinProject,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="p-6 text-center">
        <Settings className="h-8 w-8 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 mb-4">
          <Settings className="h-12 w-12 mx-auto mb-2" />
        </div>
        <p className="text-red-600 mb-4">Error loading projects</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <div className="space-y-2">
          <Button onClick={onCreateProject} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
          <Button onClick={onJoinProject} variant="outline" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Project
          </Button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <Settings className="h-12 w-12 mx-auto mb-2" />
        </div>
        <p className="text-gray-600 mb-4">No projects found</p>
        <p className="text-sm text-gray-500 mb-4">
          Create your first project or join an existing one using a passkey.
        </p>
        <div className="space-y-2">
          <Button onClick={onCreateProject} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
          <Button onClick={onJoinProject} variant="outline" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      {projects.map((project) => (
        <Card
          key={project.id}
          className={`cursor-pointer transition-colors ${
            selectedProject?.id === project.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectProject(project)}
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
      <div className="space-y-2">
        <Button onClick={onCreateProject} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
        <Button onClick={onJoinProject} variant="outline" className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Join Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectList;
