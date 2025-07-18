
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Calculator, 
  FileText, 
  Send,
  Activity,
  MapPin,
  Clock,
  Zap,
  Gauge
} from 'lucide-react';
import { DeviceInfo, DataPoint } from '@/types/database-analytics';

interface StatsPanelProps {
  device: DeviceInfo | null;
  data: DataPoint[];
}

const StatsPanel = ({ device, data }: StatsPanelProps) => {
  const [analysisType, setAnalysisType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analysisTypes = [
    { value: 'movement_pattern', label: 'Movement Pattern Analysis', icon: TrendingUp },
    { value: 'speed_analysis', label: 'Speed Statistics', icon: BarChart3 },
    { value: 'activity_summary', label: 'Activity Summary Report', icon: Calculator },
    { value: 'distance_calculation', label: 'Distance & Route Analysis', icon: FileText },
    { value: 'custom', label: 'Custom Analysis', icon: Calculator },
  ];

  const statistics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalPoints: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        activePoints: 0,
        totalDistance: 0,
        averageSatellites: 0,
        timeSpan: 0
      };
    }

    const validSpeeds = data.filter(d => d.speed !== null && d.speed !== undefined && d.speed > 0);
    const activePoints = data.filter(d => d.activity === true);
    const validSatellites = data.filter(d => d.satellites !== null && d.satellites !== undefined);
    
    // Calculate total distance (rough approximation)
    let totalDistance = 0;
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      if (prev.latitude && prev.longitude && curr.latitude && curr.longitude) {
        const R = 6371; // Earth's radius in km
        const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
        const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        totalDistance += R * c;
      }
    }

    const timestamps = data.map(d => d.timestamp).filter(t => t);
    const timeSpan = timestamps.length > 0 ? (Math.max(...timestamps) - Math.min(...timestamps)) / (1000 * 60 * 60) : 0;

    return {
      totalPoints: data.length,
      averageSpeed: validSpeeds.length > 0 ? validSpeeds.reduce((sum, d) => sum + d.speed!, 0) / validSpeeds.length : 0,
      maxSpeed: validSpeeds.length > 0 ? Math.max(...validSpeeds.map(d => d.speed!)) : 0,
      activePoints: activePoints.length,
      totalDistance,
      averageSatellites: validSatellites.length > 0 ? validSatellites.reduce((sum, d) => sum + d.satellites!, 0) / validSatellites.length : 0,
      timeSpan
    };
  }, [data]);

  const handleSubmitRequest = async () => {
    if (!device || !analysisType || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a device, analysis type, and provide a description',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to backend
      setTimeout(() => {
        toast({
          title: 'Request Submitted',
          description: 'Your analysis request has been submitted to our backend server',
          className: 'bg-green-50 border-green-200 text-green-800'
        });
        
        // Clear form
        setDescription('');
        setAnalysisType('');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit analysis request',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Points',
      value: statistics.totalPoints.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Active Points',
      value: `${statistics.activePoints} (${statistics.totalPoints > 0 ? ((statistics.activePoints / statistics.totalPoints) * 100).toFixed(1) : 0}%)`,
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Avg Speed',
      value: `${statistics.averageSpeed.toFixed(1)} km/h`,
      icon: Gauge,
      color: 'text-orange-600'
    },
    {
      title: 'Max Speed',
      value: `${statistics.maxSpeed.toFixed(1)} km/h`,
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      title: 'Distance',
      value: `${statistics.totalDistance.toFixed(1)} km`,
      icon: MapPin,
      color: 'text-purple-600'
    },
    {
      title: 'Time Span',
      value: `${statistics.timeSpan.toFixed(1)} hours`,
      icon: Clock,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Statistics Cards */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics Overview
          </CardTitle>
          {device && (
            <Badge variant="outline" className="text-xs w-fit">
              {device.name}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {statsCards.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
              <div className={`${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">{stat.title}</p>
                <p className="text-sm font-semibold text-gray-700">{stat.value}</p>
              </div>
            </div>
          ))}
          
          {!device && (
            <div className="text-center text-gray-500 py-4">
              <Activity className="h-6 w-6 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">Select a device to view statistics</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Request Form */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Request Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={analysisType} onValueChange={setAnalysisType}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              {analysisTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-3 w-3" />
                    <span className="text-sm">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea
            placeholder="Describe the specific analysis you need (e.g., 'Generate a report showing average speeds during active periods')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 text-sm resize-none"
          />
          
          <Button 
            onClick={handleSubmitRequest}
            disabled={loading || !device}
            size="sm"
            className="w-full"
          >
            <Send className="h-3 w-3 mr-1" />
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>

          {data.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Data Quality</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Valid coordinates: {data.filter(d => d.latitude && d.longitude).length}/{data.length}</p>
                <p>• Speed data: {data.filter(d => d.speed !== null).length}/{data.length}</p>
                <p>• Satellite data: {data.filter(d => d.satellites !== null).length}/{data.length}</p>
                <p>• Accelerometer data: {data.filter(d => d.ax !== null && d.ay !== null && d.az !== null).length}/{data.length}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
