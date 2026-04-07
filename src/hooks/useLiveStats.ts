import { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface LiveStats {
  totalDevices: number;
  baseStationCount: number;
  activeDevices: number;
  lastPingMs: number | null;
  loading: boolean;
}

const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function useLiveStats(): LiveStats {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<LiveStats>({
    totalDevices: 0,
    baseStationCount: 0,
    activeDevices: 0,
    lastPingMs: null,
    loading: true,
  });

  // Hold per-device recent data so we can recompute stats on any update
  const deviceDataRef = useRef<Record<string, { lastContact?: number }>>({});
  const deviceUnsubsRef = useRef<Record<string, () => void>>({});

  useEffect(() => {
    if (!currentUser) return;

    // Watch base station count
    const bsRef = ref(database, 'baseStations');
    const unsubBS = onValue(bsRef, (snap) => {
      const count = snap.exists() ? Object.keys(snap.val()).length : 0;
      setStats((prev) => ({ ...prev, baseStationCount: count }));
    });

    const devicesRef = ref(database, `Users/${currentUser.uid}/Devices`);

    // Watch the device list
    const unsubDeviceList = onValue(devicesRef, (snapshot) => {
      const devicesVal = snapshot.val() as Record<string, unknown> | null;
      const deviceIds = devicesVal ? Object.keys(devicesVal) : [];

      // Unsubscribe listeners for removed devices
      Object.keys(deviceUnsubsRef.current).forEach((id) => {
        if (!deviceIds.includes(id)) {
          deviceUnsubsRef.current[id]();
          delete deviceUnsubsRef.current[id];
          delete deviceDataRef.current[id];
        }
      });

      // Subscribe to new devices
      deviceIds.forEach((deviceId) => {
        if (deviceUnsubsRef.current[deviceId]) return; // already watching

        const recentRef = ref(database, `tags/${deviceId}/recent`);
        const unsub = onValue(recentRef, (snap) => {
          const data = snap.val();
          const lastContact = data?.lastContact
            ? Number(data.lastContact)
            : undefined;
          deviceDataRef.current[deviceId] = { lastContact };
          recomputeStats(deviceIds.length);
        });
        deviceUnsubsRef.current[deviceId] = unsub;
      });

      // If no devices, settle immediately
      if (deviceIds.length === 0) {
        setStats((prev) => ({ ...prev, totalDevices: 0, activeDevices: 0, lastPingMs: null, loading: false }));
      }
    });

    function recomputeStats(total: number) {
      const now = Date.now();
      let active = 0;
      let latestPing: number | null = null;

      Object.values(deviceDataRef.current).forEach(({ lastContact }) => {
        if (lastContact == null) return;
        if (now - lastContact < ACTIVE_THRESHOLD_MS) active++;
        if (latestPing === null || lastContact > latestPing) latestPing = lastContact;
      });

      setStats((prev) => ({ ...prev, totalDevices: total, activeDevices: active, lastPingMs: latestPing, loading: false }));
    }

    return () => {
      unsubBS();
      unsubDeviceList();
      Object.values(deviceUnsubsRef.current).forEach((fn) => fn());
      deviceUnsubsRef.current = {};
      deviceDataRef.current = {};
    };
  }, [currentUser]);

  return stats;
}
