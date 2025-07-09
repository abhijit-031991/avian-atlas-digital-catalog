
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings, UserPlus, Trash2 } from 'lucide-react';
import DeleteProjectDialog from '@/components/DeleteProjectDialog';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: string[];
  devices: { [key: string]: any };
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onJoinProject: () => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  currentUser: any;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  onJoinProject,
  onDeleteProject,
  loading,
  error,
  currentUser
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const isProjectOwner = (project: Project) => {
    return currentUser && project.uuid === currentUser.uid;
  };

  const handleProjectSelect = (project: Project) => {
    console.log('Selecting project:', project);
    onSelectProject(project);
  };

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
    <>
      <div className="p-4 space-y-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-colors ${
              selectedProject?.id === project.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-sm">{project.name}</CardTitle>
                  <CardDescription className="text-xs">
                    ID: {project.id}
                  </CardDescription>
                </div>
                {isProjectOwner(project) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteClick(project, e)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{project.users.length} users</span>
                <span>{Object.keys(project.devices || {}).length} devices</span>
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

      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        projectName={projectToDelete?.name || ''}
      />
    </>
  );
};

export default ProjectList;
