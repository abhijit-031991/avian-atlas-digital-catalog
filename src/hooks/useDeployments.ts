import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { database } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Deployment } from '@/types/deployments';

export function useDeployments(deviceId: string | null) {
  const { currentUser } = useAuth();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !deviceId) {
      setDeployments([]);
      return;
    }
    setLoading(true);
    const dbRef = ref(database, `Users/${currentUser.uid}/Devices/${deviceId}/deployments`);
    const unsub = onValue(dbRef, (snap) => {
      if (!snap.exists()) {
        setDeployments([]);
      } else {
        const val = snap.val() as Record<string, Omit<Deployment, 'id'>>;
        const list: Deployment[] = Object.entries(val).map(([id, d]) => ({ id, ...d }));
        list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setDeployments(list);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser, deviceId]);

  const createDeployment = async (data: Omit<Deployment, 'id' | 'createdAt'>) => {
    if (!currentUser || !deviceId) return;
    const dbRef = ref(database, `Users/${currentUser.uid}/Devices/${deviceId}/deployments`);
    const newRef = push(dbRef);
    await set(newRef, { ...data, createdAt: Date.now() });
  };

  const updateDeployment = async (
    deploymentId: string,
    data: Partial<Omit<Deployment, 'id' | 'createdAt'>>,
  ) => {
    if (!currentUser || !deviceId) return;
    const depRef = ref(
      database,
      `Users/${currentUser.uid}/Devices/${deviceId}/deployments/${deploymentId}`,
    );
    await update(depRef, data);
  };

  const deleteDeployment = async (deploymentId: string) => {
    if (!currentUser || !deviceId) return;
    const depRef = ref(
      database,
      `Users/${currentUser.uid}/Devices/${deviceId}/deployments/${deploymentId}`,
    );
    await remove(depRef);
  };

  return { deployments, loading, createDeployment, updateDeployment, deleteDeployment };
}
