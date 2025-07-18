
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, RefreshCw, Upload, Database, EyeOff, Eye, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CSVUploadDialog from '@/components/CSVUploadDialog';
import { DataPoint, DeviceInfo } from '@/types/database-analytics';

interface MapViewProps {
  device: DeviceInfo;
  data: DataPoint[];
  filteredData?: DataPoint[];
  loading: boolean;
  tableExists: boolean;
  onRefresh: () => void;
}

const MapView = ({ device, data, filteredData, loading, tableExists, onRefresh }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const animatedMarkerRef = useRef<google.maps.Marker | null>(null);
  const pathRef = useRef<google.maps.Polyline | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationRequestRef = useRef<number | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [skipNullValues, setSkipNullValues] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([500]); // milliseconds between points
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [sortedPoints, setSortedPoints] = useState<DataPoint[]>([]);
  const { toast } = useToast();

  const loadGoogleMaps = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement;
      if (existingScript) {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          resolve();
        } else {
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', reject);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCs1PdnjLUuFYdrHCN-xTAW6r3p7BiiMZI&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-loaded', 'true');

      script.onload = () => {
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
      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: 'Map Error',
        description: 'Failed to load Google Maps',
        variant: 'destructive'
      });
    }
  };

  const prepareAnimationData = useCallback((points: DataPoint[]) => {
    if (!points.length) return;

    // Filter out null/invalid coordinates if skipNullValues is enabled
    const validPoints = skipNullValues 
      ? points.filter(point => 
          point.latitude !== null && 
          point.longitude !== null && 
          point.latitude !== 0 && 
          point.longitude !== 0 &&
          !isNaN(point.latitude) && 
          !isNaN(point.longitude)
        )
      : points;

    if (validPoints.length === 0) {
      toast({
        title: 'No Valid Points',
        description: 'No valid coordinate points to display on the map',
        variant: 'destructive'
      });
      return;
    }

    // Sort points by timestamp in ascending order
    const sorted = [...validPoints].sort((a, b) => a.timestamp - b.timestamp);
    setSortedPoints(sorted);
    setCurrentPointIndex(0);

    // Fit map to bounds
    if (mapInstanceRef.current && sorted.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      sorted.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.latitude, point.longitude));
      });
      
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        mapInstanceRef.current?.fitBounds(bounds);
      }, 100);
    }
  }, [skipNullValues, toast]);

  const createAnimatedMarker = useCallback((point: DataPoint, index: number) => {
    if (!mapInstanceRef.current) return null;

    const position = new google.maps.LatLng(point.latitude, point.longitude);
    
    const marker = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: `Point ${point.pointid} - ${new Date(point.timestamp).toLocaleString()}`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="${point.activity ? '#10B981' : '#EF4444'}" stroke="white" stroke-width="3"/>
            <circle cx="12" cy="12" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
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
          <strong>Satellites:</strong> ${point.satellites || 'N/A'}<br/>
          <strong>Accelerometer:</strong> X:${point.ax?.toFixed(2) || 'N/A'}, Y:${point.ay?.toFixed(2) || 'N/A'}, Z:${point.az?.toFixed(2) || 'N/A'}
        </div>
      `,
    });

    marker.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current!, marker);
    });

    return marker;
  }, []);

  const updatePolyline = useCallback((points: DataPoint[], endIndex: number) => {
    if (!mapInstanceRef.current || endIndex < 1) return;

    // Clear existing polyline
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }

    // Create path up to current point
    const path = points.slice(0, endIndex + 1).map(point => 
      new google.maps.LatLng(point.latitude, point.longitude)
    );

    if (path.length > 1) {
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FBBF24', // Yellow color
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      polyline.setMap(mapInstanceRef.current);
      pathRef.current = polyline;
    }
  }, []);

  const animateMarker = useCallback(() => {
    if (!isAnimating || currentPointIndex >= sortedPoints.length || !mapInstanceRef.current) {
      setIsAnimating(false);
      return;
    }

    const currentPoint = sortedPoints[currentPointIndex];
    
    // Clear previous marker
    if (animatedMarkerRef.current) {
      animatedMarkerRef.current.setMap(null);
    }

    // Create new marker at current position
    animatedMarkerRef.current = createAnimatedMarker(currentPoint, currentPointIndex);
    
    // Update polyline trail
    updatePolyline(sortedPoints, currentPointIndex);

    // Schedule next animation frame
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentPointIndex(prev => prev + 1);
    }, animationSpeed[0]);
  }, [isAnimating, currentPointIndex, sortedPoints, animationSpeed, createAnimatedMarker, updatePolyline]);

  const startAnimation = useCallback(() => {
    if (sortedPoints.length === 0) return;
    setIsAnimating(true);
    setCurrentPointIndex(0);
  }, [sortedPoints.length]);

  const pauseAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentPointIndex(0);
    
    // Clear animated marker
    if (animatedMarkerRef.current) {
      animatedMarkerRef.current.setMap(null);
      animatedMarkerRef.current = null;
    }
    
    // Clear polyline
    if (pathRef.current) {
      pathRef.current.setMap(null);
      pathRef.current = null;
    }
  }, [pauseAnimation]);

  const clearMapElements = useCallback(() => {
    if (animatedMarkerRef.current) {
      animatedMarkerRef.current.setMap(null);
      animatedMarkerRef.current = null;
    }

    if (pathRef.current) {
      pathRef.current.setMap(null);
      pathRef.current = null;
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (animationRequestRef.current) {
      cancelAnimationFrame(animationRequestRef.current);
      animationRequestRef.current = null;
    }

    setIsAnimating(false);
  }, []);

  const handleUploadComplete = () => {
    onRefresh();
    toast({
      title: 'Upload successful',
      description: 'CSV data has been uploaded successfully',
      className: 'bg-green-50 border-green-200 text-green-800'
    });
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

  // Effect to trigger animation step
  useEffect(() => {
    if (isAnimating) {
      animateMarker();
    }
  }, [isAnimating, currentPointIndex, animateMarker]);

  // Effect to prepare data when it changes
  useEffect(() => {
    if (isLoaded && mapInstanceRef.current) {
      clearMapElements();
      if (filteredData && filteredData.length > 0) {
        prepareAnimationData(filteredData);
      } else if (data.length > 0) {
        prepareAnimationData(data);
      }
    }
  }, [data, filteredData, isLoaded, skipNullValues, prepareAnimationData, clearMapElements]);

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
                {device.name} - Location Map
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{data.length} data points</Badge>
                {skipNullValues && (
                  <Badge variant="outline" className="text-xs">
                    Null values skipped
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSkipNullValues(!skipNullValues)}
                className={skipNullValues ? 'bg-blue-50 border-blue-200' : ''}
              >
                {skipNullValues ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                {skipNullValues ? 'Show All' : 'Skip Nulls'}
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
          {/* Animation Controls */}
          {sortedPoints.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isAnimating ? "default" : "outline"}
                    size="sm"
                    onClick={isAnimating ? pauseAnimation : startAnimation}
                    disabled={currentPointIndex >= sortedPoints.length && !isAnimating}
                  >
                    {isAnimating ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        {currentPointIndex >= sortedPoints.length ? 'Replay' : 'Start'}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetAnimation}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  Point {currentPointIndex + 1} of {sortedPoints.length}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <div className="flex-1 max-w-xs">
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    max={2000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-gray-600 min-w-[80px]">
                  {animationSpeed[0]}ms
                </span>
              </div>
            </div>
          )}

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
          
          {sortedPoints.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Active marker
                <span className="w-3 h-3 bg-red-500 rounded-full ml-4"></span>
                Inactive marker
                <span className="w-4 h-0.5 bg-yellow-400 ml-4"></span>
                Animated trail (yellow)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CSVUploadDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        deviceId={device.id}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};

export default MapView;
