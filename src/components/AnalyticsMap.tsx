import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, RefreshCw, Upload, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CSVUploadDialog from './CSVUploadDialog';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AnalyticsMapProps {
  deviceId: string;
  deviceName: string;
  filteredData?: DataPoint[];
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

const AnalyticsMap = ({ deviceId, deviceName, filteredData }: AnalyticsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [tableExists, setTableExists] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!deviceId) return;
    
    setLoading(true);
    try {
      const { data: deviceData, error } = await supabase
        .from(deviceId as any)
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
        const typedData = (deviceData as unknown) as DataPoint[] || [];
        setData(typedData);
        if (typedData && typedData.length > 0 && mapInstanceRef.current) {
          displayDataOnMap(typedData);
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

  const initMap = async () => {
    if (!mapboxToken || !mapRef.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        zoom: 10,
        center: [77.2090, 28.6139], // [lng, lat] for Mapbox
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      mapInstanceRef.current = map;
      
      if (data.length > 0) {
        displayDataOnMap(data);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to load Mapbox. Please check your API token.',
        variant: 'destructive'
      });
    }
  };

  const displayDataOnMap = (points: DataPoint[]) => {
    if (!mapInstanceRef.current || points.length === 0) return;

    clearMapElements();

    const bounds = new mapboxgl.LngLatBounds();

    points.forEach((point, index) => {
      const lngLat: [number, number] = [point.longitude, point.latitude];
      bounds.extend(lngLat);

      // Create a custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = point.activity ? '#10B981' : '#EF4444';
      markerElement.style.border = '2px solid white';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontSize = '10px';
      markerElement.style.fontWeight = 'bold';
      markerElement.textContent = (index + 1).toString();

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(lngLat)
        .addTo(mapInstanceRef.current!);

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="font-size: 12px;">
            <strong>Point ${point.pointid}</strong><br/>
            <strong>Time:</strong> ${new Date(point.timestamp).toLocaleString()}<br/>
            <strong>Location:</strong> ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}<br/>
            <strong>Speed:</strong> ${point.speed || 'N/A'} km/h<br/>
            <strong>Activity:</strong> ${point.activity ? 'Active' : 'Inactive'}<br/>
            <strong>Satellites:</strong> ${point.satellites || 'N/A'}
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current.push(marker);
    });

    // Add path line if there are multiple points
    if (points.length > 1 && mapInstanceRef.current.getSource('route')) {
      mapInstanceRef.current.removeLayer('route');
      mapInstanceRef.current.removeSource('route');
    }

    if (points.length > 1) {
      const coordinates = points.map(point => [point.longitude, point.latitude]);
      
      mapInstanceRef.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      mapInstanceRef.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2563EB',
          'line-width': 3
        }
      });
    }

    // Fit map to bounds
    if (points.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const clearMapElements = () => {
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Remove route layer if it exists
    if (mapInstanceRef.current && mapInstanceRef.current.getSource('route')) {
      mapInstanceRef.current.removeLayer('route');
      mapInstanceRef.current.removeSource('route');
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initMap();
    }
  };

  useEffect(() => {
    if (mapboxToken && !showTokenInput) {
      initMap();
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapboxToken, showTokenInput]);

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  // Update map when filtered data changes
  useEffect(() => {
    if (filteredData && filteredData.length > 0 && mapInstanceRef.current) {
      displayDataOnMap(filteredData);
    } else if (filteredData && filteredData.length === 0 && mapInstanceRef.current) {
      clearMapElements();
    }
  }, [filteredData]);

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
          {showTokenInput ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Mapbox Token Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please enter your Mapbox public token to display the map.
                  You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                <Input
                  id="mapbox-token"
                  type="text"
                  placeholder="pk.ey..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <Button onClick={handleTokenSubmit} className="w-full">
                  Load Map
                </Button>
              </div>
            </div>
          ) : (
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
          )}
          
          {!showTokenInput && data.length > 0 && (
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