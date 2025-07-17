import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { DeviceInfo } from '@/types/database-analytics';

interface StatsPanelProps {
  device: DeviceInfo | null;
}

const StatsPanel = ({ device }: StatsPanelProps) => {
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
          description: 'Your analysis request has been submitted to our backend server'
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

  const commonStats = [
    {
      title: 'Average Speed',
      value: device ? '24.5 km/h' : 'N/A',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Total Distance',
      value: device ? '156.7 km' : 'N/A',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      title: 'Active Time',
      value: device ? '8.5 hours' : 'N/A',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Data Points',
      value: device ? '1,247' : 'N/A',
      icon: Activity,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="h-64 bg-white border-t border-gray-200 flex gap-4 p-4">
      {/* Analysis Request Form */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Request Statistical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-3 w-3" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {device ? device.name : 'No device selected'}
              </Badge>
            </div>
          </div>
          
          <Textarea
            placeholder="Describe the specific analysis you need (e.g., 'Generate a report showing average speeds during active periods')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-16 text-sm resize-none"
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
        </CardContent>
      </Card>

      {/* Common Statistics */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Common Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {commonStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{stat.title}</p>
                  <p className="text-sm font-semibold text-gray-700">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {!device && (
            <div className="text-center text-gray-500 py-4 mt-2">
              <Activity className="h-6 w-6 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">Select a device to view statistics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;