
import { useState, useEffect } from 'react';
import { database } from '@/config/firebase';
import { ref, onValue, push, set, get } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  uuid: string;
  users: { id: string; email: string; role: string }[];
  devices: { id: string; name: string; type: string; status: string }[];
}

export const useProjects = (currentUser: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      setProjects([]);
      setLoading(false);
      return;
    }

    fetchUserProjects();
  }, [currentUser]);

  const fetchUserProjects = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userProjectsRef = ref(database, `Users/${currentUser.uid}/Projects`);
      
      const unsubscribe = onValue(userProjectsRef, async (snapshot) => {
        try {
          const userProjectsData = snapshot.val();
          
          if (!userProjectsData || Object.keys(userProjectsData).length === 0) {
            setProjects([]);
            setLoading(false);
            return;
          }

          const projectIds = Object.keys(userProjectsData);
          const projectsData: Project[] = [];

          // Fetch each project's details
          for (const projectId of projectIds) {
            try {
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
                  users: projectData.users ? Object.values(projectData.users) : [],
                  devices: projectData.devices ? Object.values(projectData.devices) : []
                });
              }
            } catch (projectError) {
              console.error(`Error fetching project ${projectId}:`, projectError);
            }
          }

          setProjects(projectsData);
          setLoading(false);
        } catch (error) {
          console.error('Error processing projects data:', error);
          setError('Failed to load projects data');
          setLoading(false);
        }
      }, (error) => {
        console.error('Firebase onValue error:', error);
        setError('Failed to connect to database');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      setError('Failed to initialize database connection');
      setLoading(false);
    }
  };

  const createProject = async (name: string, description: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
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
        users: {},
        devices: {}
      };

      await set(newProjectRef, projectData);

      const userProjectRef = ref(database, `Users/${currentUser.uid}/Projects/${projectId}`);
      await set(userProjectRef, true);

      toast({
        title: 'Success',
        description: 'Project created successfully!'
      });

      return projectId;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    refetch: fetchUserProjects
  };
};
