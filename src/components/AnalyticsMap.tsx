import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw, Upload, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CSVUploadDialog from './CSVUploadDialog';

interface AnalyticsMapProps {
  deviceId: string;
  deviceName: string;
}

interface DataPoint {
  pointid: number;
  id: number;
  timestamp: number;
  locktime: number;
  latitude: number;
  longitude: number;
  hdop: number | null;
  count: number;
  satellites: number | null;
  speed: number | null;
  activity: boolean | null;
  ax: number | null;
  ay: number | null;
  az: number | null;
  created_at: string | null;
}

const AnalyticsMap = ({ deviceId, deviceName }: AnalyticsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const pathRef = useRef<google.maps.Polyline | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [tableExists, setTableExists] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!deviceId) return;
    
    setLoading(true);
    try {
      const { data: deviceData, error } = await supabase
        .from(deviceId)
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          console.log(`Table ${deviceId} does not exist`);
          setTableExists(false);
          setData([]);
        } else {
          throw error;
        }
      } else {
        setTableExists(true);
        setData(deviceData || []);
        if (deviceData && deviceData.length > 0 && mapInstanceRef.current) {
          displayDataOnMap(deviceData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch device data',
        variant: 'destructive'
      });
      setTableExists(false);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleMaps = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCs1PdnjLUuFYdrHCN-xTAW6r3p7BiiMZI&libraries=geometry&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const initMap = async () => {
    try {
      await loadGoogleMaps();
      
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        zoom: 10,
        center: { lat: 28.6139, lng: 77.2090 },
        mapTypeId: google.maps.MapTypeId.SATELLITE,
      });

      mapInstanceRef.current = map;
      
      if (data.length > 0) {
        displayDataOnMap(data);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to load Google Maps',
        variant: 'destructive'
      });
    }
  };

  const displayDataOnMap = (points: DataPoint[]) => {
    if (!mapInstanceRef.current || points.length === 0) return;

    clearMapElements();

    const bounds = new google.maps.LatLngBounds();
    const path: google.maps.LatLng[] = [];

    points.forEach((point, index) => {
      const position = new google.maps.LatLng(point.latitude, point.longitude);
      path.push(position);
      bounds.extend(position);

      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: `Point ${point.pointid} - ${new Date(point.timestamp).toLocaleString()}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="${point.activity ? '#10B981' : '#EF4444'}" stroke="white" stroke-width="2"/>
              <text x="10" y="14" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(20, 20),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-size: 12px;">
            <strong>Point ${point.pointid}</strong><br/>
            <strong>Time:</strong> ${new Date(point.timestamp).toLocaleString()}<br/>
            <strong>Location:</strong> ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}<br/>
            <strong>Speed:</strong> ${point.speed || 'N/A'} km/h<br/>
            <strong>Activity:</strong> ${point.activity ? 'Active' : 'Inactive'}<br/>
            <strong>Satellites:</strong> ${point.satellites || 'N/A'}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    if (path.length > 1) {
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      polyline.setMap(mapInstanceRef.current);
      pathRef.current = polyline;
    }

    if (points.length > 0) {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.fitBounds(bounds);
        }
      }, 100);
    }
  };

  const clearMapElements = () => {
    markersRef.current.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];

    if (pathRef.current && pathRef.current.setMap) {
      pathRef.current.setMap(null);
      pathRef.current = null;
    }
  };

  useEffect(() => {
    initMap();
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      clearMapElements();
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  const handleUploadComplete = () => {
    fetchData();
  };

  if (!tableExists && !loading) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Data Available</h3>
            <p className="text-sm mb-4">This device doesn't have any location data yet</p>
            <Button onClick={() => setShowUploadDialog(true)} className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV Data
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Upload a properly formatted CSV file to see location data on the map
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                {deviceName} - Location Map
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{data.length} data points</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden border">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading map data...</span>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}
          </div>
          
          {data.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Active points
                <span className="w-3 h-3 bg-red-500 rounded-full ml-4"></span>
                Inactive points
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CSVUploadDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        deviceId={deviceId}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};

export default AnalyticsMap;
