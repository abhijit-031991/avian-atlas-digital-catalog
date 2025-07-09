
import { useState, useEffect } from 'react';
import { database } from '@/config/firebase';
import { ref, onValue, push, set, get, remove } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

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
                const devices = projectData.Devices || {};
                
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

  const joinProject = async (passkey: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
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

      const projectUserRef = ref(database, `Projects/${projectId}/Users/${currentUser.uid}`);
      await set(projectUserRef, true);

      const userProjectRef = ref(database, `Users/${currentUser.uid}/Projects/${projectId}`);
      await set(userProjectRef, true);

      // Remove the passkey after successful join
      await remove(passkeyRef);

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

  const addUser = async (email: string, projectId: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const response = await fetch('https://65.1.242.158:1880/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newUser: email,
          addedBy: currentUser.uid,
          ProjectID: projectId,
          Devices: null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      toast({
        title: 'Success',
        description: 'User invitation sent successfully!'
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const removeUser = async (projectId: string, userUuid: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const projectUserRef = ref(database, `Projects/${projectId}/Users/${userUuid}`);
      await remove(projectUserRef);

      const userProjectRef = ref(database, `Users/${userUuid}/Projects/${projectId}`);
      await remove(userProjectRef);

      toast({
        title: 'Success',
        description: 'User removed from project successfully!'
      });
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove user. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const projectRef = ref(database, `Projects/${projectId}`);
      const projectSnapshot = await get(projectRef);
      
      if (!projectSnapshot.exists()) {
        throw new Error('Project not found');
      }

      const projectData = projectSnapshot.val();
      const projectUsers = projectData.Users || {};

      const userUpdatePromises = Object.keys(projectUsers).map(async (userUuid) => {
        const userProjectRef = ref(database, `Users/${userUuid}/Projects/${projectId}`);
        return remove(userProjectRef);
      });

      await Promise.all(userUpdatePromises);
      await remove(projectRef);

      toast({
        title: 'Success',
        description: 'Project deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const addDevice = async (deviceId: string, deviceName: string, passkey: string, projectId: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // Step 1: Retrieve device data from /tags/{deviceID}
      const deviceRef = ref(database, `tags/${deviceId}`);
      const deviceSnapshot = await get(deviceRef);
      
      if (!deviceSnapshot.exists()) {
        throw new Error('Device not found');
      }

      const deviceData = deviceSnapshot.val();
      const devicePasskey = deviceData.Management?.passkey;
      const isProvisioned = deviceData.Management?.prov;

      // Step 2: Check if device is already provisioned
      if (isProvisioned === true) {
        throw new Error('Device already provisioned');
      }

      // Step 3: Validate passkey
      if (!devicePasskey || devicePasskey.toString() !== passkey) {
        throw new Error('Invalid device passkey');
      }

      // Step 4: Add device to project and user
      const projectDeviceRef = ref(database, `Projects/${projectId}/Devices/${deviceId}`);
      await set(projectDeviceRef, true);

      const userDeviceRef = ref(database, `Users/${currentUser.uid}/Devices/${deviceId}`);
      await set(userDeviceRef, true);

      // Step 5: Add device name to management
      const deviceNameRef = ref(database, `tags/${deviceId}/Management/Device Name`);
      await set(deviceNameRef, deviceName);

      // Step 6: Set provisioned to true
      const provisionedRef = ref(database, `tags/${deviceId}/Management/prov`);
      await set(provisionedRef, true);

      toast({
        title: 'Success',
        description: 'Device added to project successfully!'
      });
    } catch (error) {
      console.error('Error adding device:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add device',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const removeDevice = async (deviceId: string, projectId: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // Remove device from project
      const projectDeviceRef = ref(database, `Projects/${projectId}/Devices/${deviceId}`);
      await remove(projectDeviceRef);

      // Remove device from user
      const userDeviceRef = ref(database, `Users/${currentUser.uid}/Devices/${deviceId}`);
      await remove(userDeviceRef);

      // Set provisioned to false
      const provisionedRef = ref(database, `tags/${deviceId}/Management/prov`);
      await set(provisionedRef, false);

      // Remove device name
      const deviceNameRef = ref(database, `tags/${deviceId}/Management/Device Name`);
      await remove(deviceNameRef);

      toast({
        title: 'Success',
        description: 'Device removed from project successfully!'
      });
    } catch (error) {
      console.error('Error removing device:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove device. Please try again.',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getDeviceDetails = async (deviceId: string): Promise<Device | null> => {
    try {
      const deviceRef = ref(database, `tags/${deviceId}/Management`);
      const deviceSnapshot = await get(deviceRef);
      
      if (deviceSnapshot.exists()) {
        const deviceData = deviceSnapshot.val();
        return {
          id: deviceId,
          name: deviceData['Device Name'] || `Device ${deviceId}`
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching device details:', error);
      return null;
    }
  };

  return {
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
    refetch: fetchUserProjects
  };
};
