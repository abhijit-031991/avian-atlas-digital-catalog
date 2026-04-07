import { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';

export interface DeviceStatus {
  battery?: number;
  signal?: number;
  lastContact?: number;
  lat?: number;
  lng?: number;
  isActive: boolean; // last contact < 5min
}

const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000;

export function useDeviceStatuses(deviceIds: string[]): Record<string, DeviceStatus> {
  const [statuses, setStatuses] = useState<Record<string, DeviceStatus>>({});
  const unsubsRef = useRef<Record<string, () => void>>({});
  const latestRef = useRef<Record<string, DeviceStatus>>({});

  useEffect(() => {
    if (deviceIds.length === 0) {
      // Unsubscribe all
      Object.values(unsubsRef.current).forEach((fn) => fn());
      unsubsRef.current = {};
      latestRef.current = {};
      setStatuses({});
      return;
    }

    const currentIds = new Set(deviceIds);

    // Unsubscribe removed devices
    Object.keys(unsubsRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        unsubsRef.current[id]();
        delete unsubsRef.current[id];
        delete latestRef.current[id];
      }
    });

    // Subscribe new devices
    deviceIds.forEach((deviceId) => {
      if (unsubsRef.current[deviceId]) return;

      const recentRef = ref(database, `tags/${deviceId}/recent`);
      const unsub = onValue(recentRef, (snap) => {
        const data = snap.val();
        const lastContact = data?.lastContact ? Number(data.lastContact) : undefined;
        const isActive = lastContact != null && Date.now() - lastContact < ACTIVE_THRESHOLD_MS;

        latestRef.current[deviceId] = {
          battery: data?.battery != null ? Number(data.battery) : undefined,
          signal: data?.signal != null ? Number(data.signal) : undefined,
          lastContact,
          lat: data?.lat != null ? Number(data.lat) : undefined,
          lng: data?.lng != null ? Number(data.lng) : undefined,
          isActive,
        };

        setStatuses({ ...latestRef.current });
      });

      unsubsRef.current[deviceId] = unsub;
    });

    return () => {
      Object.values(unsubsRef.current).forEach((fn) => fn());
      unsubsRef.current = {};
      latestRef.current = {};
    };
  }, [deviceIds.join(',')]);

  return statuses;
}
