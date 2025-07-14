
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, MapPin, Route } from 'lucide-react';

interface DataPoint {
  timestamp: number;
  latitude: number;
  longitude: number;
  speed: number;
  activity: boolean;
}

interface AnalyticsMapProps {
  deviceId: string | null;
  deviceName: string;
}

const AnalyticsMap = ({ deviceId, deviceName }: AnalyticsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const pathRef = useRef<google.maps.Polyline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample data - in real app, this would come from props or API
  const trackData: DataPoint[] = [
    { timestamp: Date.now() - 3600000, latitude: 28.6139, longitude: 77.2090, speed: 0, activity: false },
    { timestamp: Date.now() - 3000000, latitude: 28.6149, longitude: 77.2100, speed: 25, activity: true },
    { timestamp: Date.now() - 2400000, latitude: 28.6159, longitude: 77.2110, speed: 30, activity: true },
    { timestamp: Date.now() - 1800000, latitude: 28.6169, longitude: 77.2120, speed: 20, activity: true },
    { timestamp: Date.now() - 1200000, latitude: 28.6179, longitude: 77.2130, speed: 0, activity: false },
  ];

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && mapRef.current) {
        initializeMap();
        setMapLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.2090 },
      zoom: 15,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    // Draw the complete path
    drawPath();
  };

  const drawPath = () => {
    if (!mapInstanceRef.current || trackData.length === 0) return;

    // Clear existing markers and path
    clearMap();

    // Create path
    const pathCoordinates = trackData.map(point => ({
      lat: point.latitude,
      lng: point.longitude,
    }));

    pathRef.current = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 3,
    });

    pathRef.current.setMap(mapInstanceRef.current);

    // Add markers for start and end points
    const startMarker = new google.maps.Marker({
      position: pathCoordinates[0],
      map: mapInstanceRef.current,
      title: 'Start Point',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#10B981',
        fillOpacity: 1,
        strokeColor: '#065F46',
        strokeWeight: 2,
        scale: 8,
      },
    });

    const endMarker = new google.maps.Marker({
      position: pathCoordinates[pathCoordinates.length - 1],
      map: mapInstanceRef.current,
      title: 'End Point',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#EF4444',
        fillOpacity: 1,
        strokeColor: '#991B1B',
        strokeWeight: 2,
        scale: 8,
      },
    });

    markersRef.current = [startMarker, endMarker];

    // Fit bounds to show all points
    const bounds = new google.maps.LatLngBounds();
    pathCoordinates.forEach(coord => bounds.extend(coord));
    mapInstanceRef.current.fitBounds(bounds);
  };

  const clearMap = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing path
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }
  };

  const startAnimation = () => {
    if (!mapInstanceRef.current || trackData.length === 0) return;

    setIsAnimating(true);
    setCurrentPointIndex(0);
    animateToNextPoint(0);
  };

  const animateToNextPoint = (index: number) => {
    if (index >= trackData.length || !isAnimating) {
      setIsAnimating(false);
      return;
    }

    const point = trackData[index];
    const position = { lat: point.latitude, lng: point.longitude };

    // Create animated marker
    const animatedMarker = new google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: `Point ${index + 1} - Speed: ${point.speed} km/h`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: point.activity ? '#3B82F6' : '#6B7280',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: 6,
      },
      animation: google.maps.Animation.DROP,
    });

    markersRef.current.push(animatedMarker);

    // Pan to the current point
    mapInstanceRef.current?.panTo(position);

    setCurrentPointIndex(index);

    // Continue to next point after delay
    setTimeout(() => {
      if (isAnimating) {
        animateToNextPoint(index + 1);
      }
    }, 1000);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentPointIndex(0);
    drawPath();
  };

  if (!deviceId) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Select a device to view GPS tracks</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Route className="h-5 w-5" />
              GPS Track Visualization
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{deviceName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {trackData.length} points
            </Badge>
            {isAnimating && (
              <Badge variant="default">
                Point {currentPointIndex + 1}/{trackData.length}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isAnimating ? (
            <Button size="sm" onClick={startAnimation} disabled={!mapLoaded}>
              <Play className="h-4 w-4 mr-1" />
              Animate Track
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={stopAnimation}>
              <Pause className="h-4 w-4 mr-1" />
              Stop Animation
            </Button>
          )}
          
          <Button size="sm" variant="outline" onClick={resetAnimation} disabled={!mapLoaded}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset View
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border bg-gray-100"
        >
          {!mapLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsMap;
