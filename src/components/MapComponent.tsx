import React, { useEffect, useRef, useState } from 'react';
import { database } from '@/config/firebase';
import { ref, onValue, get } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface DeviceData {
  deviceId: string;
  lat: number;
  lng: number;
  battery: number;
  signal: string;
  lastContact: number;
  accuracy: number;
  dataCount: number;
  img?: string;
}

const MapComponent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const infoWindowRef = useRef<any>(null);
  
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAsbF6BOz9gEXTFgwBYx1fi6nCfO1kN1bs&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setMapLoaded(true);
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const initializeMap = () => {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeId: 'satellite', // Set to satellite view
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();
    };

    initializeMap();
  }, [mapLoaded]);

  // Fetch device data
  useEffect(() => {
    if (!currentUser) return;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        const userDevicesRef = ref(database, `Users/${currentUser.uid}/Devices`);
        
        onValue(userDevicesRef, async (snapshot) => {
          if (!snapshot.exists()) {
            setDevices([]);
            setLoading(false);
            return;
          }

          const deviceIds = Object.keys(snapshot.val());
          const devicePromises = deviceIds.map(async (deviceId) => {
            const deviceRef = ref(database, `tags/${deviceId}/recent`);
            const deviceSnapshot = await get(deviceRef);
            
            if (deviceSnapshot.exists()) {
              const data = deviceSnapshot.val();
              
              // Get data count
              const dataRef = ref(database, `tags/${deviceId}/data`);
              const dataSnapshot = await get(dataRef);
              const dataCount = dataSnapshot.exists() ? Object.keys(dataSnapshot.val()).length : 0;
              
              return {
                deviceId,
                lat: data.Lat || 0,
                lng: data.Lng || 0,
                battery: data.Battery || 0,
                signal: data.Signal || 'No Signal',
                lastContact: data.tts || 0,
                accuracy: data.hdop || 0,
                dataCount: dataCount,
                img: data.img || 'deer.png'
              };
            }
            return null;
          });

          const deviceData = (await Promise.all(devicePromises)).filter(Boolean) as DeviceData[];
          setDevices(deviceData);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError('Failed to fetch device data');
        setLoading(false);
      }
    };

    fetchDevices();
  }, [currentUser]);

  // Update markers when devices change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker: any) => {
      marker.setMap(null);
    });
    markersRef.current = {};

    // Add new markers
    devices.forEach((device) => {
      if (device.lat === 0 && device.lng === 0) return;

      const marker = new window.google.maps.Marker({
        position: { lat: device.lat, lng: device.lng },
        map: mapInstanceRef.current,
        title: device.deviceId,
        icon: {
          url: `/tracking/markers/${device.img}`,
          scaledSize: new window.google.maps.Size(35, 35),
          anchor: new window.google.maps.Point(17, 35)
        }
      });

      marker.addListener('click', () => {
        showInfoWindow(device, marker);
      });

      markersRef.current[device.deviceId] = marker;
    });

    // Always center map on India at zoom level 5 after devices are loaded
    mapInstanceRef.current.setCenter({ lat: 20.5937, lng: 78.9629 });
    mapInstanceRef.current.setZoom(5);
  }, [devices, mapLoaded]);

  const showInfoWindow = (device: DeviceData, marker: any) => {
    const formatDate = (timestamp: number) => {
      if (!timestamp) return 'Unknown';
      return new Date(timestamp * 1000).toLocaleString();
    };

    const content = `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 280px; padding: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #3b82f6;">
          <h3 style="margin: 0; color: #3b82f6; font-weight: bold; font-size: 16px;">Device: ${device.deviceId}</h3>
          <div style="display: flex; gap: 8px;">
            <div style="text-align: center; padding: 4px;">
              <div style="font-size: 18px;">🔋</div>
              <div style="font-size: 11px; font-weight: bold; margin-top: 2px;">${device.battery}%</div>
            </div>
            <div style="text-align: center; padding: 4px;">
              <div style="font-size: 18px;">📶</div>
              <div style="font-size: 11px; font-weight: bold; margin-top: 2px;">${device.signal}</div>
            </div>
            <div style="text-align: center; padding: 4px;">
              <div style="font-size: 18px;">📊</div>
              <div style="font-size: 11px; font-weight: bold; margin-top: 2px;">${device.dataCount}</div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 12px 0; padding: 8px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; font-weight: bold; color: #475569;">Last Contact</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${formatDate(device.lastContact)}</div>
        </div>
        
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <button onclick="window.open('/tracking/deviceDetails.html?deviceId=${device.deviceId}', '_blank')" 
                  style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">
            View Details
          </button>
          <button onclick="downloadDeviceData('${device.deviceId}')" 
                  style="flex: 1; background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">
            Download Data
          </button>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
    setSelectedDevice(device.deviceId);
  };

  const searchDevice = () => {
    if (!searchTerm.trim()) return;
    
    const device = devices.find(d => 
      d.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (device && markersRef.current[device.deviceId]) {
      const marker = markersRef.current[device.deviceId];
      mapInstanceRef.current.setCenter({ lat: device.lat, lng: device.lng });
      mapInstanceRef.current.setZoom(12);
      showInfoWindow(device, marker);
    }
  };

  const filteredDevices = devices.filter(device =>
    device.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show no devices message
  if (!loading && devices.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <div className="text-center max-w-md">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Devices Found</h3>
          <p className="text-gray-600 mb-6">
            You don't have any devices associated with your account. To start tracking, you need to either create a project and add devices or join an existing project.
          </p>
          <Button onClick={() => navigate('/projects-users-devices')} className="w-full">
            <ArrowRight className="h-4 w-4 mr-2" />
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchDevice()}
                className="w-64"
              />
              <Button onClick={searchDevice} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Count - moved to bottom left */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{devices.length} Devices</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading devices...</p>
          </div>
        </div>
      )}

      {/* Device List (when searching) - moved up to avoid overlapping with device count */}
      {searchTerm && (
        <div className="absolute bottom-20 left-4 z-10 max-w-sm">
          <Card className="shadow-lg max-h-60 overflow-y-auto">
            <CardContent className="p-3">
              <div className="space-y-2">
                {filteredDevices.length === 0 ? (
                  <p className="text-sm text-gray-500">No devices found</p>
                ) : (
                  filteredDevices.map((device) => (
                    <div
                      key={device.deviceId}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        const marker = markersRef.current[device.deviceId];
                        if (marker) {
                          mapInstanceRef.current.setCenter({ lat: device.lat, lng: device.lng });
                          mapInstanceRef.current.setZoom(12);
                          showInfoWindow(device, marker);
                        }
                      }}
                    >
                      <div>
                        <p className="font-medium text-sm">{device.deviceId}</p>
                        <p className="text-xs text-gray-500">Battery: {device.battery}%</p>
                      </div>
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Global function for download (accessible from info window)
(window as any).downloadDeviceData = (deviceId: string) => {
  const url = `https://65.1.242.158:1880/file`;
  const data = { File: deviceId };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.blob();
  })
  .then(blobData => {
    const blobUrl = URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${deviceId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  })
  .catch(error => {
    console.error('Download error:', error);
    alert('Failed to download data. Please try again.');
  });
};

export default MapComponent;
