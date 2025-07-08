
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
  users: string[];
  devices: string[];
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

          for (const projectId of projectIds) {
            try {
              const projectRef = ref(database, `Projects/${projectId}`);
              const projectSnapshot = await get(projectRef);
              const projectData = projectSnapshot.val();
              
              if (projectData) {
                const users = projectData.Users ? Object.keys(projectData.Users) : [];
                const devices = projectData.Devices ? Object.keys(projectData.Devices) : [];
                
                projectsData.push({
                  id: projectId,
                  name: projectData.name || 'Unnamed Project',
                  description: projectData.description || '',
                  createdAt: projectData.createdAt || new Date().toISOString(),
                  uuid: projectData.uuid || '',
                  users,
                  devices
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
        Users: {
          [currentUser.uid]: true
        }
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

  const joinProject = async (passkey: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // Retrieve data from /passkeys/{passkey}
      const passkeyRef = ref(database, `passkeys/${passkey}`);
      const snapshot = await get(passkeyRef);
      
      if (!snapshot.exists()) {
        throw new Error('Invalid passkey');
      }

      const passkeyData = snapshot.val();
      const projectId = passkeyData.ProjectID;

      if (!projectId) {
        throw new Error('Invalid passkey data');
      }

      // Add user to project users list
      const projectUserRef = ref(database, `Projects/${projectId}/Users/${currentUser.uid}`);
      await set(projectUserRef, true);

      // Add project to user's projects list
      const userProjectRef = ref(database, `Users/${currentUser.uid}/Projects/${projectId}`);
      await set(userProjectRef, true);

      toast({
        title: 'Success',
        description: 'Successfully joined project!'
      });

      return projectId;
    } catch (error) {
      console.error('Error joining project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join project',
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
    joinProject,
    refetch: fetchUserProjects
  };
};
