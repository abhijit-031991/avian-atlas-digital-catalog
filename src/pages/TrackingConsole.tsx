import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MapComponent, { DeviceData, BaseStationData } from '@/components/MapComponent';
import DeviceListPanel from '@/components/tracking/DeviceListPanel';

const TrackingConsole = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [baseStations, setBaseStations] = useState<BaseStationData[]>([]);
  const [focusDevice, setFocusDevice] = useState<string | null>(null);
  const [focusStation, setFocusStation] = useState<string | null>(null);

  React.useEffect(() => {
    if (!currentUser) navigate('/auth');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
      {/* Full-screen map */}
      <MapComponent
        onDevicesChange={setDevices}
        onBaseStationsChange={setBaseStations}
        focusDevice={focusDevice}
        focusStation={focusStation}
        onDeviceSelect={setFocusDevice}
      />

      {/* Floating device + base station panels */}
      <DeviceListPanel
        devices={devices}
        baseStations={baseStations}
        selectedDevice={focusDevice}
        onDeviceClick={setFocusDevice}
        onStationClick={setFocusStation}
      />
    </div>
  );
};

export default TrackingConsole;
