
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
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface StatisticsPanelProps {
  deviceId: string | null;
  deviceName: string;
}

interface AnalysisRequest {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  result?: string;
}

const StatisticsPanel = ({ deviceId, deviceName }: StatisticsPanelProps) => {
  const [analysisType, setAnalysisType] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);
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
    if (!deviceId || !analysisType || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a device, analysis type, and provide a description',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const newRequest: AnalysisRequest = {
        id: `req_${Date.now()}`,
        type: analysisType,
        description: description.trim(),
        status: 'pending',
        timestamp: new Date()
      };

      // Simulate API call to backend
      setRequests(prev => [newRequest, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setRequests(prev => prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'processing' }
            : req
        ));
      }, 1000);

      // Simulate completion
      setTimeout(() => {
        setRequests(prev => prev.map(req => 
          req.id === newRequest.id 
            ? { 
                ...req, 
                status: 'completed',
                result: `Analysis completed for ${deviceName}. Statistical report has been generated and will be available for download shortly.`
              }
            : req
        ));
      }, 5000);

      toast({
        title: 'Request Submitted',
        description: 'Your analysis request has been submitted to our backend server'
      });

      // Clear form
      setDescription('');
      setAnalysisType('');
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit analysis request',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

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
                {deviceId ? deviceName : 'No device selected'}
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
            disabled={loading || !deviceId}
            size="sm"
            className="w-full"
          >
            <Send className="h-3 w-3 mr-1" />
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Analysis Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {requests.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <FileText className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">No requests yet</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="flex items-start gap-2 p-2 border rounded-lg">
                  <div className="mt-0.5">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium truncate">
                        {analysisTypes.find(t => t.value === request.type)?.label || request.type}
                      </p>
                      <Badge variant={getStatusColor(request.status) as any} className="text-xs">
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {request.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {request.timestamp.toLocaleTimeString()}
                    </p>
                    {request.result && (
                      <p className="text-xs text-green-600 mt-1">
                        {request.result}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
